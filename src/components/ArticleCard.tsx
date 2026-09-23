import Link from "next/link";
import { Article, categoryLabel, categoryStyle } from "@/lib/actualite/types";
import { formatDateShort } from "@/lib/dates";
import TimeAgo from "./TimeAgo";
import Cartoon from "./Cartoon";

export function ArticleCard({
  article,
  size = "medium",
}: {
  article: Article;
  size?: "large" | "medium" | "small";
}) {
  const style = categoryStyle(article.meta.category);
  const titleClass =
    size === "large"
      ? "font-serif text-2xl md:text-4xl leading-[1.15] font-medium"
      : size === "medium"
        ? "font-serif text-xl md:text-2xl leading-tight"
        : "font-serif text-base md:text-lg leading-snug";

  return (
    <article className={`group border-l-2 pl-4 ${style.accent}`}>
      <Link href={`/actualite/${article.slug}`} className="block">
        {article.meta.illustration && size !== "small" && (
          <div className="mb-4">
            <Cartoon illustration={article.meta.illustration} priority={size === "large"} compact />
          </div>
        )}
        <div className="flex items-center gap-3 mb-2">
          <span className={`text-[0.7rem] uppercase tracking-widest font-medium ${style.text}`}>
            {categoryLabel(article.meta.category)}
          </span>
          <TimeAgo
            iso={article.meta.publishedAt}
            fallback={formatDateShort(article.meta.date)}
            className="text-[0.7rem] text-noir/65"
          />
        </div>
        <h3 className={`${titleClass} group-hover:text-or-text`}>
          {article.meta.title}
        </h3>
        {article.meta.chapeau && size !== "small" && (
          <p className={`text-noir/75 mt-2 ${size === "large" ? "text-base md:text-lg" : "text-sm"} leading-relaxed`}>
            {article.meta.chapeau}
          </p>
        )}
        {article.meta.illustration && size === "large" && (
          <p className="mt-3 font-serif italic text-noir/80 text-sm">
            <span className="not-italic text-[0.65rem] tracking-[0.25em] uppercase text-or-text mr-2">
              Le dessin de Jubël
            </span>
            {article.meta.illustration.legende}
          </p>
        )}
      </Link>
    </article>
  );
}
