import { getCarnets, getCarnet } from "@/lib/content";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getCarnets().map((c) => ({ slug: c.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const carnet = getCarnet(params.slug);
  if (!carnet) return {};
  return {
    title: carnet.meta.title,
    description: carnet.meta.description,
  };
}

export default function CarnetPage({
  params,
}: {
  params: { slug: string };
}) {
  const carnet = getCarnet(params.slug);
  if (!carnet) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <Link
        href="/carnets"
        className="text-xs text-noir/40 hover:text-or transition-colors tracking-widest uppercase"
      >
        &larr; Les Carnets
      </Link>

      <header className="mt-8 mb-12">
        <span className="text-xs text-or tracking-widest uppercase">
          Carnet n°{carnet.meta.numero}
        </span>
        <h1 className="font-serif text-3xl md:text-4xl mt-3 leading-tight">
          {carnet.meta.title}
        </h1>
        <time className="text-sm text-noir/40 mt-4 block">
          {new Date(carnet.meta.date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
      </header>

      <div className="prose-jubel">
        <MDXRemote
          source={carnet.content}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [rehypeSlug],
            },
          }}
        />
      </div>
    </article>
  );
}
