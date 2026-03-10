import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { eventSlugsQuery, newsPostSlugsQuery } from "@/sanity/lib/queries";

const BASE_URL = "https://vadospeedwaypark.com";

const staticRoutes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1.0, changeFrequency: "daily" },
  { path: "/events", priority: 0.9, changeFrequency: "daily" },
  { path: "/news", priority: 0.8, changeFrequency: "daily" },
  { path: "/points", priority: 0.8, changeFrequency: "weekly" },
  { path: "/results", priority: 0.8, changeFrequency: "weekly" },
  { path: "/plan-your-visit", priority: 0.7, changeFrequency: "monthly" },
  { path: "/drivers", priority: 0.7, changeFrequency: "monthly" },
  { path: "/sponsors", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [eventSlugs, newsSlugs] = await Promise.all([
    sanityFetch<string[]>({ query: eventSlugsQuery, tags: ["event"] }),
    sanityFetch<string[]>({ query: newsPostSlugsQuery, tags: ["newsPost"] }),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const eventEntries: MetadataRoute.Sitemap = eventSlugs.map((slug) => ({
    url: `${BASE_URL}/events/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const newsEntries: MetadataRoute.Sitemap = newsSlugs.map((slug) => ({
    url: `${BASE_URL}/news/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...eventEntries, ...newsEntries];
}
