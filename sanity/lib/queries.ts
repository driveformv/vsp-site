import { groq } from "next-sanity";

// === Events ===

export const upcomingEventsQuery = groq`
  *[_type == "event" && date >= now()] | order(date asc) {
    _id,
    title,
    slug,
    date,
    gateTime,
    raceTime,
    raceClasses,
    image,
    ticketLink,
    streamLink,
    admissionInfo,
    eventType,
    isExternal,
    externalUrl,
    weatherStatus,
    isFeatured,
    status,
    recapNote
  }
`;

export const pastEventsQuery = groq`
  *[_type == "event" && date < now()] | order(date desc) {
    _id,
    title,
    slug,
    date,
    gateTime,
    raceTime,
    raceClasses,
    image,
    ticketLink,
    streamLink,
    admissionInfo,
    eventType,
    isExternal,
    externalUrl,
    weatherStatus,
    isFeatured,
    status,
    recapNote
  }
`;

export const eventBySlugQuery = groq`
  *[_type == "event" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    date,
    gateTime,
    raceTime,
    raceClasses,
    image,
    ticketLink,
    streamLink,
    admissionInfo,
    eventType,
    isExternal,
    externalUrl,
    weatherStatus,
    isFeatured,
    status,
    recapNote,
    description
  }
`;

export const featuredUpcomingEventQuery = groq`
  *[_type == "event" && isFeatured == true && date >= now()] | order(date asc)[0] {
    _id,
    title,
    slug,
    date,
    gateTime,
    raceTime,
    raceClasses,
    image,
    ticketLink,
    streamLink,
    admissionInfo,
    eventType,
    isFeatured,
    status,
    recapNote,
    weatherStatus
  }
`;

export const eventSlugsQuery = groq`
  *[_type == "event" && defined(slug.current)] | order(date desc) .slug.current
`;

// === News ===

export const newsPostsQuery = groq`
  *[_type == "newsPost"] | order(publishDate desc) {
    _id,
    title,
    slug,
    category,
    featuredImage,
    publishDate,
    excerpt,
    relatedEvent->{title, slug, date}
  }
`;

// News for homepage — excludes Rules, Results, Videos, Photos, Sponsors (by category and title)
export const latestNewsQuery = groq`
  *[_type == "newsPost" && !(lower(category) in ["rules", "results", "videos", "photos", "sponsors"]) && !(title match "Rules*") && !(title match "Results*") && !(title match "Winners*")] | order(publishDate desc) [0...5] {
    _id,
    title,
    slug,
    category,
    featuredImage,
    publishDate,
    excerpt
  }
`;

export const newsPostsByCategoryQuery = groq`
  *[_type == "newsPost" && category == $category] | order(publishDate desc) {
    _id,
    title,
    slug,
    category,
    featuredImage,
    publishDate,
    excerpt
  }
`;

export const newsPostBySlugQuery = groq`
  *[_type == "newsPost" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    category,
    body,
    featuredImage,
    publishDate,
    excerpt,
    relatedEvent->{title, slug, date}
  }
`;

export const newsPostSlugsQuery = groq`
  *[_type == "newsPost" && defined(slug.current)].slug.current
`;

// === Sponsors ===

export const sponsorsQuery = groq`
  *[_type == "sponsor" && active == true] | order(tier asc, name asc) {
    _id,
    name,
    logo,
    tier,
    websiteUrl,
    description
  }
`;

export const sponsorsByTierQuery = groq`
  *[_type == "sponsor" && active == true && tier == $tier] | order(name asc) {
    _id,
    name,
    logo,
    tier,
    websiteUrl,
    description
  }
`;

// === Site Settings (singleton) ===

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    tagline,
    ticketUrl,
    streamUrl,
    phone,
    email,
    address,
    socialLinks
  }
`;

// === First Timer Guide (singleton) ===

export const firstTimerGuideQuery = groq`
  *[_type == "firstTimerGuide"][0] {
    sections[] {
      title,
      body,
      image
    },
    faqItems[] {
      question,
      answer
    }
  }
`;

// === Navigation ===

export const navigationQuery = groq`
  *[_type == "navigation"] | order(sortOrder asc) {
    _id,
    label,
    url,
    parent->{_id, label, url},
    sortOrder,
    isExternal
  }
`;

// === Race Classes ===

export const raceClassesQuery = groq`
  *[_type == "raceClass" && active == true] | order(className asc) {
    _id,
    className,
    sponsorName,
    division,
    rulesPdf {
      asset->{url}
    }
  }
`;

// === Generic Page ===

export const pageBySlugQuery = groq`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    body,
    seoTitle,
    seoDescription
  }
`;
