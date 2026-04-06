import Link from "next/link";
import { getCarnets } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Les Carnets",
  description: "Essais de fond de l'Institut Jubël. Textes denses sur les questions fondamentales du Sénégal contemporain.",
};

export default function CarnetsPage() {
  const carnets = getCarnets();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <h1 className="font-serif text-3xl md:text-4xl mb-4">Les Carnets</h1>
      <p className="text-noir/50 mb-16 max-w-xl">
        Essais de fond. Textes longs, denses, destinés à ceux qui veulent aller au-delà du commentaire.
      </p>

      <div className="space-y-12">
        {carnets.map((carnet) => (
          <article key={carnet.meta.slug} className="group">
            <Link href={`/carnets/${carnet.meta.slug}`}>
              <span className="text-xs text-or tracking-widest uppercase">
                Carnet n°{carnet.meta.numero}
              </span>
              <h2 className="font-serif text-xl md:text-2xl mt-2 group-hover:text-or transition-colors leading-tight">
                {carnet.meta.title}
              </h2>
              <p className="text-noir/50 text-sm mt-2">
                {carnet.meta.description}
              </p>
              <time className="text-xs text-noir/30 mt-3 block">
                {new Date(carnet.meta.date).toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
