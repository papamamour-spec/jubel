"use client";

import { useState, FormEvent } from "react";

export default function Newsletter() {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    await fetch("https://formspree.io/f/xzdkyjdd", {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <p className="text-sm text-or">
        Merci. Vous serez informé des prochaines publications.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <input type="hidden" name="_subject" value="Nouvel abonné Jubël" />
      <div className="flex-1">
        <label htmlFor="newsletter-email" className="block text-xs text-noir/40 mb-1">
          Recevoir les nouveautés
        </label>
        <input
          type="email"
          id="newsletter-email"
          name="email"
          required
          placeholder="votre@email.com"
          className="w-full border border-noir/10 bg-transparent px-3 py-2 text-sm focus:outline-none focus:border-or transition-colors"
        />
      </div>
      <button
        type="submit"
        className="border border-noir/20 px-4 py-2 text-sm hover:border-or hover:text-or transition-colors whitespace-nowrap"
      >
        S'abonner
      </button>
    </form>
  );
}
