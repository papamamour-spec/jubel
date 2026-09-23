import Link from "next/link";
import { getCarnets } from "@/lib/content";
import { getRevues } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Les Dossiers",
  description:
    "Essais de fond et analyses mensuelles de l'Institut Jubel.",
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export default function DossiersPage() {
  const carnets = getCarnets();
  const revues = getRevues();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-serif text-3xl md:text-4xl mb-4">Les Dossiers</h1>
      <p className="text-noir/50 mb-16 max-w-xl">
        Essais de fond et analyses mensuelles. Textes longs, denses, pour aller
        au-dela du commentaire.
      </p>

      {revues.length > 0 && (
        <section className="mb-20">
          <h2 className="font-serif text-xl text-or mb-8">Revue mensuelle</h2>
          <div className="space-y-8">
            {revues.map((revue) => (
              <article key={revue.meta.slug} className="group">
                <Link href={`/revue-mensuelle/${revue.meta.slug}`}>
                  <span className="text-xs text-noir/30">
                    {formatDate(revue.meta.date)}
                  </span>
                  <h3 className="font-serif text-lg md:text-xl mt-1 group-hover:text-or transition-colors leading-tight">
                    {revue.meta.title}
                  </h3>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="font-serif text-xl text-or mb-8">Les Carnets</h2>
        <div className="space-y-8">
          {carnets.map((carnet) => (
            <article key={carnet.meta.slug} className="group">
              <Link href={`/carnets/${carnet.meta.slug}`}>
                <span className="text-xs text-noir/30">
                  Carnet n{"°"}
                  {carnet.meta.numero}
                </span>
                <h3 className="font-serif text-lg md:text-xl mt-1 group-hover:text-or transition-colors leading-tight">
                  {carnet.meta.title}
                </h3>
                <p className="text-noir/50 text-sm mt-2">
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
