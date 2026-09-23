import { getRevues, getRevue } from "@/lib/content";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { Metadata } from "next";
import { mdxOptions } from "@/lib/mdx";
import { formatMonthYear } from "@/lib/dates";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

export const dynamicParams = false;

export function generateStaticParams() {
  return getRevues().map((r) => ({ slug: r.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const revue = getRevue(slug);
  if (!revue) return {};
  const path = `/revue-mensuelle/${slug}`;
  return {
    title: revue.meta.title,
    description: revue.meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: revue.meta.title,
      description: revue.meta.description,
      publishedTime: revue.meta.date,
      section: "Revue mensuelle",
    },
    twitter: {
      card: "summary_large_image",
      title: revue.meta.title,
      description: revue.meta.description,
    },
  };
}

export default async function RevueDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const revue = getRevue(slug);
  if (!revue) notFound();
  const path = `/revue-mensuelle/${slug}`;

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <JsonLd
        data={articleJsonLd({
          path,
          type: "Article",
          title: revue.meta.title,
          description: revue.meta.description,
          datePublished: revue.meta.date,
          section: "Revue mensuelle",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Dossiers", path: "/dossiers" },
          { name: "Revue mensuelle", path: "/revue-mensuelle" },
          { name: revue.meta.title, path },
        ])}
      />
      <Link
        href="/revue-mensuelle"
        className="text-xs text-noir/70 hover:text-or-text tracking-widest uppercase"
      >
        &larr; La Revue mensuelle
      </Link>

      <header className="mt-8 mb-12">
        <span className="text-xs text-or-text tracking-widest uppercase">
          Numéro {revue.meta.numero}
        </span>
        <h1 className="font-serif text-3xl md:text-4xl mt-3">
          {revue.meta.title}
        </h1>
        <time dateTime={revue.meta.date} className="text-sm text-noir/65 mt-4 block">
          {formatMonthYear(revue.meta.date)}
        </time>
        {revue.meta.rubriques && (
          <ul className="mt-6 flex flex-wrap gap-3">
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
      </header>

      <div className="prose-jubel">
        <MDXRemote source={revue.content} options={mdxOptions} />
      </div>

      <footer className="border-t border-noir/10 mt-16 pt-6 text-xs text-noir/70">
        {revue.meta.readingTime} min de lecture
      </footer>
    </article>
  );
}
