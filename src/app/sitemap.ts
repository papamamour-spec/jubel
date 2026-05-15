import { MetadataRoute } from "next";
import { getCarnets, getRevues } from "@/lib/content";
import { listEditions } from "@/lib/revue-du-jour/reader";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://jubel.sn";

  const carnets = getCarnets().map((c) => ({
    url: `${baseUrl}/carnets/${c.meta.slug}`,
    lastModified: new Date(c.meta.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const revuesMensuelles = getRevues().map((r) => ({
    url: `${baseUrl}/revue-mensuelle/${r.meta.slug}`,
    lastModified: new Date(r.meta.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const revuesDuJour = listEditions().map((e) => ({
    url: `${baseUrl}/revue/${e.slug}`,
    lastModified: new Date(e.meta.date),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/revue`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/revue-mensuelle`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/carnets`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/rencontres`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/bibliotheque`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...revuesDuJour,
    ...revuesMensuelles,
    ...carnets,
  ];
}
