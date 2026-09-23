import { listArticles } from "@/lib/actualite/reader";
import { ArticleList, CategoryFilter } from "@/components/ArticleList";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actualité",
  description:
    "Analyses quotidiennes de l'actualité sénégalaise par l'Institut Jubël : le fait, le contexte, les angles, et la question que personne ne pose.",
  alternates: { canonical: "/actualite" },
};

export default function ActualitePage() {
  const articles = listArticles();

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <JsonLd data={breadcrumbJsonLd([{ name: "Actualité", path: "/actualite" }])} />
      <h1 className="font-serif text-3xl md:text-4xl mb-4">Actualité</h1>
      <p className="text-noir/70 mb-8 max-w-xl">
        Analyses quotidiennes. Le fait, le contexte, les angles, et la question
        que personne ne pose.
      </p>
      <CategoryFilter />
      <ArticleList articles={articles} />
    </div>
  );
}
