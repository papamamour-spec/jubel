import { listArticles, getArticle } from "@/lib/actualite/reader";
import { categoryLabel, categoryStyle } from "@/lib/actualite/types";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { Metadata } from "next";
import { mdxOptions } from "@/lib/mdx";
import { formatDateLong } from "@/lib/dates";
import { SITE_URL } from "@/lib/site";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import Cartoon from "@/components/Cartoon";
import TimeAgo from "@/components/TimeAgo";

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
  const image = article.meta.illustration
    ? [{ url: article.meta.illustration.src, width: 1536, height: 1024, alt: article.meta.illustration.alt }]
    : undefined;
  return {
    title: article.meta.title,
    description: article.meta.chapeau,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: article.meta.title,
      description: article.meta.chapeau,
      publishedTime: article.meta.publishedAt,
      section: categoryLabel(article.meta.category),
      images: image,
    },
    twitter: {
      card: "summary_large_image",
      title: article.meta.title,
      description: article.meta.chapeau,
      images: image?.map((i) => i.url),
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
  const style = categoryStyle(article.meta.category);

  return (
    <article className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      <JsonLd
        data={{
          ...articleJsonLd({
            path,
            title: article.meta.title,
            description: article.meta.chapeau,
            datePublished: article.meta.publishedAt,
            section: label,
          }),
          ...(article.meta.illustration
            ? { image: [`${SITE_URL}${article.meta.illustration.src}`] }
            : {}),
        }}
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

      <header className={`mt-8 mb-8 border-l-2 pl-5 ${style.accent}`}>
        <div className="flex items-center gap-3 mb-3">
          <Link
            href={`/actualite/categorie/${article.meta.category}`}
            className={`text-xs uppercase tracking-widest font-medium ${style.text} hover:text-noir`}
          >
            {label}
          </Link>
          <TimeAgo
            iso={article.meta.publishedAt}
            fallback={formatDateLong(article.meta.date)}
            className="text-xs text-noir/65"
          />
        </div>
        <h1 className="font-serif text-3xl md:text-4xl leading-[1.15] font-medium">
          {article.meta.title}
        </h1>
        {article.meta.chapeau && (
          <p className="text-noir/75 text-lg mt-4 leading-relaxed">{article.meta.chapeau}</p>
        )}
      </header>

      {article.meta.illustration && (
        <Cartoon illustration={article.meta.illustration} priority />
      )}

      <div className="prose-jubel">
        <MDXRemote source={article.content} options={mdxOptions} />
      </div>

      <footer className="border-t border-noir/10 mt-16 pt-6 flex flex-wrap gap-6 text-xs text-noir/70">
        <span>{article.meta.readingTime} min de lecture</span>
        <span>
          {article.meta.sources.length} source
          {article.meta.sources.length > 1 ? "s" : ""}
        </span>
        <time dateTime={article.meta.publishedAt}>
          Publié le {formatDateLong(article.meta.date)}
        </time>
        <Link href="/revue/methodologie" className="hover:text-or-text">
          Méthodologie
        </Link>
        {article.meta.illustration && (
          <Link href="/charte-du-dessin" className="hover:text-or-text">
            Charte du dessin
          </Link>
        )}
      </footer>
    </article>
  );
}
