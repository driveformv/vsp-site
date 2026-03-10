/**
 * Import WordPress Posts into Sanity CMS as newsPost documents
 *
 * Reads a JSON file exported from WordPress, strips all Divi/ET Builder
 * shortcodes, converts cleaned HTML to Portable Text, and creates
 * Sanity newsPost documents.
 *
 * Usage:
 *   SANITY_TOKEN=sk-... npx tsx scripts/import-news.ts ./data/wp-posts.json
 *
 * Also supports legacy flag format:
 *   SANITY_TOKEN=sk-... npx tsx scripts/import-news.ts --input ./data/wp-posts.json [--dry-run]
 *
 * Expected JSON shape (array of objects):
 * [
 *   {
 *     "post_id": 1234,
 *     "post_title": "Race Recap: Fall Nationals",
 *     "post_name": "race-recap-fall-nationals",
 *     "post_content": "[et_pb_section]...[/et_pb_section]<p>Real content here</p>",
 *     "post_date": "2026-09-01 15:30:00",
 *     "post_excerpt": "Short summary of the post...",
 *     "categories": ["Results", "News"],
 *     "featured_image_url": "https://vadospeedwaypark.com/wp-content/uploads/2026/09/photo.jpg"
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

interface WPPost {
  // Support both naming conventions (new export vs legacy)
  post_id?: number;
  id?: number;
  post_title?: string;
  title?: string;
  post_name?: string;
  slug?: string;
  post_content?: string;
  content?: string;
  post_date?: string;
  date?: string;
  post_excerpt?: string;
  excerpt?: string;
  categories?: string[];
  category?: string;
  featured_image_url?: string;
}

interface PortableTextBlock {
  _type: string;
  _key: string;
  style: string;
  markDefs: unknown[];
  children: Array<{
    _type: string;
    _key: string;
    text: string;
    marks: string[];
  }>;
}

// ---------------------------------------------------------------------------
// Divi/Shortcode Stripping
// ---------------------------------------------------------------------------

/**
 * Comprehensive list of Divi Builder and common WordPress shortcode tags.
 * These get completely stripped (opening, closing, and self-closing forms).
 */
const DIVI_SHORTCODE_TAGS = [
  // Divi structure
  "et_pb_section",
  "et_pb_row",
  "et_pb_row_inner",
  "et_pb_column",
  "et_pb_column_inner",
  // Divi modules
  "et_pb_text",
  "et_pb_image",
  "et_pb_button",
  "et_pb_blurb",
  "et_pb_code",
  "et_pb_divider",
  "et_pb_menu",
  "et_pb_video",
  "et_pb_gallery",
  "et_pb_slider",
  "et_pb_slide",
  "et_pb_tabs",
  "et_pb_tab",
  "et_pb_toggle",
  "et_pb_accordion",
  "et_pb_counter",
  "et_pb_counters",
  "et_pb_social_media_follow",
  "et_pb_social_media_follow_network",
  "et_pb_sidebar",
  "et_pb_blog",
  "et_pb_cta",
  "et_pb_contact_form",
  "et_pb_contact_field",
  "et_pb_signup",
  "et_pb_map",
  "et_pb_map_pin",
  "et_pb_fullwidth_header",
  "et_pb_fullwidth_image",
  "et_pb_fullwidth_slider",
  "et_pb_fullwidth_menu",
  "et_pb_fullwidth_code",
  "et_pb_fullwidth_post_title",
  "et_pb_post_title",
  // Third-party Divi modules (logo carousel etc.)
  "ba_logo_carousel",
  "ba_logo_carousel_child",
  // Common WordPress shortcodes
  "caption",
  "gallery",
  "embed",
  "video",
  "audio",
  "playlist",
];

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Strip ALL Divi/ET Builder shortcodes from content.
 * Keeps only the text/HTML content inside them.
 */
function stripShortcodes(html: string): string {
  let result = html;

  const tagPattern = DIVI_SHORTCODE_TAGS.map(escapeRegex).join("|");

  // Remove opening tags with attributes: [et_pb_section attr="value"]
  const openingRegex = new RegExp(
    `\\[(?:${tagPattern})(?:\\s[^\\]]*)?\\]`,
    "gi"
  );
  result = result.replace(openingRegex, "");

  // Remove closing tags: [/et_pb_section]
  const closingRegex = new RegExp(`\\[/(?:${tagPattern})\\]`, "gi");
  result = result.replace(closingRegex, "");

  // Catch any remaining shortcodes we might have missed
  result = result.replace(/\[\/?\w+(?:_\w+)*(?:\s[^\]]*)?\/?\]/g, "");

  // Remove empty HTML tags left behind
  result = result.replace(
    /<(div|span|p|section|article)\s*[^>]*>\s*<\/\1>/gi,
    ""
  );

  // Clean up excessive whitespace
  result = result.replace(/\n{3,}/g, "\n\n");

  return result.trim();
}

// ---------------------------------------------------------------------------
// HTML to Portable Text
// ---------------------------------------------------------------------------

let keyCounter = 0;
function generateKey(): string {
  return `k${Date.now().toString(36)}${(keyCounter++).toString(36)}`;
}

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, "\u201C")
    .replace(/&#8221;/g, "\u201D")
    .replace(/&nbsp;/g, " ");
}

/**
 * Convert cleaned HTML content into Sanity Portable Text blocks.
 * Handles paragraphs, headings, list items, and plain text.
 */
function htmlToPortableText(html: string): PortableTextBlock[] {
  const cleaned = stripShortcodes(html);
  const blocks: PortableTextBlock[] = [];

  // Extract headings first (replace with empty string after capturing)
  let remaining = cleaned.replace(
    /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi,
    (_match, level: string, content: string) => {
      const text = stripTags(content).trim();
      if (text) {
        blocks.push({
          _type: "block",
          _key: generateKey(),
          style: `h${level}`,
          markDefs: [],
          children: [
            { _type: "span", _key: generateKey(), text, marks: [] },
          ],
        });
      }
      return "";
    }
  );

  // Extract list items
  remaining = remaining.replace(
    /<li[^>]*>([\s\S]*?)<\/li>/gi,
    (_match, content: string) => {
      const text = stripTags(content).trim();
      if (text) {
        blocks.push({
          _type: "block",
          _key: generateKey(),
          style: "normal",
          markDefs: [],
          children: [
            {
              _type: "span",
              _key: generateKey(),
              text: `- ${text}`,
              marks: [],
            },
          ],
        });
      }
      return "";
    }
  );

  // Convert <br> tags to newlines for splitting
  remaining = remaining.replace(/<br\s*\/?>/gi, "\n");

  // Remove remaining container tags
  remaining = remaining.replace(/<\/?(div|section|article|ul|ol)[^>]*>/gi, "\n");

  // Split on <p> tags
  const paragraphs = remaining
    .split(/<\/?p[^>]*>/i)
    .map((p) => stripTags(p).trim())
    .filter((p) => p.length > 0);

  for (const text of paragraphs) {
    blocks.push({
      _type: "block",
      _key: generateKey(),
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: generateKey(), text, marks: [] }],
    });
  }

  // If no content was extracted, add a placeholder
  if (blocks.length === 0) {
    const plainText = stripTags(cleaned).trim();
    if (plainText) {
      // Split plain text by double newlines into paragraphs
      const lines = plainText.split(/\n{2,}/).filter((l) => l.trim());
      for (const line of lines) {
        blocks.push({
          _type: "block",
          _key: generateKey(),
          style: "normal",
          markDefs: [],
          children: [
            { _type: "span", _key: generateKey(), text: line.trim(), marks: [] },
          ],
        });
      }
    }
  }

  if (blocks.length === 0) {
    blocks.push({
      _type: "block",
      _key: generateKey(),
      style: "normal",
      markDefs: [],
      children: [
        {
          _type: "span",
          _key: generateKey(),
          text: "Content pending migration.",
          marks: [],
        },
      ],
    });
  }

  return blocks;
}

// ---------------------------------------------------------------------------
// Category Mapping
// ---------------------------------------------------------------------------

/**
 * Map WordPress category names to Sanity newsPost category values.
 * WordPress categories from inventory: Videos, Photos, News, Results
 */
function mapCategory(
  wpCategories?: string[] | string
): "news" | "recap" | "announcement" | "feature" {
  // Handle both array and string input
  const cats: string[] = Array.isArray(wpCategories)
    ? wpCategories
    : wpCategories
      ? [wpCategories]
      : [];

  if (cats.length === 0) return "news";

  const lower = cats.map((c) => c.toLowerCase());

  if (
    lower.some(
      (c) =>
        c.includes("result") || c.includes("recap") || c.includes("race result")
    )
  ) {
    return "recap";
  }

  if (lower.some((c) => c.includes("video") || c.includes("photo"))) {
    return "feature";
  }

  if (
    lower.some(
      (c) =>
        c.includes("announce") ||
        c.includes("press") ||
        c.includes("driver")
    )
  ) {
    return "announcement";
  }

  if (lower.some((c) => c.includes("feature"))) {
    return "feature";
  }

  return "news";
}

// ---------------------------------------------------------------------------
// Main Import
// ---------------------------------------------------------------------------

async function importNews(
  filePath: string,
  dryRun: boolean
): Promise<void> {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`ERROR: File not found: ${absolutePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(absolutePath, "utf-8");
  let posts: WPPost[];
  try {
    posts = JSON.parse(raw);
  } catch {
    console.error("ERROR: Failed to parse JSON file. Check the format.");
    process.exit(1);
  }

  if (!Array.isArray(posts)) {
    console.error("ERROR: JSON file must contain an array of post objects.");
    process.exit(1);
  }

  console.log(
    `Found ${posts.length} posts to import${dryRun ? " (DRY RUN)" : ""}.\n`
  );

  // Fetch existing slugs
  const existingSlugs: Set<string> = new Set();
  const existing = await sanity.fetch<Array<{ slug: string }>>(
    `*[_type == "newsPost"]{ "slug": slug.current }`
  );
  for (const doc of existing) {
    if (doc.slug) existingSlugs.add(doc.slug);
  }
  console.log(`${existingSlugs.size} news posts already in Sanity.\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const wp of posts) {
    // Support both naming conventions
    const slug = wp.post_name || wp.slug;
    const title = wp.post_title || wp.title || "Untitled";
    const content = wp.post_content || wp.content || "";
    const postDate = wp.post_date || wp.date;
    const excerpt = wp.post_excerpt || wp.excerpt;
    const categories = wp.categories || (wp.category ? [wp.category] : []);

    if (!slug) {
      console.warn(
        `  SKIP: Post ID ${wp.post_id || wp.id} has no slug.`
      );
      skipped++;
      continue;
    }

    if (existingSlugs.has(slug)) {
      console.log(`  SKIP (duplicate): "${title}" [${slug}]`);
      skipped++;
      continue;
    }

    const category = mapCategory(categories);
    const body = htmlToPortableText(content);

    // Build publish date as ISO string
    let publishDate: string | undefined;
    if (postDate) {
      // Handle both "2026-09-01 15:30:00" and "2026-09-01" formats
      if (postDate.includes(" ")) {
        publishDate = postDate.replace(" ", "T") + "-07:00";
      } else {
        publishDate = postDate + "T12:00:00-07:00";
      }
    }

    // Truncate excerpt to 200 chars (Sanity schema max)
    let finalExcerpt = excerpt || "";
    if (!finalExcerpt && content) {
      const stripped = stripTags(stripShortcodes(content)).trim();
      finalExcerpt = stripped.slice(0, 197);
      if (stripped.length > 197) finalExcerpt += "...";
    }
    if (finalExcerpt.length > 200) {
      finalExcerpt = finalExcerpt.slice(0, 197) + "...";
    }

    const doc = {
      _type: "newsPost" as const,
      title,
      slug: { _type: "slug" as const, current: slug },
      category,
      body,
      publishDate,
      excerpt: finalExcerpt || undefined,
    };

    if (wp.featured_image_url) {
      console.log(`    (has featured image: ${wp.featured_image_url})`);
    }

    if (dryRun) {
      console.log(`  DRY RUN: Would create "${title}" [${category}]`);
      created++;
      continue;
    }

    try {
      const result = await sanity.create(doc);
      console.log(
        `  CREATED: "${title}" -> ${result._id} [${category}]`
      );
      existingSlugs.add(slug);
      created++;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`  ERROR: "${title}" - ${message}`);
      errors++;
    }
  }

  console.log("\n--- Import Summary ---");
  console.log(`  Created: ${created}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors:  ${errors}`);
  console.log(`  Total:   ${posts.length}`);
}

// ---------------------------------------------------------------------------
// CLI Entry
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);

// Support both: direct path arg OR --input flag
let inputFile: string | null = null;
let dryRun = false;

const inputIdx = args.indexOf("--input");
if (inputIdx !== -1 && args[inputIdx + 1]) {
  inputFile = args[inputIdx + 1];
} else if (args.length > 0 && !args[0].startsWith("--")) {
  inputFile = args[0];
}

dryRun = args.includes("--dry-run");

if (!inputFile) {
  console.error("Usage: npx tsx scripts/import-news.ts <path-to-json>");
  console.error("       npx tsx scripts/import-news.ts --input <path-to-json> [--dry-run]");
  console.error("");
  console.error("Example:");
  console.error(
    "  SANITY_TOKEN=sk-... npx tsx scripts/import-news.ts ./data/wp-posts.json"
  );
  process.exit(1);
}

importNews(inputFile, dryRun).catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
