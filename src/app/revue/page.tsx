import Link from "next/link";
import { getLatestEdition, listEditions } from "@/lib/revue-du-jour/reader";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "La Revue du Jour",
  description:
    "Synthèse quotidienne de la presse sénégalaise par l'Institut Jubël.",
};

function formatDateLong(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function RevueDuJourPage() {
  const latest = getLatestEdition();
  const editions = listEditions();

  if (!latest) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <h1 className="font-serif text-3xl md:text-4xl mb-4">
          La Revue du Jour
        </h1>
        <p className="text-noir/50">
          Synthèse quotidienne de la presse sénégalaise. La première édition
          sera disponible prochainement.
        </p>
      </div>
    );
  }

  const archive = editions.filter((e) => e.slug !== latest.slug).slice(0, 30);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <header className="mb-12">
        <p className="text-xs text-or tracking-widest uppercase mb-4">
          La Revue du Jour
        </p>
        <time className="text-sm text-noir/40 block">
          {formatDateLong(latest.meta.date)}
        </time>
        <h1 className="font-serif text-2xl md:text-3xl mt-3 leading-tight">
          {latest.meta.title}
        </h1>
        {latest.meta.chapeau && (
          <p className="text-noir/50 italic mt-3">{latest.meta.chapeau}</p>
        )}
      </header>

      <div className="prose-jubel">
        <MDXRemote
          source={latest.content}
          options={{
            mdxOptions: { remarkPlugins: [remarkGfm] },
          }}
        />
      </div>

      <footer className="border-t border-noir/10 mt-16 pt-6 flex flex-wrap gap-6 text-xs text-noir/40">
        <span>{latest.meta.sourcesCount} sources consultées</span>
        <span>Temps de lecture : {latest.meta.readingTime} min</span>
        <Link
          href="/revue/methodologie"
          className="hover:text-or transition-colors"
        >
          Méthodologie
        </Link>
      </footer>

      {archive.length > 0 && (
        <section className="mt-20">
          <h2 className="font-serif text-xl mb-8 text-or">Archives</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {archive.map((edition) => (
              <Link
                key={edition.slug}
                href={`/revue/${edition.slug}`}
                className="group border border-noir/5 p-5 hover:border-or/30 transition-colors"
              >
                <time className="text-xs text-noir/30 block">
                  {formatDateLong(edition.meta.date)}
                </time>
                <h3 className="font-serif text-sm mt-2 group-hover:text-or transition-colors leading-snug">
                  {edition.meta.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
