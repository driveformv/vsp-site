/**
 * upload-to-sanity.ts
 * Reads downloaded WordPress media from wp-media/, categorizes files,
 * and uploads them to the appropriate service:
 *   - Sponsor logos -> Sanity asset API
 *   - Race photos / general media -> Supabase Storage
 *
 * Required env vars:
 *   SANITY_PROJECT_ID  (default: jsftjck0)
 *   SANITY_DATASET     (default: production)
 *   SANITY_TOKEN       (required - write token from sanity.io/manage)
 *
 * Optional env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Run:
 *   npx tsx scripts/upload-to-sanity.ts
 *   npx tsx scripts/upload-to-sanity.ts --dry-run
 */

import { createClient as createSanityClient } from "@sanity/client";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import * as fs from "node:fs";
import * as path from "node:path";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || "jsftjck0";
const SANITY_DATASET = process.env.SANITY_DATASET || "production";
const SANITY_TOKEN = process.env.SANITY_TOKEN;

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const MEDIA_DIR = path.resolve(__dirname, "../wp-media");
const ALLOWED_EXTENSIONS = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
]);

// Supabase storage bucket for race photos / general media
const SUPABASE_BUCKET = "media";

const DRY_RUN = process.argv.includes("--dry-run");

// ---------------------------------------------------------------------------
// Categorization
// ---------------------------------------------------------------------------

/**
 * Determines where a file should go based on its path within wp-media/.
 *
 * Heuristic:
 *   - Paths containing "sponsor", "partner", or "logo" -> sanity (sponsor logos)
 *   - Everything else -> supabase (race photos, general media)
 *
 * Adjust these rules as needed when more folder conventions are known.
 */
type Destination = "sanity" | "supabase";

function categorize(relativePath: string): Destination {
  const lower = relativePath.toLowerCase();
  if (
    lower.includes("sponsor") ||
    lower.includes("partner") ||
    lower.includes("logo")
  ) {
    return "sanity";
  }
  return "supabase";
}

// ---------------------------------------------------------------------------
// File discovery
// ---------------------------------------------------------------------------

function walkDir(dir: string, base: string = dir): string[] {
  const entries: string[] = [];
  if (!fs.existsSync(dir)) return entries;

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      entries.push(...walkDir(full, base));
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (ALLOWED_EXTENSIONS.has(ext)) {
        entries.push(full);
      }
    }
  }
  return entries;
}

// ---------------------------------------------------------------------------
// Sanity upload
// ---------------------------------------------------------------------------

async function uploadToSanity(
  client: ReturnType<typeof createSanityClient>,
  filePath: string
): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const filename = path.basename(filePath);
  const ext = path.extname(filePath).toLowerCase();

  // Determine content type
  const contentTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };

  const asset = await client.assets.upload("image", buffer, {
    filename,
    contentType: contentTypes[ext] || "application/octet-stream",
  });

  return asset._id;
}

// ---------------------------------------------------------------------------
// Supabase upload
// ---------------------------------------------------------------------------

async function uploadToSupabase(
  client: ReturnType<typeof createSupabaseClient>,
  filePath: string,
  relativePath: string
): Promise<string> {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();

  const contentTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };

  // Use the relative path as the storage path (preserves WP folder structure)
  const storagePath = relativePath.replace(/\\/g, "/");

  const { data, error } = await client.storage
    .from(SUPABASE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: contentTypes[ext] || "application/octet-stream",
      upsert: true,
    });

  if (error) throw error;
  return data.path;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("==============================================");
  console.log("  VSP Media Upload Script");
  if (DRY_RUN) {
    console.log("  MODE: DRY RUN (no uploads will happen)");
  }
  console.log("==============================================\n");

  // Validate required config
  if (!SANITY_TOKEN && !DRY_RUN) {
    console.error(
      "Error: SANITY_TOKEN env var is required.\n" +
        "Get a write token from https://www.sanity.io/manage"
    );
    process.exit(1);
  }

  const hasSupabase = SUPABASE_URL && SUPABASE_KEY;
  if (!hasSupabase && !DRY_RUN) {
    console.warn(
      "Warning: Supabase credentials not set. Race photos will be skipped.\n" +
        "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to enable.\n"
    );
  }

  // Discover files
  if (!fs.existsSync(MEDIA_DIR)) {
    console.error(
      `Error: Media directory not found at ${MEDIA_DIR}\n` +
        "Run ./scripts/download-media.sh first."
    );
    process.exit(1);
  }

  const files = walkDir(MEDIA_DIR);
  console.log(`Found ${files.length} media files in ${MEDIA_DIR}\n`);

  if (files.length === 0) {
    console.log("Nothing to upload.");
    return;
  }

  // Categorize
  const sanityFiles: string[] = [];
  const supabaseFiles: string[] = [];

  for (const file of files) {
    const rel = path.relative(MEDIA_DIR, file);
    const dest = categorize(rel);
    if (dest === "sanity") {
      sanityFiles.push(file);
    } else {
      supabaseFiles.push(file);
    }
  }

  console.log(`Categorized:`);
  console.log(`  Sanity (sponsor logos):  ${sanityFiles.length}`);
  console.log(`  Supabase (race photos): ${supabaseFiles.length}\n`);

  if (DRY_RUN) {
    console.log("--- Sanity files ---");
    for (const f of sanityFiles) {
      console.log(`  ${path.relative(MEDIA_DIR, f)}`);
    }
    console.log("\n--- Supabase files ---");
    for (const f of supabaseFiles.slice(0, 50)) {
      console.log(`  ${path.relative(MEDIA_DIR, f)}`);
    }
    if (supabaseFiles.length > 50) {
      console.log(`  ... and ${supabaseFiles.length - 50} more`);
    }
    console.log("\nDry run complete. No files uploaded.");
    return;
  }

  // Initialize clients
  const sanity = createSanityClient({
    projectId: SANITY_PROJECT_ID,
    dataset: SANITY_DATASET,
    apiVersion: "2024-01-01",
    token: SANITY_TOKEN,
    useCdn: false,
  });

  const supabase = hasSupabase
    ? createSupabaseClient(SUPABASE_URL, SUPABASE_KEY)
    : null;

  // Track results
  let sanitySuccess = 0;
  let sanityFail = 0;
  let supabaseSuccess = 0;
  let supabaseFail = 0;

  // Upload to Sanity
  if (sanityFiles.length > 0) {
    console.log("Uploading sponsor logos to Sanity...\n");
    for (let i = 0; i < sanityFiles.length; i++) {
      const file = sanityFiles[i];
      const rel = path.relative(MEDIA_DIR, file);
      const progress = `[${i + 1}/${sanityFiles.length}]`;
      try {
        const assetId = await uploadToSanity(sanity, file);
        console.log(`  ${progress} OK   ${rel} -> ${assetId}`);
        sanitySuccess++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`  ${progress} FAIL ${rel} -- ${msg}`);
        sanityFail++;
      }
    }
    console.log("");
  }

  // Upload to Supabase
  if (supabaseFiles.length > 0 && supabase) {
    console.log("Uploading race photos to Supabase...\n");
    for (let i = 0; i < supabaseFiles.length; i++) {
      const file = supabaseFiles[i];
      const rel = path.relative(MEDIA_DIR, file);
      const progress = `[${i + 1}/${supabaseFiles.length}]`;
      try {
        const storagePath = await uploadToSupabase(supabase, file, rel);
        console.log(`  ${progress} OK   ${rel} -> ${storagePath}`);
        supabaseSuccess++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error(`  ${progress} FAIL ${rel} -- ${msg}`);
        supabaseFail++;
      }
    }
    console.log("");
  } else if (supabaseFiles.length > 0 && !supabase) {
    console.log("Skipping Supabase uploads (no credentials).\n");
  }

  // Summary
  console.log("==============================================");
  console.log("  Upload Summary");
  console.log("==============================================");
  console.log(`  Sanity:   ${sanitySuccess} uploaded, ${sanityFail} failed`);
  console.log(
    `  Supabase: ${supabaseSuccess} uploaded, ${supabaseFail} failed`
  );
  console.log(
    `  Total:    ${sanitySuccess + supabaseSuccess} uploaded, ${sanityFail + supabaseFail} failed`
  );
  console.log("==============================================");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
