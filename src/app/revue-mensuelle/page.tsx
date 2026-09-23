import Link from "next/link";
import { getRevues } from "@/lib/content";
import type { Metadata } from "next";
import { formatMonthYear } from "@/lib/dates";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

export const metadata: Metadata = {
  title: "La Revue mensuelle",
  description:
    "Revue mensuelle de l'Institut Jubël. Lecture intégrale gratuite, sans inscription.",
  alternates: { canonical: "/revue-mensuelle" },
};

export default function RevueMensuellePage() {
  const revues = getRevues();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Dossiers", path: "/dossiers" },
          { name: "Revue mensuelle", path: "/revue-mensuelle" },
        ])}
      />
      <h1 className="font-serif text-3xl md:text-4xl mb-4">La Revue mensuelle</h1>
      <p className="text-noir/70 mb-16 max-w-xl">
        Publication mensuelle. Quatre rubriques, un regard. Lecture intégrale
        gratuite, sans inscription.
      </p>

      <div className="space-y-16">
        {revues.map((revue) => (
          <article key={revue.meta.slug} className="group">
            <Link href={`/revue-mensuelle/${revue.meta.slug}`}>
              <span className="text-xs text-or-text tracking-widest uppercase">
                Numéro {revue.meta.numero}
              </span>
              <h2 className="font-serif text-xl md:text-2xl mt-2 group-hover:text-or-text">
                {revue.meta.title}
              </h2>
              <time
                dateTime={revue.meta.date}
                className="text-xs text-noir/65 mt-2 block"
              >
                {formatMonthYear(revue.meta.date)}
              </time>
              {revue.meta.rubriques && (
                <ul className="mt-4 flex flex-wrap gap-3">
                  {revue.meta.rubriques.map((r) => (
                    <li
                      key={r}
                      className="text-xs border border-noir/20 px-3 py-1 text-noir/70"
                    >
                      {r}
                    </li>
                  ))}
                </ul>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
