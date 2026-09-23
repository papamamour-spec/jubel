"use client";

import { useEffect, useRef, useState } from "react";

type State = "idle" | "loading" | "menu" | "error";

export default function ShareButton({
  pdfUrl,
  pageUrl,
  title,
  filename,
}: {
  pdfUrl: string;
  pageUrl: string;
  title: string;
  filename: string;
}) {
  const [state, setState] = useState<State>("idle");
  const [copied, setCopied] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const absoluteUrl = typeof window !== "undefined" ? new URL(pageUrl, window.location.origin).href : pageUrl;
  const message = `${title} | Institut Jubël\n${absoluteUrl}`;

  useEffect(() => {
    if (state !== "menu") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setState("idle");
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setState("idle");
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [state]);

  function download(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }

  async function share() {
    setState("loading");
    try {
      const res = await fetch(pdfUrl);
      if (!res.ok) throw new Error(String(res.status));
      const blob = await res.blob();
      const file = new File([blob], filename, { type: "application/pdf" });

      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title, text: message });
          setState("idle");
          return;
        } catch (err) {
          if ((err as Error).name === "AbortError") {
            setState("idle");
            return;
          }
        }
      }
      download(blob);
      setState("menu");
    } catch {
      setState("error");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  const item = "block w-full text-left px-4 py-2 text-sm hover:bg-or/10 hover:text-or-text";

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        type="button"
        onClick={share}
        disabled={state === "loading"}
        aria-haspopup="menu"
        aria-expanded={state === "menu"}
        className="inline-flex items-center gap-2 border border-noir/30 px-4 py-2 text-xs tracking-widest uppercase hover:border-or-text hover:text-or-text disabled:opacity-60"
      >
        <svg aria-hidden="true" focusable="false" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0-12l-4 4m4-4l4 4M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
        </svg>
        {state === "loading" ? "Préparation du PDF" : "Partager"}
      </button>

      {state === "menu" && (
        <div role="menu" className="absolute z-20 mt-2 w-64 border border-noir/20 bg-cream shadow-sm py-2 right-0 md:left-0 md:right-auto">
          <p role="status" className="px-4 pb-2 text-xs text-noir/70 border-b border-noir/10 mb-1">
            PDF téléchargé. Vous pouvez aussi :
          </p>
          <a role="menuitem" className={item} href={`https://wa.me/?text=${encodeURIComponent(message)}`} target="_blank" rel="noopener noreferrer">
            Envoyer par WhatsApp<span className="sr-only"> (nouvelle fenêtre)</span>
          </a>
          <a role="menuitem" className={item} href={`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(message)}`}>
            Envoyer par e-mail
          </a>
          <button role="menuitem" type="button" className={item} onClick={copy}>
            {copied ? "Lien copié" : "Copier le lien"}
          </button>
          <a role="menuitem" className={item} href={pdfUrl} target="_blank" rel="noopener">
            Ouvrir le PDF<span className="sr-only"> (nouvelle fenêtre)</span>
          </a>
        </div>
      )}
      {state === "error" && (
        <p role="alert" className="text-xs text-noir/80 mt-2">
          Le PDF n&apos;a pas pu être préparé. <a href={pdfUrl} className="underline">Ouvrir directement</a>.
        </p>
      )}
    </div>
  );
}
