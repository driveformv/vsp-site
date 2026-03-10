/**
 * Import Sponsors into Sanity CMS
 *
 * Reads a JSON file of sponsor data, uploads logo images to Sanity,
 * and creates sponsor documents with tier assignment.
 *
 * Usage:
 *   SANITY_TOKEN=sk-... npx tsx scripts/import-sponsors.ts ./data/wp-sponsors.json
 *
 * Expected JSON shape (array of objects):
 * [
 *   {
 *     "name": "O'Reilly Auto Parts",
 *     "slug": "oreilly-auto-parts",
 *     "logo_url": "https://vadospeedwaypark.com/wp-content/uploads/2025/01/oreilly-logo.png",
 *     "logo_path": "./media/sponsors/oreilly-logo.png",
 *     "website_url": "https://www.oreillyauto.com",
 *     "tier": "gold",
 *     "description": "Official auto parts sponsor"
 *   }
 * ]
 *
 * Logo source priority:
 *   1. logo_path (local file -- fastest, use after running download-media.sh)
 *   2. logo_url  (remote URL -- downloaded on the fly)
 *
 * Tier values: title | gold | silver | bronze (defaults to bronze if missing)
 */

import { createClient } from "@sanity/client";
import * as fs from "fs";
import * as path from "path";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const SANITY_PROJECT_ID = "jsftjck0";
const SANITY_DATASET = "production";
const SANITY_API_VERSION = "2024-01-01";

const token = process.env.SANITY_TOKEN;
if (!token) {
  console.error("ERROR: SANITY_TOKEN environment variable is required.");
  console.error("  Export it before running: export SANITY_TOKEN=sk-...");
  process.exit(1);
}

const sanity = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  token,
  useCdn: false,
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WPSponsor {
  name: string;
  slug?: string;
  logo_url?: string;
  logo_path?: string;
  website_url?: string;
  tier?: "title" | "gold" | "silver" | "bronze";
  description?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generate a URL-safe slug from a name string.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Upload a logo image to Sanity assets.
 * Tries local file first, then falls back to remote URL.
 */
async function uploadLogo(
  sponsor: WPSponsor
): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } } | null> {
  // Try local file first
  if (sponsor.logo_path) {
    const localPath = path.resolve(sponsor.logo_path);
    if (fs.existsSync(localPath)) {
      try {
        const buffer = fs.readFileSync(localPath);
        const filename = path.basename(localPath);
        const asset = await sanity.assets.upload("image", buffer, { filename });
        return {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`    Logo upload failed (local): ${msg}`);
      }
    }
  }

  // Try remote URL
  if (sponsor.logo_url) {
    try {
      const response = await fetch(sponsor.logo_url);
      if (!response.ok) {
        console.warn(
          `    Logo download failed: HTTP ${response.status} for ${sponsor.logo_url}`
        );
        return null;
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const urlPath = new URL(sponsor.logo_url).pathname;
      const filename = path.basename(urlPath) || "logo.png";

      const asset = await sanity.assets.upload("image", buffer, { filename });
      return {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`    Logo upload failed (remote): ${msg}`);
    }
  }

  return null;
}

/**
 * Validate tier value, default to bronze.
 */
function normalizeTier(
  raw?: string
): "title" | "gold" | "silver" | "bronze" {
  const lower = (raw || "").toLowerCase();
  if (lower === "title" || lower === "presenting") return "title";
  if (lower === "gold" || lower === "premier") return "gold";
  if (lower === "silver") return "silver";
  return "bronze";
}

// ---------------------------------------------------------------------------
// Main Import
// ---------------------------------------------------------------------------

async function importSponsors(filePath: string): Promise<void> {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`ERROR: File not found: ${absolutePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(absolutePath, "utf-8");
  let sponsors: WPSponsor[];
  try {
    sponsors = JSON.parse(raw);
  } catch {
    console.error("ERROR: Failed to parse JSON file. Check the format.");
    process.exit(1);
  }

  if (!Array.isArray(sponsors)) {
    console.error(
      "ERROR: JSON file must contain an array of sponsor objects."
    );
    process.exit(1);
  }

  console.log(`Found ${sponsors.length} sponsors to import.\n`);

  // Fetch existing sponsor names to skip duplicates
  const existingNames: Set<string> = new Set();
  const existing = await sanity.fetch<Array<{ name: string }>>(
    `*[_type == "sponsor"]{ name }`
  );
  for (const doc of existing) {
    if (doc.name) existingNames.add(doc.name.toLowerCase());
  }
  console.log(`${existingNames.size} sponsors already in Sanity.\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const sp of sponsors) {
    if (!sp.name) {
      console.warn("  SKIP: Sponsor entry has no name.");
      skipped++;
      continue;
    }

    if (existingNames.has(sp.name.toLowerCase())) {
      console.log(`  SKIP (duplicate): "${sp.name}"`);
      skipped++;
      continue;
    }

    console.log(`  Importing: "${sp.name}"...`);

    // Upload logo
    const logo = await uploadLogo(sp);
    if (!logo) {
      console.warn(`    WARNING: No logo uploaded for "${sp.name}".`);
      // Sponsor schema requires logo -- skip if we can't upload
      // Alternatively, create without logo and add manually later:
      // Remove this continue if you want sponsors without logos.
      console.warn(`    SKIP: Logo is required by schema.`);
      skipped++;
      continue;
    }

    const tier = normalizeTier(sp.tier);

    const doc = {
      _type: "sponsor" as const,
      name: sp.name,
      logo,
      tier,
      websiteUrl: sp.website_url || undefined,
      active: true,
      description: sp.description || undefined,
    };

    try {
      const result = await sanity.create(doc);
      console.log(`  CREATED: "${sp.name}" -> ${result._id} [${tier}]`);
      existingNames.add(sp.name.toLowerCase());
      created++;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ERROR: "${sp.name}" - ${message}`);
      errors++;
    }
  }

  console.log("\n--- Import Summary ---");
  console.log(`  Created: ${created}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors:  ${errors}`);
  console.log(`  Total:   ${sponsors.length}`);
}

// ---------------------------------------------------------------------------
// CLI Entry
// ---------------------------------------------------------------------------

const inputFile = process.argv[2];
if (!inputFile) {
  console.error("Usage: npx tsx scripts/import-sponsors.ts <path-to-json>");
  console.error("");
  console.error("Example:");
  console.error(
    "  SANITY_TOKEN=sk-... npx tsx scripts/import-sponsors.ts ./data/wp-sponsors.json"
  );
  process.exit(1);
}

importSponsors(inputFile).catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
