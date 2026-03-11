#!/usr/bin/env python3
"""
Scrape WordPress event pages to get featured image URLs.
Maps thumbnail_id -> og:image URL -> local file path in wp-media/.
"""
import json
import re
import urllib.request
import os
import time
import sys

BASE_URL = "https://vadospeedwaypark.com/events/"
WP_MEDIA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "wp-media")
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data")

def scrape_og_image(slug):
    """Fetch event page and extract og:image URL."""
    url = f"{BASE_URL}{slug}/"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
        match = re.search(r'og:image"\s+content="([^"]+)"', html)
        if match:
            return match.group(1)
    except Exception as e:
        print(f"  ERROR scraping {slug}: {e}", file=sys.stderr)
    return None

def url_to_local_path(image_url):
    """Convert WP uploads URL to local wp-media/ path."""
    # URL: https://vadospeedwaypark.com/wp-content/uploads/2023/05/file.jpg
    # Local: wp-media/2023/05/file.jpg
    match = re.search(r"wp-content/uploads/(.+)$", image_url)
    if match:
        rel_path = match.group(1)
        local = os.path.join(WP_MEDIA_DIR, rel_path)
        if os.path.exists(local):
            return local
        # Try URL-decoded version
        from urllib.parse import unquote
        local_decoded = os.path.join(WP_MEDIA_DIR, unquote(rel_path))
        if os.path.exists(local_decoded):
            return local_decoded
    return None

def main():
    with open(os.path.join(DATA_DIR, "thumb-to-slug.json")) as f:
        thumb_to_slug = json.load(f)

    results = {}  # thumb_id -> { url, local_path }
    total = len(thumb_to_slug)

    for i, (thumb_id, slug) in enumerate(thumb_to_slug.items(), 1):
        print(f"[{i}/{total}] Scraping {slug} (thumb_id={thumb_id})...", end=" ")
        og_url = scrape_og_image(slug)
        if og_url:
            local = url_to_local_path(og_url)
            results[thumb_id] = {
                "url": og_url,
                "local_path": local,
                "slug": slug,
            }
            status = "LOCAL" if local else "NO LOCAL FILE"
            print(f"{status}: {og_url}")
        else:
            print("NO OG:IMAGE FOUND")

        # Be polite - small delay
        if i % 10 == 0:
            time.sleep(0.5)

    # Save results
    output_path = os.path.join(DATA_DIR, "thumb-image-map.json")
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)

    found = len(results)
    with_local = sum(1 for r in results.values() if r.get("local_path"))
    print(f"\n--- SUMMARY ---")
    print(f"Total thumbnail IDs: {total}")
    print(f"Found og:image: {found}")
    print(f"Matched to local file: {with_local}")
    print(f"Missing local file: {found - with_local}")
    print(f"Saved to: {output_path}")

if __name__ == "__main__":
    main()
