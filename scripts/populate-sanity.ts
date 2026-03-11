/**
 * Populate Sanity with siteSettings, firstTimerGuide, navigation, and raceClasses.
 * Run: npx tsx scripts/populate-sanity.ts
 */

import { createClient } from '@sanity/client';
import { readFileSync } from 'fs';

// Parse .env.local manually (no dotenv dependency)
const envFile = readFileSync('.env.local', 'utf-8');
for (const line of envFile.split('\n')) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) continue;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx === -1) continue;
  const key = trimmed.slice(0, eqIdx);
  const val = trimmed.slice(eqIdx + 1);
  if (!process.env[key]) process.env[key] = val;
}

const client = createClient({
  projectId: 'jsftjck0',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_TOKEN,
});

// ─── Site Settings (singleton) ───────────────────────────────────────────────

const siteSettings = {
  _type: 'siteSettings',
  _id: 'siteSettings',
  siteName: 'Vado Speedway Park',
  tagline: "Southern New Mexico's Home for Dirt Track Racing",
  ticketUrl: 'https://www.myracepass.com/tracks/2355/tickets',
  streamUrl: 'https://www.floracing.com/track/vado-speedway-park',
  phone: '(575) 233-3566',
  email: 'info@vadospeedwaypark.com',
  address: '15900 Stern Dr\nVado, NM 88072',
  socialLinks: {
    facebook: 'https://www.facebook.com/VadoSpeedwayPark',
    instagram: 'https://www.instagram.com/vadospeedwaypark/',
    youtube: 'https://www.youtube.com/@vadospeedwaypark',
    twitter: 'https://twitter.com/VadoSpeedway',
  },
};

// ─── First Timer Guide (singleton) ──────────────────────────────────────────

const firstTimerGuide = {
  _type: 'firstTimerGuide',
  _id: 'firstTimerGuide',
  sections: [
    {
      _key: 'what-to-expect',
      title: 'What to Expect',
      body: [
        {
          _type: 'block',
          _key: 'b1',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 's1',
              text: 'Vado Speedway Park hosts weekly dirt track racing on a 3/8-mile clay semi-banked oval. A typical race night features hot laps, heat races, and main events across multiple classes. Gates open about an hour before racing starts, giving you time to find seats and grab food.',
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _key: 'getting-here',
      title: 'Getting Here',
      body: [
        {
          _type: 'block',
          _key: 'b2',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 's2',
              text: 'The track is located at 15900 Stern Dr, Vado, NM 88072 -- about 20 minutes south of Las Cruces on Interstate 10. Take Exit 155 and follow the signs. Free parking is available on-site.',
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _key: 'what-to-bring',
      title: 'What to Bring',
      body: [
        {
          _type: 'block',
          _key: 'b3',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 's3',
              text: 'Ear protection is strongly recommended, especially for children. Bring sunscreen for early arrivals, a light jacket for after sundown, and comfortable shoes. Blankets and seat cushions are welcome in the grandstands. Outside food and drinks are not permitted -- concessions are available on-site.',
              marks: [],
            },
          ],
        },
      ],
    },
    {
      _key: 'tickets-admission',
      title: 'Tickets and Admission',
      body: [
        {
          _type: 'block',
          _key: 'b4',
          style: 'normal',
          markDefs: [],
          children: [
            {
              _type: 'span',
              _key: 's4',
              text: 'Tickets can be purchased online through MyRacePass or at the gate on race night. Check the schedule for specific event pricing. Children 5 and under are free. Pit passes are available for those who want an up-close look at the cars and teams.',
              marks: [],
            },
          ],
        },
      ],
    },
  ],
  faqItems: [
    {
      _key: 'faq1',
      question: 'What time do gates open?',
      answer: 'Gates typically open one hour before hot laps begin. Check the specific event listing for exact times.',
    },
    {
      _key: 'faq2',
      question: 'Can I bring my own food and drinks?',
      answer: 'Outside food and beverages are not permitted. Full concession facilities are available with a variety of food and drink options.',
    },
    {
      _key: 'faq3',
      question: 'Is there reserved seating?',
      answer: 'General admission grandstand seating is first-come, first-served. VIP suite rentals are available for select events -- contact the track office for availability.',
    },
    {
      _key: 'faq4',
      question: 'What happens if it rains?',
      answer: 'Dirt track racing is weather dependent. If an event is rained out, check our website and social media for updates on rescheduling. Pre-purchased tickets are honored for the rescheduled date.',
    },
    {
      _key: 'faq5',
      question: 'How long does a race night last?',
      answer: 'A typical race night runs about 3 to 4 hours from the first green flag to the final checkered flag.',
    },
    {
      _key: 'faq6',
      question: 'Are pit passes available?',
      answer: 'Yes. Pit passes can be purchased at the gate. All pit visitors must sign a waiver. Closed-toe shoes are required in the pit area.',
    },
    {
      _key: 'faq7',
      question: 'Is the facility wheelchair accessible?',
      answer: 'Yes. The grandstands and concession areas are accessible. Contact the track office in advance if you need special accommodations.',
    },
  ],
};

// ─── Navigation ─────────────────────────────────────────────────────────────

const navigationItems = [
  { label: 'Schedule', url: '/events', sortOrder: 1 },
  { label: 'Results', url: '/results', sortOrder: 2 },
  { label: 'Points', url: '/points', sortOrder: 3 },
  { label: 'News', url: '/news', sortOrder: 4 },
  { label: 'Plan Your Visit', url: '/plan-your-visit', sortOrder: 5 },
  { label: 'Drivers', url: '/drivers', sortOrder: 6 },
  { label: 'Sponsors', url: '/sponsors', sortOrder: 7 },
  { label: 'About', url: '/about', sortOrder: 8 },
];

// ─── Race Classes ───────────────────────────────────────────────────────────
// Sponsor-branded names from the Points page class mappings

const raceClasses = [
  { className: 'USRA Modifieds', sponsorName: 'Mesilla Valley Transportation', division: 'Open Wheel', active: true },
  { className: 'USRA Stock Cars', sponsorName: 'El Paso Electric', division: 'Stock', active: true },
  { className: 'USRA B-Mods', sponsorName: 'Hacienda Carpet & Tile', division: 'Stock', active: true },
  { className: 'USRA Hobby Stocks', sponsorName: 'Dickerson Concrete', division: 'Stock', active: true },
  { className: 'USRA Tuners', sponsorName: 'Las Cruces Motor Sports', division: 'Compact', active: true },
  { className: 'Mod Lites', sponsorName: 'Vado Speedway Park', division: 'Open Wheel', active: true },
  { className: 'Limited Mods', sponsorName: 'Rio Grande Waste Services', division: 'Open Wheel', active: true },
  { className: 'X-Mods', sponsorName: '', division: 'Open Wheel', active: true },
  { className: 'Factory Stocks', sponsorName: 'Dickerson Concrete', division: 'Stock', active: true },
  { className: 'Mini Stocks', sponsorName: '', division: 'Stock', active: true },
  { className: 'Sport Compacts', sponsorName: '', division: 'Compact', active: true },
];

// ─── Execute ────────────────────────────────────────────────────────────────

async function run() {
  console.log('Populating Sanity with site data...\n');

  // 1. Site Settings (createOrReplace for singleton)
  console.log('1/4 Creating siteSettings...');
  await client.createOrReplace(siteSettings);
  console.log('  Done.\n');

  // 2. First Timer Guide (createOrReplace for singleton)
  console.log('2/4 Creating firstTimerGuide...');
  await client.createOrReplace(firstTimerGuide);
  console.log('  Done.\n');

  // 3. Navigation items
  console.log('3/4 Creating navigation items...');
  // Delete existing nav items first to avoid duplicates
  const existingNav = await client.fetch<{ _id: string }[]>(`*[_type == "navigation"]{ _id }`);
  if (existingNav.length > 0) {
    console.log(`  Deleting ${existingNav.length} existing nav items...`);
    const tx = client.transaction();
    for (const item of existingNav) {
      tx.delete(item._id);
    }
    await tx.commit();
  }
  for (const item of navigationItems) {
    await client.create({
      _type: 'navigation',
      ...item,
      isExternal: false,
    });
    console.log(`  Created: ${item.label}`);
  }
  console.log('  Done.\n');

  // 4. Race Classes
  console.log('4/4 Creating race classes...');
  const existingClasses = await client.fetch<{ _id: string }[]>(`*[_type == "raceClass"]{ _id }`);
  if (existingClasses.length > 0) {
    console.log(`  Deleting ${existingClasses.length} existing race classes...`);
    const tx = client.transaction();
    for (const item of existingClasses) {
      tx.delete(item._id);
    }
    await tx.commit();
  }
  for (const cls of raceClasses) {
    await client.create({
      _type: 'raceClass',
      ...cls,
    });
    console.log(`  Created: ${cls.sponsorName ? `${cls.sponsorName} ` : ''}${cls.className}`);
  }
  console.log('  Done.\n');

  console.log('All Sanity data populated successfully.');
}

run().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
