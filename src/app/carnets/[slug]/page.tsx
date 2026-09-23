import { getCarnets, getCarnet } from "@/lib/content";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import type { Metadata } from "next";
import { mdxOptions } from "@/lib/mdx";
import { formatDateShort } from "@/lib/dates";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { DEFAULT_OG_IMAGE } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCarnets().map((c) => ({ slug: c.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const carnet = getCarnet(slug);
  if (!carnet) return {};
  const path = `/carnets/${slug}`;
  return {
    title: carnet.meta.title,
    description: carnet.meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: carnet.meta.title,
      description: carnet.meta.description,
      publishedTime: carnet.meta.date,
      section: "Carnets",
      images: [DEFAULT_OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: carnet.meta.title,
      description: carnet.meta.description,
      images: [DEFAULT_OG_IMAGE.url],
    },
  };
}

export default async function CarnetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const carnet = getCarnet(slug);
  if (!carnet) notFound();
  const path = `/carnets/${slug}`;

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <JsonLd
        data={articleJsonLd({
          path,
          type: "Article",
          title: carnet.meta.title,
          description: carnet.meta.description,
          datePublished: carnet.meta.date,
          section: "Carnets",
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Dossiers", path: "/dossiers" },
          { name: "Carnets", path: "/carnets" },
          { name: carnet.meta.title, path },
        ])}
      />
      <Link
        href="/carnets"
        className="text-xs text-noir/70 hover:text-or-text tracking-widest uppercase"
      >
        &larr; Les Carnets
      </Link>

      <header className="mt-8 mb-12">
        <span className="text-xs text-or-text tracking-widest uppercase">
          Carnet n°{carnet.meta.numero}
        </span>
        <h1 className="font-serif text-3xl md:text-4xl mt-3 leading-tight">
          {carnet.meta.title}
        </h1>
        <time dateTime={carnet.meta.date} className="text-sm text-noir/65 mt-4 block">
          {formatDateShort(carnet.meta.date)}
        </time>
      </header>

      <div className="prose-jubel">
        <MDXRemote source={carnet.content} options={mdxOptions} />
      </div>

      <footer className="border-t border-noir/10 mt-16 pt-6 text-xs text-noir/70">
        {carnet.meta.readingTime} min de lecture
      </footer>
    </article>
  );
}
