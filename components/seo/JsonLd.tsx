interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  // JSON-LD is generated server-side from trusted Sanity CMS data only.
  // JSON.stringify safely escapes the content for embedding in a script tag.
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// SportsEvent schema for event detail pages
export function SportsEventJsonLd({
  name,
  startDate,
  location,
  description,
  url,
  image,
  offers,
}: {
  name: string;
  startDate: string;
  location?: string;
  description?: string;
  url?: string;
  image?: string;
  offers?: { url: string; price?: string };
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name,
    startDate,
    location: {
      '@type': 'Place',
      name: location || 'Vado Speedway Park',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '22200 Stern Dr',
        addressLocality: 'Vado',
        addressRegion: 'NM',
        postalCode: '88072',
        addressCountry: 'US',
      },
    },
    sport: 'Dirt Track Racing',
  };

  if (description) data.description = description;
  if (url) data.url = url;
  if (image) data.image = image;
  if (offers) {
    data.offers = {
      '@type': 'Offer',
      url: offers.url,
      ...(offers.price && { price: offers.price, priceCurrency: 'USD' }),
    };
  }

  return <JsonLd data={data} />;
}

// LocalBusiness + Organization for homepage
export function LocalBusinessJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': ['LocalBusiness', 'SportsActivityLocation'],
        name: 'Vado Speedway Park',
        description: "Southern New Mexico's premier dirt track racing venue",
        url: 'https://vadospeedwaypark.com',
        telephone: '+15755551234',
        address: {
          '@type': 'PostalAddress',
          streetAddress: '22200 Stern Dr',
          addressLocality: 'Vado',
          addressRegion: 'NM',
          postalCode: '88072',
          addressCountry: 'US',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 32.1127,
          longitude: -106.6631,
        },
        sameAs: [
          'https://facebook.com/vadospeedwaypark',
          'https://instagram.com/vadospeedwaypark',
          'https://youtube.com/@vadospeedwaypark',
        ],
      }}
    />
  );
}

// BreadcrumbList for subpages
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url?: string }[];
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          ...(item.url && { item: item.url }),
        })),
      }}
    />
  );
}

// Article for news posts
export function ArticleJsonLd({
  headline,
  datePublished,
  description,
  url,
  image,
}: {
  headline: string;
  datePublished: string;
  description?: string;
  url?: string;
  image?: string;
}) {
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    datePublished,
    publisher: {
      '@type': 'Organization',
      name: 'Vado Speedway Park',
      url: 'https://vadospeedwaypark.com',
    },
  };

  if (description) data.description = description;
  if (url) data.url = url;
  if (image) data.image = image;

  return <JsonLd data={data} />;
}
