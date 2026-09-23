import Link from "next/link";
import { listArticles } from "@/lib/actualite/reader";
import { CATEGORIES } from "@/lib/actualite/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actualite",
  description:
    "Analyses quotidiennes de l'actualite senegalaise par l'Institut Jubel.",
};

function formatDate(dateStr: string | Date): string {
  const str = String(dateStr);
  const match = str.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return str;
  const d = new Date(`${match[1]}-${match[2]}-${match[3]}T12:00:00`);
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getCategoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label || id;
}

export default function ActualitePage({
  searchParams,
}: {
  searchParams: { cat?: string };
}) {
  const allArticles = listArticles();
  const filtered = searchParams.cat
    ? allArticles.filter((a) => a.meta.category === searchParams.cat)
    : allArticles;

  return (
    <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-serif text-3xl md:text-4xl mb-4">Actualite</h1>
      <p className="text-noir/50 mb-8 max-w-xl">
        Analyses quotidiennes. Le fait, le contexte, les angles, et la question
        que personne ne pose.
      </p>

      <div className="flex flex-wrap gap-2 mb-12">
        <Link
          href="/actualite"
          className={`text-xs px-3 py-1.5 border transition-colors ${
            !searchParams.cat
              ? "border-or text-or"
              : "border-noir/10 text-noir/50 hover:border-or/50"
          }`}
        >
          Tout
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/actualite?cat=${cat.id}`}
            className={`text-xs px-3 py-1.5 border transition-colors ${
              searchParams.cat === cat.id
                ? "border-or text-or"
                : "border-noir/10 text-noir/50 hover:border-or/50"
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-noir/40 italic">
          Les premiers articles seront publies prochainement.
        </p>
      ) : (
        <div className="space-y-10">
          {filtered.map((article) => (
            <article key={article.slug} className="group">
              <Link href={`/actualite/${article.slug}`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs uppercase tracking-widest text-or">
                    {getCategoryLabel(article.meta.category)}
                  </span>
                  <time className="text-xs text-noir/30">
                    {formatDate(article.meta.date)}
                  </time>
                </div>
                <h2 className="font-serif text-xl md:text-2xl group-hover:text-or transition-colors leading-tight">
                  {article.meta.title}
                </h2>
                {article.meta.chapeau && (
                  <p className="text-noir/50 text-sm mt-2 leading-relaxed">
                    {article.meta.chapeau}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3 text-xs text-noir/30">
                  <span>{article.meta.readingTime} min de lecture</span>
                  <span>{article.meta.sources?.length || 0} sources</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
