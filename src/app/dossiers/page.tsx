import Link from "next/link";
import { getCarnets, getRevues } from "@/lib/content";
import type { Metadata } from "next";
import { formatMonthYear } from "@/lib/dates";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "Les Dossiers",
  description: "Essais de fond et analyses mensuelles de l'Institut Jubël.",
  alternates: { canonical: "/dossiers" },
};

export default function DossiersPage() {
  const carnets = getCarnets();
  const revues = getRevues();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <JsonLd data={breadcrumbJsonLd([{ name: "Dossiers", path: "/dossiers" }])} />
      <h1 className="font-serif text-3xl md:text-4xl mb-4">Les Dossiers</h1>
      <p className="text-noir/70 mb-16 max-w-xl">
        Essais de fond et analyses mensuelles. Textes longs, denses, pour aller
        au-delà du commentaire.
      </p>

      {revues.length > 0 && (
        <section className="mb-20" aria-labelledby="dossiers-revue">
          <div className="flex items-baseline justify-between mb-8">
            <h2 id="dossiers-revue" className="font-serif text-xl text-or-text">
              Revue mensuelle
            </h2>
            <Link
              href="/revue-mensuelle"
              className="text-xs text-noir/70 hover:text-or-text"
            >
              Tous les numéros
            </Link>
          </div>
          <div className="space-y-8">
            {revues.map((revue) => (
              <article key={revue.meta.slug} className="group">
                <Link href={`/revue-mensuelle/${revue.meta.slug}`}>
                  <time
                    dateTime={revue.meta.date}
                    className="text-xs text-noir/65"
                  >
                    {formatMonthYear(revue.meta.date)}
                  </time>
                  <h3 className="font-serif text-lg md:text-xl mt-1 group-hover:text-or-text leading-tight">
                    {revue.meta.title}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="dossiers-carnets">
        <div className="flex items-baseline justify-between mb-8">
          <h2 id="dossiers-carnets" className="font-serif text-xl text-or-text">
            Les Carnets
          </h2>
          <Link href="/carnets" className="text-xs text-noir/70 hover:text-or-text">
            Tous les carnets
          </Link>
        </div>
        <div className="space-y-8">
          {carnets.map((carnet) => (
            <article key={carnet.meta.slug} className="group">
              <Link href={`/carnets/${carnet.meta.slug}`}>
                <span className="text-xs text-noir/65">
                  Carnet n°{carnet.meta.numero}
                </span>
                <h3 className="font-serif text-lg md:text-xl mt-1 group-hover:text-or-text leading-tight">
                  {carnet.meta.title}
                </h3>
                <p className="text-noir/70 text-sm mt-2">
                  {carnet.meta.description}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
