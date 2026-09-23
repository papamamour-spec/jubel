import { notFound } from "next/navigation";
import { listArticlesByCategory } from "@/lib/actualite/reader";
import { CATEGORIES, categoryLabel, isCategoryId } from "@/lib/actualite/types";
import { ArticleList, CategoryFilter } from "@/components/ArticleList";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ cat: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cat: string }>;
}): Promise<Metadata> {
  const { cat } = await params;
  if (!isCategoryId(cat)) return {};
  const label = categoryLabel(cat);
  return {
    title: `${label} | Actualité`,
    description: `Analyses de l'Institut Jubël dans la rubrique ${label}.`,
    alternates: { canonical: `/actualite/categorie/${cat}` },
  };
}

export default async function CategoriePage({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  const { cat } = await params;
  if (!isCategoryId(cat)) notFound();
  const articles = listArticlesByCategory(cat);
  const label = categoryLabel(cat);

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Actualité", path: "/actualite" },
          { name: label, path: `/actualite/categorie/${cat}` },
        ])}
      />
      <h1 className="font-serif text-3xl md:text-4xl mb-4">{label}</h1>
      <p className="text-noir/70 mb-8 max-w-xl">
        Analyses de l&apos;Institut Jubël dans la rubrique {label}.
      </p>
      <CategoryFilter active={cat} />
      <ArticleList articles={articles} />
    </div>
  );
}
