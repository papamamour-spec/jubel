import { listEditions, getEdition } from "@/lib/revue-du-jour/reader";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return listEditions().map((e) => ({ date: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { date: string };
}): Promise<Metadata> {
  const edition = getEdition(params.date);
  if (!edition) return {};
  return {
    title: `${edition.meta.title} | Revue du Jour`,
    description: edition.meta.chapeau,
  };
}

function formatDateLong(dateStr: string | Date | number): string {
  const str = String(dateStr);
  const match = str.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const d = new Date(`${match[1]}-${match[2]}-${match[3]}T12:00:00`);
    return d.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function RevueDatePage({
  params,
}: {
  params: { date: string };
}) {
  const edition = getEdition(params.date);
  if (!edition) notFound();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <Link
        href="/revue"
        className="text-xs text-noir/40 hover:text-or transition-colors tracking-widest uppercase"
      >
        &larr; La Revue du Jour
      </Link>

      <header className="mt-8 mb-12">
        <p className="text-xs text-or tracking-widest uppercase mb-4">
          La Revue du Jour
        </p>
        <time className="text-sm text-noir/40 block">
          {formatDateLong(edition.meta.date)}
        </time>
        <h1 className="font-serif text-2xl md:text-3xl mt-3 leading-tight">
          {edition.meta.title}
        </h1>
        {edition.meta.chapeau && (
          <p className="text-noir/50 italic mt-3">{edition.meta.chapeau}</p>
        )}
      </header>

      <div className="prose-jubel">
        <MDXRemote
          source={edition.content}
          options={{
            mdxOptions: { remarkPlugins: [remarkGfm] },
          }}
        />
      </div>

      <footer className="border-t border-noir/10 mt-16 pt-6 flex flex-wrap gap-6 text-xs text-noir/40">
        <span>{edition.meta.sourcesCount} sources consultées</span>
        <span>Temps de lecture : {edition.meta.readingTime} min</span>
        <Link
          href="/revue/methodologie"
          className="hover:text-or transition-colors"
        >
          Méthodologie
        </Link>
      </footer>
    </div>
  );
}
