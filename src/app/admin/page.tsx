import type { Metadata } from "next";
import { dbEnabled, query } from "@/lib/db";
import { adminTokenValid } from "@/lib/empreinte";
import { formatDateLong } from "@/lib/dates";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Modération",
  robots: { index: false, follow: false },
};

interface CommentRow {
  id: number;
  slug: string;
  pseudo: string;
  email: string | null;
  texte: string;
  statut: string;
  motif: string | null;
  signalements: number;
  cree_le: string;
}

interface ContributionRow {
  id: number;
  nom: string;
  email: string | null;
  titre: string;
  texte: string;
  statut: string;
  motif: string | null;
  cree_le: string;
  publie_le: string | null;
}

function Action({ token, action, id, label }: { token: string; action: string; id: number; label: string }) {
  return (
    <form action="/api/admin" method="POST" className="inline">
      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="action" value={action} />
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="border border-noir/30 px-3 py-1 text-xs hover:border-or-text hover:text-or-text mr-2">
        {label}
      </button>
    </form>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  if (!adminTokenValid(token)) {
    return (
      <div className="max-w-md mx-auto px-6 py-24">
        <h1 className="font-serif text-2xl mb-6">Modération</h1>
        <form method="GET" className="space-y-4">
          <label htmlFor="token" className="block text-sm text-noir/80">Jeton d&apos;accès</label>
          <input id="token" name="token" type="password" className="w-full border border-noir/20 bg-transparent px-4 py-3 text-sm" />
          <button type="submit" className="border border-noir/30 px-6 py-2 text-sm">Entrer</button>
        </form>
      </div>
    );
  }
  if (!dbEnabled()) {
    return <div className="max-w-3xl mx-auto px-6 py-24"><p>Base de données non configurée (DATABASE_URL).</p></div>;
  }

  const [comments, contributions, stats] = await Promise.all([
    query<CommentRow>(
      `SELECT id, slug, pseudo, email, texte, statut, motif, signalements, cree_le FROM commentaires
       WHERE statut IN ('en_attente', 'signale') ORDER BY cree_le DESC LIMIT 100`
    ),
    query<ContributionRow>(
      `SELECT id, nom, email, titre, texte, statut, motif, cree_le, publie_le FROM contributions
       WHERE statut IN ('recue', 'publiee') ORDER BY (statut = 'recue') DESC, cree_le DESC LIMIT 100`
    ),
    query<{ total: string; aujourdhui: string; commentaires: string }>(
      `SELECT (SELECT COALESCE(SUM(vues),0) FROM visites)::text AS total,
              (SELECT COALESCE(SUM(vues),0) FROM visites WHERE jour = CURRENT_DATE)::text AS aujourdhui,
              (SELECT COUNT(*) FROM commentaires WHERE statut = 'publie')::text AS commentaires`
    ),
  ]);
  const s = stats[0];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="font-serif text-3xl mb-2">Modération</h1>
      <p className="text-sm text-noir/70 mb-12">
        {Number(s?.total ?? 0).toLocaleString("fr-FR")} lectures au total, {Number(s?.aujourdhui ?? 0).toLocaleString("fr-FR")} aujourd&apos;hui,{" "}
        {Number(s?.commentaires ?? 0).toLocaleString("fr-FR")} commentaires publiés.
      </p>

      <section className="mb-16">
        <h2 className="font-serif text-xl mb-6">Commentaires à relire ({comments.length})</h2>
        {comments.length === 0 ? (
          <p className="text-sm text-noir/70 italic">Rien en attente.</p>
        ) : (
          <ul className="space-y-8">
            {comments.map((c) => (
              <li key={c.id} className="border border-noir/15 p-5">
                <div className="text-xs text-noir/65 mb-2 flex flex-wrap gap-x-4">
                  <span className="font-medium text-noir">{c.pseudo}</span>
                  {c.email && <span>{c.email}</span>}
                  <span>{formatDateLong(c.cree_le)}</span>
                  <span>sur <code>{c.slug}</code></span>
                  <span className="text-or-text">{c.statut}{c.signalements ? `, ${c.signalements} signalement(s)` : ""}</span>
                </div>
                <p className="text-sm whitespace-pre-line mb-3">{c.texte}</p>
                {c.motif && <p className="text-xs text-noir/65 mb-3">Motif : {c.motif.replace(/signale:[a-f0-9]+/g, "").trim()}</p>}
                <Action token={token} action="commentaire:publier" id={c.id} label="Publier" />
                <Action token={token} action="commentaire:rejeter" id={c.id} label="Rejeter" />
                <Action token={token} action="commentaire:supprimer" id={c.id} label="Supprimer" />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="font-serif text-xl mb-6">Contributions ({contributions.length})</h2>
        {contributions.length === 0 ? (
          <p className="text-sm text-noir/70 italic">Aucune contribution.</p>
        ) : (
          <ul className="space-y-8">
            {contributions.map((k) => (
              <li key={k.id} className="border border-noir/15 p-5">
                <div className="text-xs text-noir/65 mb-2 flex flex-wrap gap-x-4">
                  <span className="font-medium text-noir">{k.nom}</span>
                  {k.email && <span>{k.email}</span>}
                  <span>{formatDateLong(k.cree_le)}</span>
                  <span className="text-or-text">{k.statut}</span>
                </div>
                <h3 className="font-serif text-lg mb-2">{k.titre}</h3>
                <details className="mb-3">
                  <summary className="text-xs cursor-pointer text-noir/70">Lire le texte ({k.texte.length.toLocaleString("fr-FR")} caractères)</summary>
                  <p className="text-sm whitespace-pre-line mt-3">{k.texte}</p>
                </details>
                {k.motif && <p className="text-xs text-noir/65 mb-3">Pré-lecture : {k.motif}</p>}
                {k.statut === "recue" ? (
                  <>
                    <Action token={token} action="contribution:publier" id={k.id} label="Publier" />
                    <Action token={token} action="contribution:rejeter" id={k.id} label="Rejeter" />
                  </>
                ) : (
                  <Action token={token} action="contribution:retirer" id={k.id} label="Retirer de la publication" />
                )}
                <Action token={token} action="contribution:supprimer" id={k.id} label="Supprimer" />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
