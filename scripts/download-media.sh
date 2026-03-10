#!/usr/bin/env bash
# =============================================================================
# download-media.sh
# Downloads all WordPress media uploads from Kinsta via rsync over SSH.
#
# Usage:
#   ./scripts/download-media.sh           # Full download
#   ./scripts/download-media.sh --dry-run # Preview what will be transferred
#
# SSH Target:
#   vadospeedwaypark@34.174.186.154:24029
#
# Source:
#   /www/vadospeedwaypark_162/public/wp-content/uploads/
#
# Destination:
#   ./wp-media/ (relative to project root)
# =============================================================================

set -euo pipefail

# -- Configuration -----------------------------------------------------------

SSH_USER="vadospeedwaypark"
SSH_HOST="34.174.186.154"
SSH_PORT="24029"
REMOTE_PATH="/www/vadospeedwaypark_162/public/wp-content/uploads/"
LOCAL_PATH="/Users/hectorsanchez/Projects/vsp-website/wp-media/"

# -- Parse flags -------------------------------------------------------------

DRY_RUN=""
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN="--dry-run"
  echo "============================================"
  echo "  DRY RUN - no files will be transferred"
  echo "============================================"
  echo ""
fi

# -- Pre-flight checks -------------------------------------------------------

if ! command -v rsync &> /dev/null; then
  echo "Error: rsync is not installed."
  exit 1
fi

# Create destination directory if it does not exist
mkdir -p "$LOCAL_PATH"

# -- Run rsync ---------------------------------------------------------------

echo "Source:      ${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}"
echo "Destination: ${LOCAL_PATH}"
echo "Port:        ${SSH_PORT}"
echo ""
echo "Starting rsync..."
echo ""

rsync -avz \
  --progress \
  --human-readable \
  --stats \
  $DRY_RUN \
  -e "sshpass -p '${KINSTA_SSH_PASSWORD:-rluJMWW8CL0iN5w}' ssh -o StrictHostKeyChecking=no -p ${SSH_PORT}" \
  --exclude="*.php" \
  --exclude="*.html" \
  --exclude="thumbs.db" \
  --exclude="Thumbs.db" \
  --exclude=".DS_Store" \
  --exclude=".htaccess" \
  --exclude="*.bak" \
  --exclude="*.log" \
  --exclude="*.tmp" \
  "${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}" \
  "${LOCAL_PATH}"

echo ""
echo "============================================"
if [[ -n "$DRY_RUN" ]]; then
  echo "  Dry run complete. No files transferred."
  echo "  Run without --dry-run to download."
else
  echo "  Download complete."
  echo "  Files saved to: ${LOCAL_PATH}"
  # Show summary of what was downloaded
  FILE_COUNT=$(find "$LOCAL_PATH" -type f 2>/dev/null | wc -l | tr -d ' ')
  TOTAL_SIZE=$(du -sh "$LOCAL_PATH" 2>/dev/null | cut -f1)
  echo "  Total files: ${FILE_COUNT}"
  echo "  Total size:  ${TOTAL_SIZE}"
fi
echo "============================================"
