#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Export WordPress data from MySQL via SSH tunnel
#
# Connects to the Kinsta-hosted WordPress database through an SSH tunnel
# and exports events, posts, and sponsor data as JSON files for the
# Sanity import scripts.
#
# Usage:
#   chmod +x scripts/export-wordpress.sh
#   ./scripts/export-wordpress.sh [--events] [--posts] [--sponsors] [--all]
#
# Output:
#   data/wp-events.json     -> Feed to: npx tsx scripts/import-events.ts
#   data/wp-posts.json      -> Feed to: npx tsx scripts/import-news.ts
#   data/wp-sponsors.json   -> Feed to: npx tsx scripts/import-sponsors.ts
#
# Prerequisites:
#   - SSH access configured for the remote host
#   - mysql client installed locally
#   - jq installed locally (for JSON formatting)
# ---------------------------------------------------------------------------

set -euo pipefail

# ---------------------------------------------------------------------------
# Connection details
# ---------------------------------------------------------------------------
SSH_USER="vadospeedwaypark"
SSH_HOST="34.174.186.154"
SSH_PORT="24029"

DB_USER="vadospeedwaypark"
DB_PASS="${KINSTA_DB_PASSWORD:-Dwt3437LRBd9s35}"
DB_NAME="vadospeedwaypark"

# WordPress table prefix (standard is wp_, adjust if different)
TABLE_PREFIX="wp_"

LOCAL_MYSQL_PORT="33306"
OUTPUT_DIR="./data"

# ---------------------------------------------------------------------------
# Parse args
# ---------------------------------------------------------------------------
DO_ALL=false
DO_EVENTS=false
DO_POSTS=false
DO_SPONSORS=false

for arg in "$@"; do
  case "$arg" in
    --all) DO_ALL=true ;;
    --events) DO_EVENTS=true ;;
    --posts) DO_POSTS=true ;;
    --sponsors) DO_SPONSORS=true ;;
    *)
      echo "Unknown arg: $arg"
      echo "Usage: $0 [--events] [--posts] [--sponsors] [--all]"
      exit 1
      ;;
  esac
done

# Default to all if nothing specified
if ! $DO_EVENTS && ! $DO_POSTS && ! $DO_SPONSORS; then
  DO_ALL=true
fi

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------
mkdir -p "$OUTPUT_DIR"

echo "=== VSP WordPress Data Export ==="
echo "Output: $OUTPUT_DIR/"
echo ""

# Check for required tools
for cmd in ssh mysql jq; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "ERROR: '$cmd' is required but not installed."
    exit 1
  fi
done

# ---------------------------------------------------------------------------
# SSH Tunnel
# ---------------------------------------------------------------------------
echo "Opening SSH tunnel to ${SSH_HOST}:${SSH_PORT}..."
echo "  Local port: ${LOCAL_MYSQL_PORT} -> Remote MySQL: 127.0.0.1:3306"

# Kill any existing tunnel on this port
pkill -f "ssh.*${LOCAL_MYSQL_PORT}:127.0.0.1:3306.*${SSH_HOST}" 2>/dev/null || true
sleep 1

# Start tunnel in background
sshpass -p "${KINSTA_SSH_PASSWORD:-rluJMWW8CL0iN5w}" \
  ssh -f -N -o StrictHostKeyChecking=no \
  -L "${LOCAL_MYSQL_PORT}:127.0.0.1:3306" \
  -p "${SSH_PORT}" \
  "${SSH_USER}@${SSH_HOST}" \
  2>/dev/null

# Give the tunnel a moment to establish
sleep 2

# Verify tunnel is up
if ! mysql -h 127.0.0.1 -P "${LOCAL_MYSQL_PORT}" -u "${DB_USER}" -p"${DB_PASS}" \
  -e "SELECT 1" "${DB_NAME}" &>/dev/null; then
  echo "ERROR: Could not connect to MySQL through the SSH tunnel."
  echo "  Check SSH credentials and that MySQL is running on the remote host."
  exit 1
fi

echo "  Connected successfully."
echo ""

# Helper: run a MySQL query and return raw output (no headers, tab-separated)
run_query() {
  mysql -h 127.0.0.1 -P "${LOCAL_MYSQL_PORT}" \
    -u "${DB_USER}" -p"${DB_PASS}" \
    --default-character-set=utf8mb4 \
    --raw --skip-column-names \
    "${DB_NAME}" -e "$1"
}

# ---------------------------------------------------------------------------
# Export 1: MEC Events
# ---------------------------------------------------------------------------
export_events() {
  echo "--- Exporting Events ---"

  EVENTS_SQL="
  SELECT JSON_ARRAYAGG(
    JSON_OBJECT(
      'post_id', p.ID,
      'post_title', p.post_title,
      'post_name', p.post_name,
      'post_content', p.post_content,
      'post_date', DATE_FORMAT(p.post_date, '%Y-%m-%d %H:%i:%s'),
      'event_type', COALESCE(
        (SELECT
          CASE
            WHEN t.name LIKE '%weekly%' OR t.name LIKE '%Weekly%' THEN 'weekly'
            WHEN t.name LIKE '%special%' OR t.name LIKE '%Special%' THEN 'special'
            WHEN t.name LIKE '%practice%' OR t.name LIKE '%Practice%' OR t.name LIKE '%open%' THEN 'practice'
            WHEN t.name LIKE '%external%' OR t.name LIKE '%External%' OR t.name LIKE '%high limit%' THEN 'external'
            ELSE 'weekly'
          END
        FROM ${TABLE_PREFIX}term_relationships tr
        JOIN ${TABLE_PREFIX}term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
        JOIN ${TABLE_PREFIX}terms t ON tt.term_id = t.term_id
        WHERE tr.object_id = p.ID AND tt.taxonomy = 'mec_category'
        LIMIT 1),
        'weekly'
      ),
      'meta', (
        SELECT JSON_OBJECTAGG(pm.meta_key, pm.meta_value)
        FROM ${TABLE_PREFIX}postmeta pm
        WHERE pm.post_id = p.ID
        AND pm.meta_key IN (
          'mec_start_date', 'mec_start_time_hour', 'mec_start_time_minutes', 'mec_start_time_ampm',
          'mec_end_date', 'mec_end_time_hour', 'mec_end_time_minutes', 'mec_end_time_ampm',
          'mec_event_status', 'mec_more_info', 'mec_more_info_title', '_thumbnail_id',
          'mec_allday', 'mec_cost'
        )
      )
    )
  )
  FROM ${TABLE_PREFIX}posts p
  WHERE p.post_type = 'mec-events'
    AND p.post_status = 'publish'
  ORDER BY p.post_date DESC;
  "

  echo "  Running events query..."
  EVENTS_JSON=$(run_query "$EVENTS_SQL")

  if [ -z "$EVENTS_JSON" ] || [ "$EVENTS_JSON" = "NULL" ]; then
    echo "  WARNING: No events found. Writing empty array."
    echo "[]" > "${OUTPUT_DIR}/wp-events.json"
  else
    echo "$EVENTS_JSON" | jq '.' > "${OUTPUT_DIR}/wp-events.json"
  fi

  EVENT_COUNT=$(jq 'length' "${OUTPUT_DIR}/wp-events.json")
  echo "  Exported ${EVENT_COUNT} events -> ${OUTPUT_DIR}/wp-events.json"
  echo ""
}

# ---------------------------------------------------------------------------
# Export 2: Posts (News, Results, Videos, Photos)
# ---------------------------------------------------------------------------
export_posts() {
  echo "--- Exporting Posts ---"

  POSTS_SQL="
  SELECT JSON_ARRAYAGG(
    JSON_OBJECT(
      'post_id', p.ID,
      'post_title', p.post_title,
      'post_name', p.post_name,
      'post_content', p.post_content,
      'post_date', DATE_FORMAT(p.post_date, '%Y-%m-%d %H:%i:%s'),
      'post_excerpt', p.post_excerpt,
      'categories', (
        SELECT JSON_ARRAYAGG(t.name)
        FROM ${TABLE_PREFIX}term_relationships tr
        JOIN ${TABLE_PREFIX}term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
        JOIN ${TABLE_PREFIX}terms t ON tt.term_id = t.term_id
        WHERE tr.object_id = p.ID AND tt.taxonomy = 'category'
      ),
      'featured_image_url', (
        SELECT CONCAT(
          (SELECT option_value FROM ${TABLE_PREFIX}options WHERE option_name = 'siteurl'),
          '/wp-content/uploads/',
          img_meta.meta_value
        )
        FROM ${TABLE_PREFIX}postmeta thumb
        JOIN ${TABLE_PREFIX}postmeta img_meta ON img_meta.post_id = thumb.meta_value
          AND img_meta.meta_key = '_wp_attached_file'
        WHERE thumb.post_id = p.ID AND thumb.meta_key = '_thumbnail_id'
        LIMIT 1
      )
    )
  )
  FROM ${TABLE_PREFIX}posts p
  WHERE p.post_type = 'post'
    AND p.post_status = 'publish'
  ORDER BY p.post_date DESC;
  "

  echo "  Running posts query..."
  POSTS_JSON=$(run_query "$POSTS_SQL")

  if [ -z "$POSTS_JSON" ] || [ "$POSTS_JSON" = "NULL" ]; then
    echo "  WARNING: No posts found. Writing empty array."
    echo "[]" > "${OUTPUT_DIR}/wp-posts.json"
  else
    echo "$POSTS_JSON" | jq '.' > "${OUTPUT_DIR}/wp-posts.json"
  fi

  POST_COUNT=$(jq 'length' "${OUTPUT_DIR}/wp-posts.json")
  echo "  Exported ${POST_COUNT} posts -> ${OUTPUT_DIR}/wp-posts.json"
  echo ""
}

# ---------------------------------------------------------------------------
# Export 3: Sponsors
# ---------------------------------------------------------------------------
export_sponsors() {
  echo "--- Exporting Sponsors ---"

  # Try custom post type first. Many WordPress sites store sponsors
  # as a custom post type ('sponsor', 'sponsors', 'partner', etc.)
  SPONSORS_SQL="
  SELECT JSON_ARRAYAGG(
    JSON_OBJECT(
      'name', p.post_title,
      'slug', p.post_name,
      'logo_url', (
        SELECT CONCAT(
          (SELECT option_value FROM ${TABLE_PREFIX}options WHERE option_name = 'siteurl'),
          '/wp-content/uploads/',
          img_meta.meta_value
        )
        FROM ${TABLE_PREFIX}postmeta thumb
        JOIN ${TABLE_PREFIX}postmeta img_meta ON img_meta.post_id = thumb.meta_value
          AND img_meta.meta_key = '_wp_attached_file'
        WHERE thumb.post_id = p.ID AND thumb.meta_key = '_thumbnail_id'
        LIMIT 1
      ),
      'website_url', (
        SELECT pm.meta_value
        FROM ${TABLE_PREFIX}postmeta pm
        WHERE pm.post_id = p.ID
          AND pm.meta_key IN ('website_url', 'sponsor_url', '_sponsor_url', 'url')
        LIMIT 1
      ),
      'tier', COALESCE(
        (SELECT t.name
         FROM ${TABLE_PREFIX}term_relationships tr
         JOIN ${TABLE_PREFIX}term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
         JOIN ${TABLE_PREFIX}terms t ON tt.term_id = t.term_id
         WHERE tr.object_id = p.ID
           AND tt.taxonomy IN ('sponsor_tier', 'sponsor-tier', 'sponsor_category')
         LIMIT 1),
        'bronze'
      ),
      'description', p.post_excerpt
    )
  )
  FROM ${TABLE_PREFIX}posts p
  WHERE p.post_type IN ('sponsor', 'sponsors', 'partner', 'partners')
    AND p.post_status = 'publish'
  ORDER BY p.post_title ASC;
  "

  echo "  Running sponsors query (custom post type)..."
  SPONSORS_JSON=$(run_query "$SPONSORS_SQL" 2>/dev/null || echo "")

  if [ -z "$SPONSORS_JSON" ] || [ "$SPONSORS_JSON" = "NULL" ]; then
    echo "  NOTE: No custom sponsor post type found."
    echo "  Attempting to extract from logo carousel in page content..."

    # Extract sponsor data from Divi ba_logo_carousel shortcodes.
    # These store image URLs, alt text, and link URLs as shortcode attributes.
    CAROUSEL_SQL="
    SELECT p.post_content
    FROM ${TABLE_PREFIX}posts p
    WHERE p.post_status = 'publish'
      AND p.post_content LIKE '%ba_logo_carousel%'
    ORDER BY p.ID DESC
    LIMIT 5;
    "
    CAROUSEL_CONTENT=$(run_query "$CAROUSEL_SQL" 2>/dev/null || echo "")

    if [ -n "$CAROUSEL_CONTENT" ]; then
      # Parse logo data from ba_logo_carousel_child shortcode attributes
      echo "$CAROUSEL_CONTENT" | \
        grep -oP 'ba_logo_carousel_child[^]]*' | \
        while IFS= read -r line; do
          url=$(echo "$line" | grep -oP 'image_url="[^"]*"' | sed 's/image_url="//;s/"//' || echo "")
          alt=$(echo "$line" | grep -oP 'alt="[^"]*"' | sed 's/alt="//;s/"//' || echo "")
          link=$(echo "$line" | grep -oP 'link_url="[^"]*"' | sed 's/link_url="//;s/"//' || echo "")
          if [ -n "$url" ]; then
            name="${alt:-Unknown Sponsor}"
            # Escape special JSON characters in name
            name=$(echo "$name" | sed 's/\\/\\\\/g; s/"/\\"/g')
            echo "{\"name\":\"$name\",\"logo_url\":\"$url\",\"website_url\":\"$link\",\"tier\":\"bronze\"}"
          fi
        done | jq -s '.' > "${OUTPUT_DIR}/wp-sponsors.json" 2>/dev/null

      if [ ! -s "${OUTPUT_DIR}/wp-sponsors.json" ]; then
        echo "  WARNING: Could not parse carousel content. Writing empty array."
        echo "  You may need to manually create wp-sponsors.json."
        echo "[]" > "${OUTPUT_DIR}/wp-sponsors.json"
      fi
    else
      echo "  WARNING: No carousel content found. Writing empty array."
      echo "  You may need to manually create wp-sponsors.json."
      echo "[]" > "${OUTPUT_DIR}/wp-sponsors.json"
    fi
  else
    echo "$SPONSORS_JSON" | jq '.' > "${OUTPUT_DIR}/wp-sponsors.json"
  fi

  SPONSOR_COUNT=$(jq 'length' "${OUTPUT_DIR}/wp-sponsors.json")
  echo "  Exported ${SPONSOR_COUNT} sponsors -> ${OUTPUT_DIR}/wp-sponsors.json"
  echo ""
}

# ---------------------------------------------------------------------------
# Run exports
# ---------------------------------------------------------------------------
if $DO_ALL || $DO_EVENTS; then export_events; fi
if $DO_ALL || $DO_POSTS; then export_posts; fi
if $DO_ALL || $DO_SPONSORS; then export_sponsors; fi

# ---------------------------------------------------------------------------
# Cleanup: kill SSH tunnel
# ---------------------------------------------------------------------------
echo "Closing SSH tunnel..."
pkill -f "ssh.*${LOCAL_MYSQL_PORT}:127.0.0.1:3306.*${SSH_HOST}" 2>/dev/null || true

echo ""
echo "=== Export Complete ==="
echo ""
echo "Files in ${OUTPUT_DIR}/:"
ls -la "${OUTPUT_DIR}/" 2>/dev/null || echo "  (directory empty)"
echo ""
echo "Next steps:"
echo "  SANITY_TOKEN=sk-... npx tsx scripts/import-events.ts ${OUTPUT_DIR}/wp-events.json"
echo "  SANITY_TOKEN=sk-... npx tsx scripts/import-news.ts ${OUTPUT_DIR}/wp-posts.json"
echo "  SANITY_TOKEN=sk-... npx tsx scripts/import-sponsors.ts ${OUTPUT_DIR}/wp-sponsors.json"
echo ""
