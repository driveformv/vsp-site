#!/usr/bin/env python3
"""
Scrape WordPress news post pages for og:image, map to local files,
upload to Sanity, and patch newsPost documents.
"""
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
import mimetypes

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
WP_MEDIA_DIR = os.path.join(BASE_DIR, "wp-media")
PROJECT_ID = "jsftjck0"
DATASET = "production"
API_VERSION = "v2024-01-01"

def get_tokens():
    env_path = os.path.join(BASE_DIR, ".env.local")
    tokens = {}
    with open(env_path) as f:
        for line in f:
            if line.startswith("SANITY_TOKEN="):
                tokens["write"] = line.strip().split("=", 1)[1].strip('"').strip("'")
            elif line.startswith("SANITY_API_READ_TOKEN="):
                tokens["read"] = line.strip().split("=", 1)[1].strip('"').strip("'")
    return tokens

def scrape_og_image(slug):
    url = f"https://vadospeedwaypark.com/{slug}/"
    for attempt in range(3):
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
                "Accept": "text/html",
            })
            with urllib.request.urlopen(req, timeout=15) as resp:
                final_url = resp.url
                if "vadospeedwaypark.com" not in final_url:
                    return None
                html = resp.read().decode("utf-8", errors="ignore")
            match = re.search(r'og:image"\s+content="([^"]+)"', html)
            if match:
                img_url = match.group(1)
                if "FAV.png" in img_url or "cropped-FAV" in img_url:
                    return None
                return img_url
            return None
        except urllib.error.HTTPError as e:
            if e.code in (429, 502, 503) and attempt < 2:
                time.sleep(3 * (attempt + 1))
                continue
            return None
        except Exception as e:
            if attempt < 2:
                time.sleep(2)
                continue
            return None
    return None

def url_to_local_path(image_url):
    match = re.search(r"wp-content/uploads/(.+)$", image_url)
    if match:
        rel_path = match.group(1)
        local = os.path.join(WP_MEDIA_DIR, rel_path)
        if os.path.exists(local):
            return local
        from urllib.parse import unquote
        local_decoded = os.path.join(WP_MEDIA_DIR, unquote(rel_path))
        if os.path.exists(local_decoded):
            return local_decoded
    return None

def download_external_image(image_url):
    """Download image from external URL to temp file."""
    try:
        req = urllib.request.Request(image_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=15) as resp:
            content_type = resp.headers.get("Content-Type", "image/jpeg")
            ext = ".jpg"
            if "png" in content_type:
                ext = ".png"
            elif "webp" in content_type:
                ext = ".webp"
            data = resp.read()
            if len(data) < 1000:  # Too small, likely error
                return None
            tmp_path = f"/tmp/wp-news-img-{hash(image_url) % 100000}{ext}"
            with open(tmp_path, "wb") as f:
                f.write(data)
            return tmp_path
    except Exception:
        return None

def upload_image(file_path, token):
    content_type = mimetypes.guess_type(file_path)[0] or "image/jpeg"
    filename = os.path.basename(file_path)
    with open(file_path, "rb") as f:
        data = f.read()
    url = f"https://{PROJECT_ID}.api.sanity.io/{API_VERSION}/assets/images/{DATASET}?filename={urllib.request.quote(filename)}"
    req = urllib.request.Request(url, data=data, headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": content_type,
    }, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read())
            return result.get("document", {}).get("_id")
    except Exception as e:
        print(f"  UPLOAD ERROR: {e}", file=sys.stderr)
        return None

def patch_news_post(doc_id, asset_id, token):
    url = f"https://{PROJECT_ID}.api.sanity.io/{API_VERSION}/data/mutate/{DATASET}"
    mutations = {"mutations": [{"patch": {"id": doc_id, "set": {
        "featuredImage": {"_type": "image", "asset": {"_type": "reference", "_ref": asset_id}}
    }}}]}
    data = json.dumps(mutations).encode()
    req = urllib.request.Request(url, data=data, headers={
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return True
    except Exception as e:
        print(f"  PATCH ERROR: {e}", file=sys.stderr)
        return False

def main():
    tokens = get_tokens()
    write_token = tokens["write"]
    read_token = tokens["read"]

    # Load WP posts
    with open(os.path.join(DATA_DIR, "wp-posts.json")) as f:
        wp_posts = json.load(f)

    # Get all Sanity newsPost slugs -> IDs
    print("Fetching Sanity newsPost IDs...")
    url = f"https://{PROJECT_ID}.api.sanity.io/{API_VERSION}/data/query/{DATASET}"
    query = '*[_type=="newsPost"]{"slug": slug.current, _id}'
    req = urllib.request.Request(
        f"{url}?query={urllib.request.quote(query)}",
        headers={"Authorization": f"Bearer {read_token}"}
    )
    with urllib.request.urlopen(req) as resp:
        sanity_posts = json.loads(resp.read())["result"]

    sanity_slug_map = {p["slug"]: p["_id"] for p in sanity_posts}
    print(f"Sanity news posts: {len(sanity_slug_map)}")

    # Match WP slugs to Sanity
    to_process = []
    for wp in wp_posts:
        slug = wp["post_name"]
        if slug in sanity_slug_map:
            to_process.append({"wp_slug": slug, "sanity_id": sanity_slug_map[slug]})

    print(f"WP posts matching Sanity: {len(to_process)}")

    # Scrape, upload, patch
    uploaded_cache = {}  # image_url -> asset_id
    scraped = 0
    with_image = 0
    patched = 0
    errors = 0
    total = len(to_process)

    for i, item in enumerate(to_process, 1):
        slug = item["wp_slug"]
        sanity_id = item["sanity_id"]

        if i % 25 == 0 or i <= 3:
            print(f"\n[{i}/{total}] Scraping {slug}...", flush=True)

        og_url = scrape_og_image(slug)
        scraped += 1

        if not og_url:
            continue

        with_image += 1

        # Check cache
        if og_url in uploaded_cache:
            asset_id = uploaded_cache[og_url]
        else:
            # Try local file first
            local_path = url_to_local_path(og_url)
            if not local_path:
                # Download from URL
                local_path = download_external_image(og_url)

            if not local_path:
                errors += 1
                continue

            asset_id = upload_image(local_path, write_token)
            if not asset_id:
                errors += 1
                continue

            uploaded_cache[og_url] = asset_id

        # Patch
        if patch_news_post(sanity_id, asset_id, write_token):
            patched += 1
        else:
            errors += 1

        # Rate limit - be polite to WP server
        time.sleep(0.3)
        if i % 20 == 0:
            time.sleep(2)
            sys.stdout.flush()

    print(f"\n=== SUMMARY ===")
    print(f"Posts scraped: {scraped}/{total}")
    print(f"Posts with featured image: {with_image}")
    print(f"Unique images uploaded: {len(uploaded_cache)}")
    print(f"Posts patched: {patched}")
    print(f"Errors: {errors}")

if __name__ == "__main__":
    main()
