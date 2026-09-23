import { MetadataRoute } from "next";
import { getCarnets, getRevues } from "@/lib/content";
import { listEditions } from "@/lib/revue-du-jour/reader";
import { listArticles } from "@/lib/actualite/reader";
import { CATEGORIES } from "@/lib/actualite/types";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = listArticles();
  const editions = listEditions();
  const carnets = getCarnets();
  const revues = getRevues();

  const latest = (dates: string[]): Date =>
    dates.length ? new Date(dates.sort().reverse()[0]) : new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}`, lastModified: latest(articles.map((a) => a.meta.date)), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/actualite`, lastModified: latest(articles.map((a) => a.meta.date)), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/revue`, lastModified: latest(editions.map((e) => e.meta.date)), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/dossiers`, lastModified: latest([...carnets, ...revues].map((c) => c.meta.date)), changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/carnets`, lastModified: latest(carnets.map((c) => c.meta.date)), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/revue-mensuelle`, lastModified: latest(revues.map((r) => r.meta.date)), changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/bibliotheque`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/rencontres`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/revue/methodologie`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/charte-du-dessin`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.3 },
  ];

  const categories: MetadataRoute.Sitemap = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/actualite/categorie/${c.id}`,
    lastModified: latest(
      articles.filter((a) => a.meta.category === c.id).map((a) => a.meta.date)
    ),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...categories,
    ...articles.map((a) => ({
      url: `${SITE_URL}/actualite/${a.slug}`,
      lastModified: new Date(a.meta.date),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...editions.map((e) => ({
      url: `${SITE_URL}/revue/${e.slug}`,
      lastModified: new Date(e.meta.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    ...carnets.map((c) => ({
      url: `${SITE_URL}/carnets/${c.meta.slug}`,
      lastModified: new Date(c.meta.date),
      changeFrequency: "yearly" as const,
      priority: 0.8,
    })),
    ...revues.map((r) => ({
      url: `${SITE_URL}/revue-mensuelle/${r.meta.slug}`,
      lastModified: new Date(r.meta.date),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
}
