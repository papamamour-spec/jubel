"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "done"; statut: string }
  | { kind: "error"; message: string };

const inputClass =
  "w-full border border-noir/20 bg-transparent px-4 py-3 text-sm focus:border-noir";

export default function ContributionForm() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [length, setLength] = useState(0);
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (status.kind === "done" || status.kind === "error") messageRef.current?.focus();
  }, [status]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok?: boolean; statut?: string; error?: string };
      if (!res.ok || !json.ok) {
        setStatus({ kind: "error", message: json.error ?? "Envoi impossible." });
        return;
      }
      form.reset();
      setLength(0);
      setStatus({ kind: "done", statut: json.statut ?? "recue" });
    } catch {
      setStatus({ kind: "error", message: "Envoi impossible. Vérifiez votre connexion." });
    }
  }

  if (status.kind === "done") {
    return (
      <p ref={messageRef} tabIndex={-1} role="status" className="text-or-text font-serif text-lg">
        {status.statut === "rejetee"
          ? "Votre texte ne respecte pas la charte et ne pourra pas être publié en l'état. Vous pouvez le retravailler et le renvoyer."
          : "Merci. Votre contribution a bien été reçue. L'Institut la lira et vous répondra à l'adresse indiquée."}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-6 max-w-2xl">
      <p className="text-xs text-noir/70">
        Les champs marqués d&apos;un astérisque (<span className="text-or-text">*</span>) sont obligatoires.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="k-nom" className="block text-sm text-noir/80 mb-2">
            Nom ou pseudonyme <span className="text-or-text" aria-hidden="true">*</span>
          </label>
          <input id="k-nom" name="nom" required aria-required="true" minLength={2} maxLength={60} autoComplete="name" className={inputClass} />
        </div>
        <div>
          <label htmlFor="k-email" className="block text-sm text-noir/80 mb-2">
            Adresse électronique <span className="text-or-text" aria-hidden="true">*</span>
          </label>
          <input id="k-email" name="email" type="email" required aria-required="true" maxLength={120} autoComplete="email" className={inputClass} />
          <p className="text-xs text-noir/65 mt-1">Jamais affichée ; sert uniquement à vous répondre.</p>
        </div>
      </div>
      <div>
        <label htmlFor="k-titre" className="block text-sm text-noir/80 mb-2">
          Titre <span className="text-or-text" aria-hidden="true">*</span>
        </label>
        <input id="k-titre" name="titre" required aria-required="true" minLength={5} maxLength={140} className={inputClass} />
      </div>
      <div>
        <label htmlFor="k-texte" className="block text-sm text-noir/80 mb-2">
          Votre texte <span className="text-or-text" aria-hidden="true">*</span>
        </label>
        <textarea
          id="k-texte"
          name="texte"
          required
          aria-required="true"
          minLength={400}
          maxLength={15000}
          rows={16}
          onChange={(e) => setLength(e.currentTarget.value.length)}
          aria-describedby="k-compteur"
          className={`${inputClass} resize-y`}
        />
        <p id="k-compteur" className="text-xs text-noir/65 mt-1">
          {length.toLocaleString("fr-FR")} / 15 000 caractères (400 au minimum). Séparez les paragraphes par une ligne vide.
        </p>
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="k-site">Site</label>
        <input id="k-site" name="site" tabIndex={-1} autoComplete="off" />
      </div>
      <button
        type="submit"
        disabled={status.kind === "loading"}
        aria-busy={status.kind === "loading"}
        className="border border-noir/30 px-8 py-3 text-sm tracking-wide hover:border-or-text hover:text-or-text disabled:opacity-60"
      >
        {status.kind === "loading" ? "Envoi en cours" : "Envoyer à l'Institut"}
      </button>
      {status.kind === "error" && (
        <p ref={messageRef} tabIndex={-1} role="alert" className="text-sm text-noir/80">{status.message}</p>
      )}
    </form>
  );
}
