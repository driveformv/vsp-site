**Vado Speedway Park**

**Website Rebuild Plan**

WordPress → Next.js + Sanity + Supabase + Vercel

Prepared by: MVT Marketing & Communications \| March 2026

**1. Overview**

This document outlines the full plan to migrate vadospeedwaypark.com
from WordPress (currently hosted on Kinsta) to a modern stack built on
Next.js, Sanity CMS, Supabase, and Vercel. The goal is a faster, more
maintainable site that the VSP team can keep up-to-date without touching
code.

**Objectives**

- Eliminate Kinsta/WordPress hosting costs and maintenance overhead

- Keep content editing simple for the VSP team --- no code required

- Improve site performance and Core Web Vitals for SEO

- Consolidate points and results subdomains into the same repo

- Build a foundation that scales to the other MVT brand sites

**What Stays External**

These third-party services are NOT being rebuilt --- they stay as
external links:

- Ticket sales → tix.com (existing integration)

- Live stream → racindirt.tv

- Lineups → MyRacePass (paywall, not worth rebuilding)

- Points → Currently on subdomain, will move into same repo as /points

- Results → Currently on subdomain, will move into same repo as /results

**2. Technology Stack**

  --------------------- -------------------------------------------------
  Next.js 14 (App       Frontend framework. Handles routing, SSR/SSG, API
  Router)               routes. Deployed on Vercel.

  Sanity.io             Headless CMS. All content editing happens here
                        --- events, news, sponsors, pages. Team gets a
                        clean Studio UI at /studio.

  Supabase              Database for dynamic data: photo gallery uploads,
                        form submissions, contact leads. Also handles
                        auth if needed.

  Vercel                Hosting and CI/CD. Auto-deploys on push to main.
                        Handles SSL and custom domain.

  Sanity CDN            Image hosting for event covers, news photos,
                        sponsor logos. Built into Sanity, no extra cost.

  Supabase Storage      Bulk photo gallery storage. Better for large
                        batches of race photos than Sanity.

  Resend                Transactional email. Used for contact form
                        confirmations, sponsor inquiries.

  next-sanity           Official Sanity client for Next.js. Handles
                        real-time previews and content fetching.
  --------------------- -------------------------------------------------

**3. Repo Structure**

The existing repo (currently used for points/results on Vercel) becomes
the main site repo. Points and results move into routes within the same
app.

**vadospeedway/**

├── app/

│ ├── (site)/ ← main public site

│ │ ├── page.tsx ← homepage

│ │ ├── events/ ← schedule & event detail

│ │ ├── news/ ← news, photos, videos

│ │ ├── about/ ← about, sponsors, rules, FAQ

│ │ └── studio/ ← embedded Sanity Studio

│ ├── points/ ← moved from subdomain

│ ├── results/ ← moved from subdomain

│ └── api/ ← API routes (forms, webhooks)

├── sanity/

│ ├── schemas/ ← content type definitions

│ └── lib/ ← Sanity client config

├── components/ ← shared UI components

├── lib/ ← Supabase client, utils

└── public/ ← static assets (logo, favicon)

**4. Sanity Content Types**

These are all the content types (schemas) to define in Sanity. Once set
up, the team edits everything through the Studio without touching code.

  ------------------------------------------------------------------------
  **Content Type** **Fields**                  **Who Edits**
  ---------------- --------------------------- ---------------------------
  Event            Title, date, times, race    VSP Team
                   classes, image, ticket      
                   link, admission info, event 
                   type                        

  News Post        Title, slug, category, body VSP Team
                   (rich text), featured       
                   image, publish date         

  Sponsor          Name, logo, tier            Hector / Admin
                   (title/gold/silver),        
                   website URL, active status  

  Page             Title, slug, body (rich     Hector / Admin
                   text), SEO title, SEO       
                   description                 

  Race Class       Class name, sponsor name,   Hector / Admin
                   division, active status     

  Navigation       Label, URL, parent, sort    Hector / Admin
                   order                       
  ------------------------------------------------------------------------

**Event Schema --- Key Fields Detail**

Events are the most important content type. Here\'s how race classes are
structured --- each class has a sponsor name and class name as separate
fields so they render as \'Mendoza Law Firm A-Mods\' automatically:

raceClasses: array of {

sponsor: string // \'Mendoza Law Firm\'

className: string // \'A-Mods\'

}

eventType: \'Weekly Racing\' \| \'Open Practice\'

\| \'Special Event\' \| \'External Event\'

// External events (like High Limit Racing) link away

// instead of rendering a detail page

isExternal: boolean

externalUrl: url

**5. Image Storage Strategy**

Images are split between two storage systems depending on type and
volume. Sanity CDN handles per-content images (event covers, news
photos). Supabase Storage handles bulk race photo galleries.

  ------------------------------------------------------------------------
  **Image Type**     **Where Stored**          **Notes**
  ------------------ ------------------------- ---------------------------
  Event cover image  Sanity CDN (built-in)     Uploaded in Studio with
                                               each event

  News / blog photos Sanity CDN (built-in)     Inline in rich text or
                                               featured image field

  Sponsor logos      Sanity CDN (built-in)     PNG/SVG uploaded once,
                                               reused

  Race photo         Supabase Storage          Bulk uploads, not tied to
  galleries                                    single event doc

  Site assets (logo, Vercel public/ folder     Static, versioned in Git
  hero)                                        

  Legacy WP images   Migrate to Sanity CDN     Use WP export + Sanity
                                               import script
  ------------------------------------------------------------------------

**Sanity Image Handling**

- Images uploaded directly in Sanity Studio --- drag and drop

- Sanity CDN auto-generates responsive sizes and serves via CDN

- In Next.js, use \@sanity/image-url to generate optimized URLs

- Event images: 300x300 square (matches current WP thumbnails)

- News featured images: 16:9 landscape

- Sponsor logos: original size, PNG or SVG

**Race Photo Galleries (Supabase Storage)**

- Race photos are high volume --- better in Supabase Storage than Sanity

- Upload via a simple admin page in Next.js (drag and drop batch upload)

- Photos stored in bucket: race-photos/{year}/{event-slug}/

- Gallery page queries Supabase for photos by event, renders grid

- No need to create a Sanity document per gallery

**WordPress Image Migration**

- Export all WP media using WP All Export or direct Kinsta file access

- Write a one-time script to upload to Sanity CDN via Sanity asset API

- Update content references after migration

- Timeline: handled in Phase 4 (Week 3-4)

**6. External Integrations**

  -----------------------------------------------------------------------------------
  **Service**                    **Status**         **Notes**
  ------------------------------ ------------------ ---------------------------------
  tix.com (tickets)              Keep as-is         Link from event pages, no rebuild
                                                    needed

  racindirt.tv (live stream)     Keep as-is         External link in nav

  MyRacePass (lineups)           Keep as-is         External link, paywall handled by
                                                    them

  points.vadospeedwaypark.com    Merge into same    Move to /points route in Next.js
                                 repo               app

  results.vadospeedwaypark.com   Merge into same    Move to /results route in Next.js
                                 repo               app

  Facebook Pixel                 Carry over         Add to Next.js via next/script
  -----------------------------------------------------------------------------------

**Subdomain Migration (Points & Results)**

Currently points.vadospeedwaypark.com and results.vadospeedwaypark.com
are separate Vercel deployments. Since we\'re using the same repo, they
move to routes:

- points.vadospeedwaypark.com → vadospeedwaypark.com/points

- results.vadospeedwaypark.com → vadospeedwaypark.com/results

- Set up 301 redirects from old subdomains to new paths

- Vercel handles both the apex domain and the redirects in vercel.json

**7. Migration Phases**

  ----------------------------------------------------------------------------
  **Phase**   **Name**         **Deliverable**   **Timeline**   **Status**
  ----------- ---------------- ----------------- -------------- --------------
  1           Foundation       Repo, Next.js,    Week 1         Planned
                               Sanity, Vercel                   
                               setup                            

  2           Content Schemas  All Sanity        Week 1-2       Planned
                               schemas + Studio                 

  3           Frontend Build   All pages,        Week 2-4       Planned
                               components,                      
                               styles                           

  4           Image Migration  WP images →       Week 3-4       Planned
                               Sanity CDN                       

  5           Content          Events, news,     Week 4-5       Planned
              Migration        pages migrated                   

  6           Domain Cutover   DNS pointed, WP   Week 6         Planned
                               decommissioned                   
  ----------------------------------------------------------------------------

**Phase 1 --- Foundation (Week 1)**

- Initialize Next.js 14 App Router in existing repo

- Install and configure Sanity (sanity init, schemas folder)

- Connect Supabase client

- Set up Vercel project, add custom domain vadospeedwaypark.com

- Configure DNS: apex A record to Vercel IP, www CNAME to
  cname.vercel-dns.com

- Add Sanity webhook → Vercel deploy hook (auto-rebuild on content
  publish)

- Confirm existing points/results app still runs at /points and /results

**Phase 2 --- Content Schemas (Week 1-2)**

- Build all Sanity schemas: event, post, sponsor, page, raceClass,
  navigation

- Set up Sanity Studio embedded at /studio

- Create team accounts in Sanity, set roles (admin vs editor)

- Test Studio --- have VSP team add one event and verify it appears

**Phase 3 --- Frontend Build (Week 2-4)**

- Homepage: hero video, upcoming events, latest news

- Events/Schedule page: list view filtered by upcoming/past

- Event detail page: all fields, race classes, ticket link CTA

- News listing + single post pages

- About, Sponsors, FAQ, Rules, Suites pages (static from Sanity)

- Nav component driven by Sanity navigation content type

- Mobile responsive, match current brand feel

**Phase 4 --- Image Migration (Week 3-4)**

- Download all media from Kinsta/WordPress

- Run upload script to push images to Sanity CDN

- Update all content references to new image URLs

- Verify no broken images across all pages

**Phase 5 --- Content Migration (Week 4-5)**

- Import all current events into Sanity

- Import all news posts with correct categories and dates

- Import sponsors with logos and tiers

- Migrate About, FAQ, Rules, Suites page content

- QA pass: check every page against live WordPress site

**Phase 6 --- Domain Cutover (Week 6)**

- Final QA on staging URL (Vercel preview)

- Point vadospeedwaypark.com DNS to Vercel

- Set up 301 redirects for old WordPress URLs to new paths

- Monitor for 404s in Vercel logs for first 48 hours

- Keep WordPress on Kinsta live for 2 weeks post-cutover as fallback

- Decommission Kinsta after confirmed stable

**8. Team Workflow After Launch**

This is what the VSP team\'s day-to-day looks like after the rebuild. No
code, no FTP, no WordPress dashboard.

**Adding a New Race Event**

1.  Go to vadospeedwaypark.com/studio and log in

2.  Click Events → New Event

3.  Fill out: event name, date, gate/race times, race classes, upload
    image

4.  Add ticket link if available

5.  Hit Publish → site auto-rebuilds and goes live in \~30 seconds

**Publishing a News Post or Race Recap**

- Same flow: News → New Post → fill fields → Publish

- Rich text editor supports inline images, links, headers

- Category dropdown: News, Photos, Videos, Race Results

**Updating Sponsors**

- Sponsors → find sponsor → update logo or URL → Publish

- Sponsor tier controls display order and badge on site

**9. DNS & Domain Configuration**

**vadospeedwaypark.com on Vercel**

  --------------------- -------------------------------------------------
  Record type           A record (apex domain)

  Name                  @

  Value                 76.76.21.21 (Vercel IP)

  WWW                   CNAME → cname.vercel-dns.com

  SSL                   Handled automatically by Vercel
  --------------------- -------------------------------------------------

**Cloudflare Note**

If domains are proxied through Cloudflare (orange cloud), turn off proxy
for Vercel-hosted domains (gray cloud / DNS only). Cloudflare proxy can
interfere with Vercel\'s SSL provisioning. You can use Cloudflare for
DNS management only without the proxy.

**Subdomain Redirects**

- points.vadospeedwaypark.com → 301 redirect to
  vadospeedwaypark.com/points

- results.vadospeedwaypark.com → 301 redirect to
  vadospeedwaypark.com/results

- Configure in vercel.json redirects array

**10. Open Questions / Decisions Needed**

  --------------------- -------------------------------------------------
  Photo galleries       Keep bulk race photos in Supabase Storage, or is
                        a third-party gallery (Flickr, SmugMug embed)
                        acceptable to simplify?

  Contact/Shout Out     Rebuild in Next.js with Supabase + Resend, or
  form                  replace with simple Typeform/Formspree embed?

  Suite booking         Suites page --- is it informational only, or does
                        it need a booking/inquiry form connected to
                        Supabase?

  SEO redirects         Do we have a list of WordPress URLs that need 301
                        redirects? Old event slugs are long and messy.

  Kinsta cutover timing Who gives the go-ahead to flip DNS? Needs to
                        happen on a non-race week.

  MyRacePass            Are you planning to eventually replace
                        Points/Results from MyRacePass with your own
                        system?
  --------------------- -------------------------------------------------

**MVT Marketing & Communications**

Hector --- Director of Marketing & Communications

Mesilla Valley Transportation \| March 2026
