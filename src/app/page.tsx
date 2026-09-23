import Link from "next/link";
import { getLatestEdition } from "@/lib/revue-du-jour/reader";
import { getLatestArticles } from "@/lib/actualite/reader";
import { getCarnets } from "@/lib/content";
import { CATEGORIES } from "@/lib/actualite/types";

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

export default function Home() {
  const latestRevue = getLatestEdition();
  const latestArticles = getLatestArticles(6);
  const latestCarnet = getCarnets()[0];

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
      <header className="text-center mb-16">
        <p
          className="text-[0.65rem] tracking-[0.3em] uppercase text-noir/35 mb-4"
          style={{ fontVariant: "small-caps" }}
        >
          Institut Jubel
        </p>
        <p className="font-serif text-lg md:text-xl text-noir/60 italic max-w-xl mx-auto">
          Nous ne cherchons pas a gouverner le Senegal. Nous cherchons a le
          comprendre.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-12">
          {/* Revue du Jour */}
          {latestRevue && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs tracking-widest uppercase text-or">
                  Revue du Jour
                </h2>
                <Link
                  href="/revue"
                  className="text-xs text-noir/30 hover:text-or transition-colors"
                >
                  Archives
                </Link>
              </div>
              <Link href={`/revue/${latestRevue.slug}`} className="group block">
                <time className="text-xs text-noir/30">
                  {formatDate(latestRevue.meta.date)}
                </time>
                <h3 className="font-serif text-xl md:text-2xl mt-2 group-hover:text-or transition-colors leading-tight">
                  {latestRevue.meta.title}
                </h3>
                {latestRevue.meta.chapeau && (
                  <p className="text-noir/50 text-sm mt-2 italic">
                    {latestRevue.meta.chapeau}
                  </p>
                )}
              </Link>
            </section>
          )}

          {/* Dernieres analyses */}
          {latestArticles.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xs tracking-widest uppercase text-or">
                  Dernieres analyses
                </h2>
                <Link
                  href="/actualite"
                  className="text-xs text-noir/30 hover:text-or transition-colors"
                >
                  Tout voir
                </Link>
              </div>
              <div className="space-y-8">
                {latestArticles.map((article) => (
                  <article key={article.slug} className="group">
                    <Link href={`/actualite/${article.slug}`}>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-[0.65rem] uppercase tracking-widest text-or/70">
                          {getCategoryLabel(article.meta.category)}
                        </span>
                        <time className="text-[0.65rem] text-noir/25">
                          {formatDate(article.meta.date)}
                        </time>
                      </div>
                      <h3 className="font-serif text-lg group-hover:text-or transition-colors leading-tight">
                        {article.meta.title}
                      </h3>
                      {article.meta.chapeau && (
                        <p className="text-noir/45 text-sm mt-1 line-clamp-2">
                          {article.meta.chapeau}
                        </p>
                      )}
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* Fallback si pas encore d'articles */}
          {latestArticles.length === 0 && !latestRevue && (
            <section className="text-center py-20">
              <p className="font-serif text-2xl md:text-3xl text-noir/90 leading-relaxed">
                Nous ne cherchons pas a gouverner le Senegal.
              </p>
              <p className="font-serif text-2xl md:text-3xl text-noir/90 mt-2">
                Nous cherchons a le comprendre.
              </p>
              <p className="font-serif text-xl text-noir/60 mt-4 italic">
                Et a mettre cette comprehension au service de ceux qui le
                servent.
              </p>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-12">
          {/* Categories */}
          <section>
            <h2 className="text-xs tracking-widest uppercase text-or mb-4">
              Rubriques
            </h2>
            <div className="space-y-2">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/actualite?cat=${cat.id}`}
                  className="block text-sm text-noir/50 hover:text-or transition-colors py-1"
                >
                  {cat.label}
                </Link>
              ))}
            </div>
          </section>

          {/* Dernier Carnet */}
          {latestCarnet && (
            <section>
              <h2 className="text-xs tracking-widest uppercase text-or mb-4">
                Dernier Carnet
              </h2>
              <Link
                href={`/carnets/${latestCarnet.meta.slug}`}
                className="group block"
              >
                <span className="text-xs text-noir/30">
                  Carnet n{"°"}
                  {latestCarnet.meta.numero}
                </span>
                <h3 className="font-serif text-base mt-1 group-hover:text-or transition-colors leading-snug">
                  {latestCarnet.meta.title}
                </h3>
              </Link>
            </section>
          )}

          {/* Navigation */}
          <section>
            <h2 className="text-xs tracking-widest uppercase text-or mb-4">
              Explorer
            </h2>
            <div className="space-y-2">
              <Link
                href="/dossiers"
                className="block text-sm text-noir/50 hover:text-or transition-colors py-1"
              >
                Les Dossiers
              </Link>
              <Link
                href="/bibliotheque"
                className="block text-sm text-noir/50 hover:text-or transition-colors py-1"
              >
                Bibliotheque
              </Link>
              <Link
                href="/rencontres"
                className="block text-sm text-noir/50 hover:text-or transition-colors py-1"
              >
                Rencontres
              </Link>
              <Link
                href="/revue/methodologie"
                className="block text-sm text-noir/50 hover:text-or transition-colors py-1"
              >
                Methodologie
              </Link>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
