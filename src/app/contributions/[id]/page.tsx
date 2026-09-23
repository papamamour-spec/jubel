import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { dbEnabled, query } from "@/lib/db";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import Comments from "@/components/Comments";
import VisitCounter from "@/components/VisitCounter";
import { formatDateLong } from "@/lib/dates";

export const dynamic = "force-dynamic";

interface Row {
  id: number;
  nom: string;
  titre: string;
  texte: string;
  publie_le: string;
}

async function load(id: string): Promise<Row | null> {
  if (!/^\d{1,9}$/.test(id) || !dbEnabled()) return null;
  try {
    const rows = await query<Row>(
      `SELECT id, nom, titre, texte, publie_le FROM contributions WHERE id = $1 AND statut = 'publiee'`,
      [Number(id)]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const row = await load(id);
  if (!row) return { robots: { index: false } };
  return {
    title: row.titre,
    description: row.texte.slice(0, 160),
    alternates: { canonical: `/contributions/${row.id}` },
  };
}

export default async function ContributionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await load(id);
  if (!row) notFound();
  const path = `/contributions/${row.id}`;
  const paragraphs = row.texte.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <article className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <JsonLd
        data={{
          ...articleJsonLd({ path, type: "Article", title: row.titre, description: row.texte.slice(0, 160), datePublished: row.publie_le }),
          author: { "@type": "Person", name: row.nom },
        }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Contributions", path: "/contributions" }, { name: row.titre, path }])} />
      <Link href="/contributions" className="text-xs text-noir/70 hover:text-or-text tracking-widest uppercase">
        &larr; Contributions
      </Link>
      <header className="mt-8 mb-12">
        <p className="text-xs tracking-widest uppercase text-or-text mb-3">Contribution de lecteur</p>
        <h1 className="font-serif text-3xl md:text-4xl leading-[1.15]">{row.titre}</h1>
        <p className="text-sm text-noir/70 mt-4">
          Par {row.nom}, <time dateTime={row.publie_le}>{formatDateLong(row.publie_le)}</time>
        </p>
      </header>
      <div className="prose-jubel">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <footer className="border-t border-noir/10 mt-16 pt-6 flex flex-wrap gap-6 text-xs text-noir/70">
        <span>Ce texte n&apos;engage que son auteur.</span>
        <VisitCounter chemin={path} />
      </footer>
      <Comments slug={`contribution-${row.id}`} />
    </article>
  );
}
