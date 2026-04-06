import Link from "next/link";
import { getRevues } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "La Revue",
  description: "Revue mensuelle de l'Institut Jubël. Lecture intégrale gratuite, sans inscription.",
};

export default function RevuePage() {
  const revues = getRevues();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-serif text-3xl md:text-4xl mb-4">La Revue</h1>
      <p className="text-noir/50 mb-16 max-w-xl">
        Publication mensuelle. Quatre rubriques, un regard. Lecture intégrale gratuite, sans inscription.
      </p>

      <div className="space-y-16">
        {revues.map((revue) => (
          <article key={revue.meta.slug} className="group">
            <Link href={`/revue/${revue.meta.slug}`}>
              <span className="text-xs text-or tracking-widest uppercase">
                Numéro {revue.meta.numero}
              </span>
              <h2 className="font-serif text-xl md:text-2xl mt-2 group-hover:text-or transition-colors">
                {revue.meta.title}
              </h2>
              <time className="text-xs text-noir/30 mt-2 block">
                {new Date(revue.meta.date).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                })}
              </time>
              {revue.meta.rubriques && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {revue.meta.rubriques.map((r: string) => (
                    <span
                      key={r}
                      className="text-xs border border-noir/10 px-3 py-1 text-noir/50"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
