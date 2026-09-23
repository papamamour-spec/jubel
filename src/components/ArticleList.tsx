import Link from "next/link";
import { Article } from "@/lib/actualite/types";
import { CATEGORIES, categoryLabel } from "@/lib/actualite/types";
import { formatDateShort } from "@/lib/dates";

export function CategoryFilter({ active }: { active?: string }) {
  const base = "text-xs px-3 py-1.5 border";
  const on = "border-or-text text-or-text";
  const off = "border-noir/20 text-noir/70 hover:border-or-text hover:text-or-text";
  return (
    <nav aria-label="Filtrer par rubrique" className="mb-12">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/actualite"
            aria-current={!active ? "page" : undefined}
            className={`${base} ${!active ? on : off}`}
          >
            Tout
          </Link>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.id}>
            <Link
              href={`/actualite/categorie/${cat.id}`}
              aria-current={active === cat.id ? "page" : undefined}
              className={`${base} ${active === cat.id ? on : off}`}
            >
              {cat.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function ArticleList({ articles }: { articles: Article[] }) {
  if (articles.length === 0) {
    return (
      <p className="text-noir/70 italic">
        Aucun article dans cette rubrique pour le moment.
      </p>
    );
  }
  return (
    <div className="space-y-10">
      {articles.map((article) => (
        <article key={article.slug} className="group">
          <Link href={`/actualite/${article.slug}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs uppercase tracking-widest text-or-text">
                {categoryLabel(article.meta.category)}
              </span>
              <time dateTime={article.meta.date} className="text-xs text-noir/65">
                {formatDateShort(article.meta.date)}
              </time>
            </div>
            <h2 className="font-serif text-xl md:text-2xl group-hover:text-or-text leading-tight">
              {article.meta.title}
            </h2>
            {article.meta.chapeau && (
              <p className="text-noir/70 text-sm mt-2 leading-relaxed">
                {article.meta.chapeau}
              </p>
            )}
            <p className="flex items-center gap-4 mt-3 text-xs text-noir/65">
              <span>{article.meta.readingTime} min de lecture</span>
              <span>
                {article.meta.sources.length} source
                {article.meta.sources.length > 1 ? "s" : ""}
              </span>
            </p>
          </Link>
        </article>
      ))}
    </div>
  );
}
