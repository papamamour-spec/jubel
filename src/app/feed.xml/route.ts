import { listArticles } from "@/lib/actualite/reader";
import { listEditions } from "@/lib/revue-du-jour/reader";
import { categoryLabel } from "@/lib/actualite/types";
import { SITE_NAME, SITE_URL, TAGLINE } from "@/lib/site";

export const dynamic = "force-static";

function escape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface Item {
  title: string;
  link: string;
  description: string;
  date: string;
  category: string;
}

export function GET() {
  const items: Item[] = [
    ...listArticles(40).map((a) => ({
      title: a.meta.title,
      link: `${SITE_URL}/actualite/${a.slug}`,
      description: a.meta.chapeau,
      date: a.meta.date,
      category: categoryLabel(a.meta.category),
    })),
    ...listEditions()
      .slice(0, 20)
      .map((e) => ({
        title: e.meta.title,
        link: `${SITE_URL}/revue/${e.slug}`,
        description: e.meta.chapeau,
        date: e.meta.date,
        category: "Revue du Jour",
      })),
  ]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 50);

  const lastBuild = items[0]
    ? new Date(`${items[0].date}T06:30:00Z`).toUTCString()
    : new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escape(TAGLINE)}</description>
    <language>fr</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items
  .map(
    (item) => `    <item>
      <title>${escape(item.title)}</title>
      <link>${item.link}</link>
      <guid isPermaLink="true">${item.link}</guid>
      <pubDate>${new Date(`${item.date}T06:30:00Z`).toUTCString()}</pubDate>
      <category>${escape(item.category)}</category>
      <description>${escape(item.description)}</description>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
