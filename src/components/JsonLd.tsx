import { SITE_NAME, SITE_URL } from "@/lib/site";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface ArticleInput {
  path: string;
  title: string;
  description: string;
  datePublished: string;
  section?: string;
  type?: "NewsArticle" | "Article";
}

export function articleJsonLd({
  path,
  title,
  description,
  datePublished,
  section,
  type = "NewsArticle",
}: ArticleInput) {
  const url = `${SITE_URL}${path}`;
  return {
    "@context": "https://schema.org",
    "@type": type,
    "@id": url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: title,
    description,
    datePublished,
    dateModified: datePublished,
    inLanguage: "fr",
    isAccessibleForFree: true,
    ...(section ? { articleSection: section } : {}),
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      ...items.map((item, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: item.name,
        item: `${SITE_URL}${item.path}`,
      })),
    ],
  };
}
