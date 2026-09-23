import Link from "next/link";
import type { Metadata } from "next";
import { dbEnabled, query } from "@/lib/db";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { formatDateShort } from "@/lib/dates";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contributions",
  description: "Textes de lecteurs publiés par l'Institut Jubël.",
  alternates: { canonical: "/contributions" },
};

interface Row {
  id: number;
  nom: string;
  titre: string;
  texte: string;
  publie_le: string;
}

async function load(): Promise<Row[] | null> {
  if (!dbEnabled()) return null;
  try {
    return await query<Row>(
      `SELECT id, nom, titre, LEFT(texte, 300) AS texte, publie_le FROM contributions
       WHERE statut = 'publiee' ORDER BY publie_le DESC LIMIT 100`
    );
  } catch {
    return null;
  }
}

export default async function ContributionsPage() {
  const rows = await load();

  return (
    <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <JsonLd data={breadcrumbJsonLd([{ name: "Contributions", path: "/contributions" }])} />
      <div className="flex items-baseline justify-between mb-4">
        <h1 className="font-serif text-3xl md:text-4xl">Contributions</h1>
        <Link href="/contribuer" className="text-sm text-noir/70 hover:text-or-text">
          Proposer un texte
        </Link>
      </div>
      <p className="text-noir/70 mb-16 max-w-xl">
        Textes de lecteurs, relus par l&apos;Institut. Ils n&apos;engagent que leurs auteurs.
      </p>

      {rows === null ? (
        <p className="text-noir/70 italic">Cette rubrique est momentanément indisponible.</p>
      ) : rows.length === 0 ? (
        <p className="text-noir/70 italic">Aucune contribution publiée pour le moment.</p>
      ) : (
        <div className="space-y-12">
          {rows.map((r) => (
            <article key={r.id} className="group">
              <Link href={`/contributions/${r.id}`}>
                <div className="flex items-center gap-3 mb-2 text-xs text-noir/65">
                  <span>{r.nom}</span>
                  <time dateTime={r.publie_le}>{formatDateShort(r.publie_le)}</time>
                </div>
                <h2 className="font-serif text-xl md:text-2xl group-hover:text-or-text leading-tight">
                  {r.titre}
                </h2>
                <p className="text-noir/70 text-sm mt-2 line-clamp-3">{r.texte}</p>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
