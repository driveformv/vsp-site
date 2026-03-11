#!/usr/bin/env python3
"""
Upload event featured images to Sanity and patch event documents.
Reads events-to-patch.json, uploads unique images, patches Sanity docs.
"""
import json
import os
import sys
import urllib.request
import urllib.error
import mimetypes
import time
import hashlib

PROJECT_ID = "jsftjck0"
DATASET = "production"
API_VERSION = "v2024-01-01"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

def get_token():
    env_path = os.path.join(BASE_DIR, ".env.local")
    with open(env_path) as f:
        for line in f:
            if line.startswith("SANITY_TOKEN="):
                return line.strip().split("=", 1)[1]
    raise ValueError("SANITY_TOKEN not found in .env.local")

def upload_image(file_path, token):
    """Upload an image to Sanity and return the asset document."""
    content_type = mimetypes.guess_type(file_path)[0] or "image/jpeg"
    filename = os.path.basename(file_path)

    with open(file_path, "rb") as f:
        data = f.read()

    url = f"https://{PROJECT_ID}.api.sanity.io/{API_VERSION}/assets/images/{DATASET}?filename={urllib.request.quote(filename)}"
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": content_type,
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            result = json.loads(resp.read())
            return result.get("document", {})
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  UPLOAD ERROR {e.code}: {body[:200]}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"  UPLOAD ERROR: {e}", file=sys.stderr)
        return None

def patch_event(doc_id, asset_ref, token):
    """Patch a Sanity event document to add the image field."""
    url = f"https://{PROJECT_ID}.api.sanity.io/{API_VERSION}/data/mutate/{DATASET}"
    mutations = {
        "mutations": [
            {
                "patch": {
                    "id": doc_id,
                    "set": {
                        "image": {
                            "_type": "image",
                            "asset": {
                                "_type": "reference",
                                "_ref": asset_ref,
                            },
                        }
                    },
                }
            }
        ]
    }
    data = json.dumps(mutations).encode()
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            result = json.loads(resp.read())
            return True
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  PATCH ERROR {e.code}: {body[:200]}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"  PATCH ERROR: {e}", file=sys.stderr)
        return False

def main():
    token = get_token()

    with open(os.path.join(DATA_DIR, "events-to-patch.json")) as f:
        patches = json.load(f)

    print(f"Total events to patch: {len(patches)}")

    # Group by local_path to avoid uploading the same image twice
    image_to_events = {}
    for p in patches:
        path = p["local_path"]
        if path not in image_to_events:
            image_to_events[path] = []
        image_to_events[path].append(p)

    print(f"Unique images to upload: {len(image_to_events)}")

    uploaded = 0
    patched = 0
    errors = 0
    total_images = len(image_to_events)

    for i, (image_path, events) in enumerate(image_to_events.items(), 1):
        filename = os.path.basename(image_path)
        print(f"\n[{i}/{total_images}] Uploading {filename}...")

        asset = upload_image(image_path, token)
        if not asset:
            errors += len(events)
            print(f"  FAILED - skipping {len(events)} events")
            continue

        asset_id = asset.get("_id")
        if not asset_id:
            errors += len(events)
            print(f"  NO ASSET ID - skipping {len(events)} events")
            continue

        uploaded += 1
        print(f"  Uploaded: {asset_id}")

        # Patch all events using this image
        for event in events:
            ok = patch_event(event["sanity_id"], asset_id, token)
            if ok:
                patched += 1
                print(f"  Patched: {event['wp_slug']}")
            else:
                errors += 1
                print(f"  FAILED to patch: {event['wp_slug']}")

        # Rate limit: small delay every 5 uploads
        if i % 5 == 0:
            time.sleep(1)

    print(f"\n=== SUMMARY ===")
    print(f"Images uploaded: {uploaded}/{total_images}")
    print(f"Events patched: {patched}/{len(patches)}")
    print(f"Errors: {errors}")

if __name__ == "__main__":
    main()
