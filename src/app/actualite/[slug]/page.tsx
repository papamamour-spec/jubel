import { listArticles, getArticle } from "@/lib/actualite/reader";
import { categoryLabel } from "@/lib/actualite/types";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { Metadata } from "next";
import { mdxOptions } from "@/lib/mdx";
import { formatDateLong } from "@/lib/dates";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

export const dynamicParams = false;

export function generateStaticParams() {
  return listArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  const path = `/actualite/${slug}`;
  return {
    title: article.meta.title,
    description: article.meta.chapeau,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: article.meta.title,
      description: article.meta.chapeau,
      publishedTime: article.meta.date,
      section: categoryLabel(article.meta.category),
    },
    twitter: {
      card: "summary_large_image",
      title: article.meta.title,
      description: article.meta.chapeau,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const path = `/actualite/${slug}`;
  const label = categoryLabel(article.meta.category);

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <JsonLd
        data={articleJsonLd({
          path,
          title: article.meta.title,
          description: article.meta.chapeau,
          datePublished: article.meta.date,
          section: label,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Actualité", path: "/actualite" },
          { name: label, path: `/actualite/categorie/${article.meta.category}` },
          { name: article.meta.title, path },
        ])}
      />

      <Link
        href="/actualite"
        className="text-xs text-noir/70 hover:text-or-text tracking-widest uppercase"
      >
        &larr; Actualité
      </Link>

      <header className="mt-8 mb-12">
        <div className="flex items-center gap-3 mb-3">
          <Link
            href={`/actualite/categorie/${article.meta.category}`}
            className="text-xs uppercase tracking-widest text-or-text hover:text-noir"
          >
            {label}
          </Link>
          <time dateTime={article.meta.date} className="text-xs text-noir/65">
            {formatDateLong(article.meta.date)}
          </time>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl leading-tight">
          {article.meta.title}
        </h1>
        {article.meta.chapeau && (
          <p className="text-noir/70 italic mt-4">{article.meta.chapeau}</p>
        )}
      </header>

      <div className="prose-jubel">
        <MDXRemote source={article.content} options={mdxOptions} />
      </div>

      <footer className="border-t border-noir/10 mt-16 pt-6 flex flex-wrap gap-6 text-xs text-noir/70">
        <span>{article.meta.readingTime} min de lecture</span>
        <span>
          {article.meta.sources.length} source
          {article.meta.sources.length > 1 ? "s" : ""}
        </span>
        <Link href="/revue/methodologie" className="hover:text-or-text">
          Méthodologie
        </Link>
      </footer>
    </article>
  );
}
