import Link from "next/link";
import { getLatestEdition, isFresh } from "@/lib/revue-du-jour/reader";
import { listArticles } from "@/lib/actualite/reader";
import { getCarnets } from "@/lib/content";
import { CATEGORIES } from "@/lib/actualite/types";
import { formatDateLong, formatDateShort } from "@/lib/dates";
import { TAGLINE } from "@/lib/site";
import Masthead from "@/components/Masthead";
import Cartoon from "@/components/Cartoon";
import TimeAgo from "@/components/TimeAgo";
import { ArticleCard } from "@/components/ArticleCard";

export default function Home() {
  const articles = listArticles();
  const revue = getLatestEdition();
  const revueFresh = revue ? isFresh(revue) : false;
  const latestCarnet = getCarnets()[0];

  const [hero, ...rest] = articles;
  const secondaries = rest.slice(0, 3);
  const editionDate = hero?.meta.date ?? revue?.meta.date ?? new Date().toISOString().slice(0, 10);
  const updatedAt = [hero?.meta.publishedAt, revue?.meta.publishedAt]
    .filter((v): v is string => Boolean(v))
    .sort()
    .reverse()[0] ?? `${editionDate}T06:30:00.000Z`;

  const blocks = CATEGORIES.map((cat) => ({
    ...cat,
    articles: articles.filter((a) => a.meta.category === cat.id).slice(0, 3),
  })).filter((b) => b.articles.length > 0);

  return (
    <>
      <Masthead
        date={editionDate}
        updatedAt={updatedAt}
        sourcesCount={revueFresh ? revue!.meta.sourcesCount : 0}
      />

      <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-[0.7rem] tracking-[0.3em] uppercase text-noir/70 mb-3">
            Institut Jubël
          </h1>
          <p className="font-serif text-lg md:text-xl text-noir/80 italic max-w-2xl mx-auto">
            {TAGLINE}
          </p>
        </div>

        {hero ? (
          <section aria-labelledby="une" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-noir/10">
            <h2 id="une" className="sr-only">À la une</h2>
            <div className="lg:col-span-8">
              <ArticleCard article={hero} size="large" />
            </div>
            <div className="lg:col-span-4 flex flex-col gap-8">
              {secondaries.map((a) => (
                <ArticleCard key={a.slug} article={a} size="small" />
              ))}
              {revue && (
                <Link
                  href={`/revue/${revue.slug}`}
                  className="group block border border-noir/15 p-5 bg-white/60 hover:border-or-text"
                >
                  <span className="text-[0.7rem] tracking-[0.25em] uppercase text-or-text">
                    {revueFresh ? `Ce matin en ${revue.meta.readingTime} min` : "Dernière Revue du Jour"}
                  </span>
                  {!revueFresh && (
                    <span className="block text-[0.7rem] text-noir/65 mt-1">
                      {formatDateLong(revue.meta.date)}
                    </span>
                  )}
                  <span className="block font-serif text-lg mt-2 leading-snug group-hover:text-or-text">
                    {revue.meta.title}
                  </span>
                  {revue.meta.chapeau && (
                    <span className="block text-sm text-noir/75 mt-2 italic">
                      {revue.meta.chapeau}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </section>
        ) : (
          <section className="text-center py-20 border-b border-noir/10">
            <p className="text-noir/70">Les premières analyses seront publiées prochainement.</p>
          </section>
        )}

        {revue && revueFresh && revue.meta.illustration && (
          <section aria-labelledby="dessin-du-jour" className="py-14 border-b border-noir/10">
            <h2 id="dessin-du-jour" className="text-xs tracking-[0.25em] uppercase text-or-text mb-6">
              Le dessin du jour
            </h2>
            <div className="max-w-3xl mx-auto">
              <Cartoon illustration={revue.meta.illustration} />
            </div>
          </section>
        )}

        {blocks.length > 0 && (
          <section aria-labelledby="rubriques" className="py-14">
            <h2 id="rubriques" className="sr-only">Par rubrique</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
              {blocks.map((block) => (
                <div key={block.id}>
                  <div className={`flex items-baseline justify-between border-t-2 pt-3 mb-6 ${block.accent}`}>
                    <h3 className={`text-xs tracking-[0.25em] uppercase font-medium ${block.text}`}>
                      {block.label}
                    </h3>
                    <Link
                      href={`/actualite/categorie/${block.id}`}
                      className="text-[0.7rem] text-noir/65 hover:text-or-text"
                    >
                      Tout {block.label}
                    </Link>
                  </div>
                  <div className="space-y-6">
                    {block.articles.map((a) => (
                      <Link key={a.slug} href={`/actualite/${a.slug}`} className="group block">
                        <TimeAgo
                          iso={a.meta.publishedAt}
                          fallback={formatDateShort(a.meta.date)}
                          className="text-[0.7rem] text-noir/65"
                        />
                        <span className="block font-serif text-base leading-snug mt-1 group-hover:text-or-text">
                          {a.meta.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section aria-labelledby="fond" className="border-t border-noir/10 pt-12 grid grid-cols-1 md:grid-cols-3 gap-10">
          <h2 id="fond" className="sr-only">Textes de fond</h2>
          {latestCarnet && (
            <div className="md:col-span-2">
              <span className="text-xs tracking-[0.25em] uppercase text-or-text">Dernier Carnet</span>
              <Link href={`/carnets/${latestCarnet.meta.slug}`} className="group block mt-3">
                <span className="block font-serif text-xl md:text-2xl leading-tight group-hover:text-or-text">
                  {latestCarnet.meta.title}
                </span>
                <span className="block text-sm text-noir/75 mt-2">
                  {latestCarnet.meta.description}
                </span>
              </Link>
            </div>
          )}
          <nav aria-label="Explorer" className="text-sm">
            <span className="text-xs tracking-[0.25em] uppercase text-or-text block mb-3">Explorer</span>
            <ul className="space-y-2">
              {[
                { href: "/actualite", label: "Toute l'actualité" },
                { href: "/revue", label: "Archives de la Revue du Jour" },
                { href: "/dossiers", label: "Les Dossiers" },
                { href: "/bibliotheque", label: "La Bibliothèque" },
                { href: "/rencontres", label: "Les Rencontres" },
                { href: "/charte-du-dessin", label: "Charte du dessin" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-noir/75 hover:text-or-text">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </section>
      </div>
    </>
  );
}
