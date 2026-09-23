import Link from "next/link";
import { getLatestEdition, listEditions, isFresh } from "@/lib/revue-du-jour/reader";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";
import { mdxOptions } from "@/lib/mdx";
import { formatDateLong } from "@/lib/dates";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import Cartoon from "@/components/Cartoon";
import Comments from "@/components/Comments";
import ShareButton from "@/components/ShareButton";
import VisitCounter from "@/components/VisitCounter";

export const metadata: Metadata = {
  title: "La Revue du Jour",
  description:
    "Synthèse quotidienne de la presse sénégalaise par l'Institut Jubël.",
  alternates: { canonical: "/revue" },
};

export default function RevueDuJourPage() {
  const latest = getLatestEdition();
  const editions = listEditions();

  if (!latest) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        <h1 className="font-serif text-3xl md:text-4xl mb-4">
          La Revue du Jour
        </h1>
        <p className="text-noir/70">
          Synthèse quotidienne de la presse sénégalaise. La première édition
          sera disponible prochainement.
        </p>
      </div>
    );
  }

  const fresh = isFresh(latest);
  const archive = editions.filter((e) => e.slug !== latest.slug).slice(0, 30);

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
      <JsonLd data={breadcrumbJsonLd([{ name: "Revue du Jour", path: "/revue" }])} />
      <div className="mb-8">
        <p className="text-xs text-or-text tracking-widest uppercase mb-4">
          {fresh ? "La Revue du Jour" : "Dernière Revue du Jour publiée"}
        </p>
        <time dateTime={latest.meta.date} className="text-sm text-noir/65 block">
          {formatDateLong(latest.meta.date)}
        </time>
        <h1 className="font-serif text-3xl md:text-4xl mt-3 leading-[1.15] font-medium">
          {latest.meta.title}
        </h1>
        {latest.meta.chapeau && (
          <p className="text-noir/75 text-lg italic mt-4">{latest.meta.chapeau}</p>
        )}
        <div className="mt-6">
          <ShareButton
            pdfUrl={`/revue/${latest.slug}/pdf`}
            pageUrl={`/revue/${latest.slug}`}
            title={`Revue du Jour : ${latest.meta.title}`}
            filename={`revue-du-jour-${latest.slug}.pdf`}
          />
        </div>
      </div>

      {latest.meta.illustration && (
        <Cartoon illustration={latest.meta.illustration} priority />
      )}

      <div className="prose-jubel">
        <MDXRemote source={latest.content} options={mdxOptions} />
      </div>

      <footer className="border-t border-noir/10 mt-16 pt-6 flex flex-wrap gap-6 text-xs text-noir/70">
        <span>{latest.meta.sourcesCount} sources consultées</span>
        <span>Temps de lecture : {latest.meta.readingTime} min</span>
        <VisitCounter chemin={`/revue/${latest.slug}`} />
        <Link href="/revue/methodologie" className="hover:text-or-text">
          Méthodologie
        </Link>
      </footer>

      <Comments slug={`revue-${latest.slug}`} />

      {archive.length > 0 && (
        <section className="mt-20" aria-labelledby="archives">
          <h2 id="archives" className="font-serif text-xl mb-8 text-or-text">
            Archives
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {archive.map((edition) => (
              <li key={edition.slug}>
                <Link
                  href={`/revue/${edition.slug}`}
                  className="group block border border-noir/10 p-5 hover:border-or-text h-full"
                >
                  <time
                    dateTime={edition.meta.date}
                    className="text-xs text-noir/65 block"
                  >
                    {formatDateLong(edition.meta.date)}
                  </time>
                  <span className="font-serif text-sm mt-2 block group-hover:text-or-text leading-snug">
                    {edition.meta.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
