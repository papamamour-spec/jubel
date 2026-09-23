import Link from "next/link";
import { Article, CATEGORIES } from "@/lib/actualite/types";
import { ArticleCard } from "./ArticleCard";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-12">
      {articles.map((article) => (
        <ArticleCard key={article.slug} article={article} size="medium" />
      ))}
    </div>
  );
}
