"use client";

import { useEffect, useRef, useState, FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function Newsletter() {
  const [status, setStatus] = useState<Status>("idle");
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (status === "success" || status === "error") {
      messageRef.current?.focus();
    }
  }, [status]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setStatus("loading");
    try {
      const res = await fetch("https://formspree.io/f/xzdkyjdd", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      setStatus(res.ok ? "success" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p
        ref={messageRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className="text-sm text-or-text"
      >
        Merci. Vous serez informé des prochaines publications.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input type="hidden" name="_subject" value="Nouvel abonné Jubël" />
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label
            htmlFor="newsletter-email"
            className="block text-xs text-noir/70 mb-1"
          >
            Recevoir les nouveautés
          </label>
          <input
            type="email"
            id="newsletter-email"
            name="email"
            required
            aria-required="true"
            autoComplete="email"
            placeholder="votre@email.com"
            aria-describedby={status === "error" ? "newsletter-error" : undefined}
            className="w-full border border-noir/20 bg-transparent px-3 py-2 text-sm placeholder:text-noir/50 focus:border-noir"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          aria-busy={status === "loading"}
          className="border border-noir/30 px-4 py-2 text-sm hover:border-or-text hover:text-or-text whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Envoi en cours" : "S'abonner"}
        </button>
      </div>
      {status === "error" && (
        <p
          id="newsletter-error"
          ref={messageRef}
          tabIndex={-1}
          role="alert"
          className="text-xs text-noir/80"
        >
          L&apos;inscription n&apos;a pas abouti. Réessayez ou écrivez à
          contact@jubel.sn.
        </p>
      )}
    </form>
  );
}
