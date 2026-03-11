/**
 * Migration script: Add isFeatured, status, recapNote to all events.
 * Non-destructive: only sets fields that don't already have values.
 *
 * Usage: npx tsx scripts/migrate-events-schema.ts [--dry-run]
 */

import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

const isDryRun = process.argv.includes('--dry-run');

async function migrate() {
  const events = await client.fetch<
    {
      _id: string;
      title: string;
      date: string;
      weatherStatus?: string;
      isFeatured?: boolean;
      status?: string;
    }[]
  >(`*[_type == "event"] { _id, title, date, weatherStatus, isFeatured, status }`);

  console.log(`Found ${events.length} events`);
  if (isDryRun) console.log('DRY RUN - no changes will be made\n');

  const now = new Date();
  let updated = 0;
  let skipped = 0;

  for (const event of events) {
    const patches: Record<string, unknown> = {};
    const eventDate = new Date(event.date);

    // Set isFeatured if not already set
    if (event.isFeatured === undefined || event.isFeatured === null) {
      patches.isFeatured = false;
    }

    // Set status if not already set
    if (!event.status) {
      if (event.weatherStatus === 'cancelled') {
        patches.status = 'cancelled';
      } else if (event.weatherStatus === 'delayed') {
        patches.status = 'postponed';
      } else if (eventDate < now) {
        patches.status = 'completed';
      } else {
        patches.status = 'scheduled';
      }
    }

    if (Object.keys(patches).length === 0) {
      skipped++;
      continue;
    }

    const statusLabel = patches.status || event.status || '(unchanged)';
    console.log(`${isDryRun ? '[DRY] ' : ''}${event.title} -> status: ${statusLabel}, isFeatured: ${patches.isFeatured ?? event.isFeatured}`);

    if (!isDryRun) {
      await client.patch(event._id).set(patches).commit();
    }
    updated++;
  }

  console.log(`\nDone. Updated: ${updated}, Skipped: ${skipped}`);
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
