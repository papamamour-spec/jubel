import Link from "next/link";
import { getLatestEdition } from "@/lib/revue-du-jour/reader";
import { getLatestArticles } from "@/lib/actualite/reader";
import { getCarnets } from "@/lib/content";
import { CATEGORIES, categoryLabel } from "@/lib/actualite/types";
import { formatDateShort } from "@/lib/dates";
import { TAGLINE } from "@/lib/site";

export default function Home() {
  const latestRevue = getLatestEdition();
  const latestArticles = getLatestArticles(6);
  const latestCarnet = getCarnets()[0];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
      <div className="text-center mb-16">
        <h1 className="text-[0.7rem] tracking-[0.3em] uppercase text-noir/70 mb-4">
          Institut Jubël
        </h1>
        <p className="font-serif text-lg md:text-xl text-noir/80 italic max-w-xl mx-auto">
          {TAGLINE}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        <div className="lg:col-span-2 space-y-14">
          {latestRevue && (
            <section aria-labelledby="home-revue">
              <div className="flex items-center justify-between mb-6">
                <h2
                  id="home-revue"
                  className="text-xs tracking-widest uppercase text-or-text"
                >
                  Revue du Jour
                </h2>
                <Link
                  href="/revue"
                  className="text-xs text-noir/70 hover:text-or-text"
                >
                  Toutes les éditions
                </Link>
              </div>
              <Link href={`/revue/${latestRevue.slug}`} className="group block">
                <time
                  dateTime={latestRevue.meta.date}
                  className="text-xs text-noir/65"
                >
                  {formatDateShort(latestRevue.meta.date)}
                </time>
                <h3 className="font-serif text-xl md:text-2xl mt-2 group-hover:text-or-text leading-tight">
                  {latestRevue.meta.title}
                </h3>
                {latestRevue.meta.chapeau && (
                  <p className="text-noir/70 text-sm mt-2 italic">
                    {latestRevue.meta.chapeau}
                  </p>
                )}
              </Link>
            </section>
          )}

          {latestArticles.length > 0 && (
            <section aria-labelledby="home-analyses">
              <div className="flex items-center justify-between mb-6">
                <h2
                  id="home-analyses"
                  className="text-xs tracking-widest uppercase text-or-text"
                >
                  Dernières analyses
                </h2>
                <Link
                  href="/actualite"
                  className="text-xs text-noir/70 hover:text-or-text"
                >
                  Toutes les analyses
                </Link>
              </div>
              <div className="space-y-8">
                {latestArticles.map((article) => (
                  <article key={article.slug} className="group">
                    <Link href={`/actualite/${article.slug}`}>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[0.7rem] uppercase tracking-widest text-or-text">
                          {categoryLabel(article.meta.category)}
                        </span>
                        <time
                          dateTime={article.meta.date}
                          className="text-[0.7rem] text-noir/65"
                        >
                          {formatDateShort(article.meta.date)}
                        </time>
                      </div>
                      <h3 className="font-serif text-lg group-hover:text-or-text leading-tight">
                        {article.meta.title}
                      </h3>
                      {article.meta.chapeau && (
                        <p className="text-noir/70 text-sm mt-1 line-clamp-2">
                          {article.meta.chapeau}
                        </p>
                      )}
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-12">
          <section aria-labelledby="home-rubriques">
            <h2
              id="home-rubriques"
              className="text-xs tracking-widest uppercase text-or-text mb-4"
            >
              Rubriques
            </h2>
            <ul className="space-y-2">
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/actualite/categorie/${cat.id}`}
                    className="block text-sm text-noir/70 hover:text-or-text py-1"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {latestCarnet && (
            <section aria-labelledby="home-carnet">
              <h2
                id="home-carnet"
                className="text-xs tracking-widest uppercase text-or-text mb-4"
              >
                Dernier Carnet
              </h2>
              <Link
                href={`/carnets/${latestCarnet.meta.slug}`}
                className="group block"
              >
                <span className="text-xs text-noir/65">
                  Carnet n°{latestCarnet.meta.numero}
                </span>
                <h3 className="font-serif text-base mt-1 group-hover:text-or-text leading-snug">
                  {latestCarnet.meta.title}
                </h3>
              </Link>
            </section>
          )}

          <section aria-labelledby="home-explorer">
            <h2
              id="home-explorer"
              className="text-xs tracking-widest uppercase text-or-text mb-4"
            >
              Explorer
            </h2>
            <ul className="space-y-2">
              {[
                { href: "/dossiers", label: "Les Dossiers" },
                { href: "/bibliotheque", label: "La Bibliothèque" },
                { href: "/rencontres", label: "Les Rencontres" },
                { href: "/revue/methodologie", label: "Méthodologie" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="block text-sm text-noir/70 hover:text-or-text py-1"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
