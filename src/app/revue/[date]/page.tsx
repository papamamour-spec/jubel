import { listEditions, getEdition } from "@/lib/revue-du-jour/reader";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { Metadata } from "next";
import { mdxOptions } from "@/lib/mdx";
import { formatDateLong } from "@/lib/dates";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import Cartoon from "@/components/Cartoon";

export const dynamicParams = false;

export function generateStaticParams() {
  return listEditions().map((e) => ({ date: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  const edition = getEdition(date);
  if (!edition) return {};
  const path = `/revue/${date}`;
  return {
    title: `${edition.meta.title} | Revue du Jour`,
    description: edition.meta.chapeau,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: edition.meta.title,
      description: edition.meta.chapeau,
      publishedTime: edition.meta.date,
      section: "Revue du Jour",
    },
    twitter: {
      card: "summary_large_image",
      title: edition.meta.title,
      description: edition.meta.chapeau,
    },
  };
}

export default async function RevueDatePage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const edition = getEdition(date);
  if (!edition) notFound();
  const path = `/revue/${date}`;

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <JsonLd
        data={articleJsonLd({
          path,
          title: edition.meta.title,
          description: edition.meta.chapeau,
          datePublished: edition.meta.date,
          section: "Revue du Jour",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Revue du Jour", path: "/revue" },
          { name: formatDateLong(edition.meta.date), path },
        ])}
      />
      <Link
        href="/revue"
        className="text-xs text-noir/70 hover:text-or-text tracking-widest uppercase"
      >
        &larr; La Revue du Jour
      </Link>

      <header className="mt-8 mb-12">
        <p className="text-xs text-or-text tracking-widest uppercase mb-4">
          La Revue du Jour
        </p>
        <time dateTime={edition.meta.date} className="text-sm text-noir/65 block">
          {formatDateLong(edition.meta.date)}
        </time>
        <h1 className="font-serif text-2xl md:text-3xl mt-3 leading-tight">
          {edition.meta.title}
        </h1>
        {edition.meta.chapeau && (
          <p className="text-noir/70 italic mt-3">{edition.meta.chapeau}</p>
        )}
      </header>

      {edition.meta.illustration && (
        <Cartoon illustration={edition.meta.illustration} priority />
      )}

      <div className="prose-jubel">
        <MDXRemote source={edition.content} options={mdxOptions} />
      </div>

      <footer className="border-t border-noir/10 mt-16 pt-6 flex flex-wrap gap-6 text-xs text-noir/70">
        <span>{edition.meta.sourcesCount} sources consultées</span>
        <span>Temps de lecture : {edition.meta.readingTime} min</span>
        <Link href="/revue/methodologie" className="hover:text-or-text">
          Méthodologie
        </Link>
      </footer>
    </article>
  );
}
