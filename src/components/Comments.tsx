"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";

interface Comment {
  id: number;
  pseudo: string;
  texte: string;
  cree_le: string;
}

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "done"; verdict: "publie" | "en_attente" | "rejete" }
  | { kind: "error"; message: string };

const inputClass =
  "w-full border border-noir/20 bg-transparent px-4 py-3 text-sm focus:border-noir";

function formatDate(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function Comments({ slug }: { slug: string }) {
  const [available, setAvailable] = useState<boolean | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [reported, setReported] = useState<Set<number>>(new Set());
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/commentaires?slug=${encodeURIComponent(slug)}`, { cache: "no-store" })
      .then(async (res) => {
        const json = (await res.json()) as { disponible: boolean; commentaires: Comment[] };
        if (!cancelled) {
          setAvailable(Boolean(json.disponible));
          setComments(json.commentaires ?? []);
        }
      })
      .catch(() => !cancelled && setAvailable(false));
    return () => {
      cancelled = true;
    };
  }, [slug]);

  useEffect(() => {
    if (status.kind === "done" || status.kind === "error") messageRef.current?.focus();
  }, [status]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/commentaires", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, slug }),
      });
      const json = (await res.json()) as { ok?: boolean; statut?: "publie" | "en_attente" | "rejete"; id?: number; error?: string };
      if (!res.ok || !json.ok || !json.statut) {
        setStatus({ kind: "error", message: json.error ?? "Envoi impossible." });
        return;
      }
      if (json.statut === "publie" && json.id) {
        setComments((c) => [
          ...c,
          { id: json.id!, pseudo: String(data.pseudo), texte: String(data.texte), cree_le: new Date().toISOString() },
        ]);
      }
      form.reset();
      setStatus({ kind: "done", verdict: json.statut });
    } catch {
      setStatus({ kind: "error", message: "Envoi impossible. Vérifiez votre connexion." });
    }
  }

  async function report(id: number) {
    setReported((s) => new Set(s).add(id));
    try {
      await fetch(`/api/commentaires/${id}/signaler`, { method: "POST" });
    } catch {
      /* silencieux */
    }
  }

  if (available === false) return null;

  return (
    <section aria-labelledby="commentaires" className="mt-20 border-t border-noir/10 pt-10">
      <div className="flex items-baseline justify-between mb-8">
        <h2 id="commentaires" className="font-serif text-xl">
          Commentaires{comments.length > 0 && <span className="text-noir/65 text-base"> ({comments.length})</span>}
        </h2>
        <Link href="/charte-des-commentaires" className="text-xs text-noir/70 hover:text-or-text">
          Charte des commentaires
        </Link>
      </div>

      {available === null ? (
        <p className="text-sm text-noir/65">Chargement…</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-noir/70 italic mb-10">Aucun commentaire pour l&apos;instant. Ouvrez la discussion.</p>
      ) : (
        <ul className="space-y-8 mb-12">
          {comments.map((c) => (
            <li key={c.id} className="border-l-2 border-noir/15 pl-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                <span className="text-sm font-medium">{c.pseudo}</span>
                <time dateTime={c.cree_le} className="text-xs text-noir/65">{formatDate(c.cree_le)}</time>
                <button
                  type="button"
                  onClick={() => report(c.id)}
                  disabled={reported.has(c.id)}
                  className="ml-auto text-[0.7rem] text-noir/60 hover:text-or-text disabled:hover:text-noir/60"
                >
                  {reported.has(c.id) ? "Signalé, merci" : "Signaler"}
                </button>
              </div>
              {c.texte.split(/\n{2,}/).map((p, i) => (
                <p key={i} className="text-sm text-noir/85 leading-relaxed mb-2">{p}</p>
              ))}
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={submit} className="space-y-5 max-w-lg">
        <p className="text-xs text-noir/70">
          Les commentaires sont relus avant ou juste après publication. Pas d&apos;injure, pas d&apos;attaque
          personnelle, pas de propos communautaire. Adresse électronique facultative, jamais affichée.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="c-pseudo" className="block text-sm text-noir/80 mb-2">
              Pseudonyme <span className="text-or-text" aria-hidden="true">*</span>
            </label>
            <input id="c-pseudo" name="pseudo" required aria-required="true" minLength={2} maxLength={40} autoComplete="nickname" className={inputClass} />
          </div>
          <div>
            <label htmlFor="c-email" className="block text-sm text-noir/80 mb-2">Adresse électronique</label>
            <input id="c-email" name="email" type="email" maxLength={120} autoComplete="email" className={inputClass} />
          </div>
        </div>
        <div>
          <label htmlFor="c-texte" className="block text-sm text-noir/80 mb-2">
            Votre commentaire <span className="text-or-text" aria-hidden="true">*</span>
          </label>
          <textarea id="c-texte" name="texte" required aria-required="true" minLength={10} maxLength={2000} rows={5} className={`${inputClass} resize-y`} />
        </div>
        <div className="hidden" aria-hidden="true">
          <label htmlFor="c-site">Site</label>
          <input id="c-site" name="site" tabIndex={-1} autoComplete="off" />
        </div>
        <button
          type="submit"
          disabled={status.kind === "loading"}
          aria-busy={status.kind === "loading"}
          className="border border-noir/30 px-8 py-3 text-sm tracking-wide hover:border-or-text hover:text-or-text disabled:opacity-60"
        >
          {status.kind === "loading" ? "Envoi en cours" : "Publier"}
        </button>
        {status.kind === "done" && (
          <p ref={messageRef} tabIndex={-1} role="status" className="text-sm text-or-text">
            {status.verdict === "publie" && "Merci, votre commentaire est publié."}
            {status.verdict === "en_attente" && "Merci. Votre commentaire sera publié après relecture."}
            {status.verdict === "rejete" && "Ce commentaire ne respecte pas la charte et n'a pas été publié."}
          </p>
        )}
        {status.kind === "error" && (
          <p ref={messageRef} tabIndex={-1} role="alert" className="text-sm text-noir/80">{status.message}</p>
        )}
      </form>
    </section>
  );
}
