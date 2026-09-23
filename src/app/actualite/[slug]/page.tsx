import { listArticles, getArticle } from "@/lib/actualite/reader";
import { CATEGORIES } from "@/lib/actualite/types";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return listArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = getArticle(params.slug);
  if (!article) return {};
  return {
    title: article.meta.title,
    description: article.meta.chapeau,
  };
}

function getCategoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label || id;
}

function formatDate(dateStr: string | Date): string {
  const str = String(dateStr);
  const match = str.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return str;
  const d = new Date(`${match[1]}-${match[2]}-${match[3]}T12:00:00`);
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticle(params.slug);
  if (!article) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <Link
        href="/actualite"
        className="text-xs text-noir/40 hover:text-or transition-colors tracking-widest uppercase"
      >
        &larr; Actualite
      </Link>

      <header className="mt-8 mb-12">
        <div className="flex items-center gap-3 mb-3">
          <Link
            href={`/actualite?cat=${article.meta.category}`}
            className="text-xs uppercase tracking-widest text-or hover:text-or/80 transition-colors"
          >
            {getCategoryLabel(article.meta.category)}
          </Link>
          <time className="text-xs text-noir/30">
            {formatDate(article.meta.date)}
          </time>
        </div>
        <h1 className="font-serif text-2xl md:text-3xl leading-tight">
          {article.meta.title}
        </h1>
        {article.meta.chapeau && (
          <p className="text-noir/50 italic mt-4">{article.meta.chapeau}</p>
        )}
      </header>

      <div className="prose-jubel">
        <MDXRemote
          source={article.content}
          options={{
            mdxOptions: { remarkPlugins: [remarkGfm] },
          }}
        />
      </div>

      <footer className="border-t border-noir/10 mt-16 pt-6 flex flex-wrap gap-6 text-xs text-noir/40">
        <span>{article.meta.readingTime} min de lecture</span>
        <span>{article.meta.sources?.length || 0} sources</span>
        <Link
          href="/revue/methodologie"
          className="hover:text-or transition-colors"
        >
          Methodologie
        </Link>
      </footer>
    </article>
  );
}
