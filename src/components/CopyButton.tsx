"use client";

import { useState } from "react";

export default function CopyButton({ text, label = "Copier" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* presse-papiers indisponible : le texte reste sélectionnable */
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="border border-noir/30 px-4 py-2 text-xs tracking-widest uppercase hover:border-or-text hover:text-or-text"
    >
      <span aria-live="polite">{copied ? "Copié" : label}</span>
    </button>
  );
}
