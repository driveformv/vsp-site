/**
 * Import WordPress MEC Events into Sanity CMS
 *
 * Reads a JSON file exported from WordPress (via export-wordpress.sh or manual export)
 * and creates Sanity event documents with proper field mapping.
 *
 * Usage:
 *   SANITY_TOKEN=sk-... npx tsx scripts/import-events.ts ./data/wp-events.json
 *
 * Expected JSON shape (array of objects):
 * [
 *   {
 *     "post_id": 6951,
 *     "post_title": "Weekly Racing - September 26",
 *     "post_name": "weekly-racing-september-26",
 *     "post_content": "...",
 *     "post_date": "2026-09-26 12:00:00",
 *     "event_type": "weekly",           // weekly | special | practice | external
 *     "meta": {
 *       "mec_start_date": "2026-09-26",
 *       "mec_start_time_hour": "7",
 *       "mec_start_time_minutes": "30",
 *       "mec_start_time_ampm": "PM",
 *       "mec_end_date": "2026-09-26",
 *       "mec_end_time_hour": "9",
 *       "mec_end_time_minutes": "30",
 *       "mec_end_time_ampm": "PM",
 *       "mec_event_status": "EventScheduled",
 *       "mec_more_info": "",
 *       "_thumbnail_id": "6888"
 *     }
 *   }
 * ]
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

interface WPEventMeta {
  mec_start_date?: string;
  mec_start_time_hour?: string;
  mec_start_time_minutes?: string;
  mec_start_time_ampm?: string;
  mec_end_date?: string;
  mec_end_time_hour?: string;
  mec_end_time_minutes?: string;
  mec_end_time_ampm?: string;
  mec_event_status?: string;
  mec_more_info?: string;
  mec_more_info_title?: string;
  _thumbnail_id?: string;
  [key: string]: string | undefined;
}

interface WPEvent {
  post_id: number;
  post_title: string;
  post_name: string;
  post_content?: string;
  post_date?: string;
  event_type?: string;
  meta: WPEventMeta;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Convert 12-hour MEC time fields to a 24-hour "HH:MM" string.
 */
function mecTimeTo24(
  hour?: string,
  minutes?: string,
  ampm?: string
): string | null {
  if (!hour || !minutes) return null;

  let h = parseInt(hour, 10);
  const m = parseInt(minutes, 10);
  const period = (ampm || "AM").toUpperCase();

  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;

  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Build an ISO datetime string from a date and 12-hour time components.
 * Uses America/Denver (Mountain Time) as default for Vado, NM.
 */
function buildDatetime(
  date?: string,
  hour?: string,
  minutes?: string,
  ampm?: string
): string | null {
  if (!date) return null;

  const time24 = mecTimeTo24(hour, minutes, ampm);
  if (!time24) {
    // Date only -- default to noon MT
    return `${date}T12:00:00-07:00`;
  }

  return `${date}T${time24}:00-07:00`;
}

/**
 * Map MEC event_status to Sanity weatherStatus.
 */
function mapWeatherStatus(
  mecStatus?: string
): "normal" | "delayed" | "cancelled" | "tbd" {
  switch (mecStatus) {
    case "EventCancelled":
      return "cancelled";
    case "EventPostponed":
      return "delayed";
    case "EventMovedOnline":
      return "normal";
    case "EventScheduled":
    default:
      return "normal";
  }
}

/**
 * Map raw event_type string from the export to Sanity eventType values.
 * The export-wordpress.sh script sets this based on section headers in the DB.
 */
function mapEventType(
  raw?: string
): "weekly" | "special" | "practice" | "external" {
  const lower = (raw || "").toLowerCase();
  if (lower.includes("weekly")) return "weekly";
  if (lower.includes("special")) return "special";
  if (lower.includes("practice")) return "practice";
  if (lower.includes("external")) return "external";
  // Default to weekly if unknown
  return "weekly";
}

/**
 * Convert plain text or basic HTML content into a minimal Portable Text block.
 * Strips any remaining shortcodes or HTML tags for a clean paragraph.
 */
function textToPortableText(
  text?: string
): Array<{ _type: string; _key: string; children: unknown[]; style: string }> {
  if (!text || text.trim().length === 0) return [];

  // Strip shortcodes: [anything]
  const cleaned = text
    .replace(/\[\/?\w+[^\]]*\]/g, "")
    .replace(/<[^>]+>/g, "")
    .trim();

  if (!cleaned) return [];

  // Split by double newlines into paragraphs
  const paragraphs = cleaned.split(/\n{2,}/).filter((p) => p.trim());

  return paragraphs.map((para, i) => ({
    _type: "block",
    _key: `block-${i}`,
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: `span-${i}`,
        text: para.trim(),
        marks: [],
      },
    ],
  }));
}

// ---------------------------------------------------------------------------
// Main Import
// ---------------------------------------------------------------------------

async function importEvents(filePath: string): Promise<void> {
  // Read input file
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`ERROR: File not found: ${absolutePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(absolutePath, "utf-8");
  let events: WPEvent[];
  try {
    events = JSON.parse(raw);
  } catch {
    console.error("ERROR: Failed to parse JSON file. Check the format.");
    process.exit(1);
  }

  if (!Array.isArray(events)) {
    console.error("ERROR: JSON file must contain an array of event objects.");
    process.exit(1);
  }

  console.log(`Found ${events.length} events to import.\n`);

  // Fetch existing slugs to skip duplicates
  const existingSlugs: Set<string> = new Set();
  const existing = await sanity.fetch<Array<{ slug: string }>>(
    `*[_type == "event"]{ "slug": slug.current }`
  );
  for (const doc of existing) {
    if (doc.slug) existingSlugs.add(doc.slug);
  }
  console.log(`${existingSlugs.size} events already in Sanity.\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const wp of events) {
    const slug = wp.post_name;

    if (!slug) {
      console.warn(`  SKIP: Event ID ${wp.post_id} has no slug (post_name).`);
      skipped++;
      continue;
    }

    if (existingSlugs.has(slug)) {
      console.log(`  SKIP (duplicate): "${wp.post_title}" [${slug}]`);
      skipped++;
      continue;
    }

    const meta = wp.meta || {};
    const eventType = mapEventType(wp.event_type);
    const isExternal = eventType === "external";

    const datetime = buildDatetime(
      meta.mec_start_date,
      meta.mec_start_time_hour,
      meta.mec_start_time_minutes,
      meta.mec_start_time_ampm
    );

    if (!datetime) {
      console.warn(
        `  SKIP: Event "${wp.post_title}" has no start date in meta.`
      );
      skipped++;
      continue;
    }

    // Build gate time string (start time) and race time (could be derived)
    const gateTime = mecTimeTo24(
      meta.mec_start_time_hour,
      meta.mec_start_time_minutes,
      meta.mec_start_time_ampm
    );

    const doc = {
      _type: "event" as const,
      title: wp.post_title,
      slug: { _type: "slug" as const, current: slug },
      date: datetime,
      gateTime: gateTime || undefined,
      eventType,
      isExternal,
      externalUrl: isExternal ? meta.mec_more_info || undefined : undefined,
      weatherStatus: mapWeatherStatus(meta.mec_event_status),
      ticketLink: meta.mec_more_info || undefined,
      description: textToPortableText(wp.post_content),
    };

    try {
      const result = await sanity.create(doc);
      console.log(
        `  CREATED: "${wp.post_title}" -> ${result._id} [${eventType}]`
      );
      existingSlugs.add(slug);
      created++;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ERROR: "${wp.post_title}" - ${message}`);
      errors++;
    }
  }

  console.log("\n--- Import Summary ---");
  console.log(`  Created: ${created}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors:  ${errors}`);
  console.log(`  Total:   ${events.length}`);
}

// ---------------------------------------------------------------------------
// CLI Entry
// ---------------------------------------------------------------------------

const inputFile = process.argv[2];
if (!inputFile) {
  console.error("Usage: npx tsx scripts/import-events.ts <path-to-json>");
  console.error("");
  console.error("Example:");
  console.error(
    "  SANITY_TOKEN=sk-... npx tsx scripts/import-events.ts ./data/wp-events.json"
  );
  process.exit(1);
}

importEvents(inputFile).catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
