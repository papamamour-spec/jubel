import { getRevues, getRevue } from "@/lib/content";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getRevues().map((r) => ({ slug: r.meta.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const revue = getRevue(params.slug);
  if (!revue) return {};
  return {
    title: revue.meta.title,
    description: revue.meta.description,
  };
}

export default function RevueDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const revue = getRevue(params.slug);
  if (!revue) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <Link
        href="/revue"
        className="text-xs text-noir/40 hover:text-or transition-colors tracking-widest uppercase"
      >
        &larr; La Revue
      </Link>

      <header className="mt-8 mb-12">
        <span className="text-xs text-or tracking-widest uppercase">
          Numéro {revue.meta.numero}
        </span>
        <h1 className="font-serif text-3xl md:text-4xl mt-3">
          {revue.meta.title}
        </h1>
        <time className="text-sm text-noir/40 mt-4 block">
          {new Date(revue.meta.date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
          })}
        </time>
        {revue.meta.rubriques && (
          <div className="mt-6 flex flex-wrap gap-3">
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
      </header>

      <div className="prose-jubel">
        <MDXRemote
          source={revue.content}
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
