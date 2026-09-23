"use client";

import { useEffect, useState } from "react";

interface Totals {
  disponible: boolean;
  total?: number;
  aujourdhui?: number;
  chemin?: number;
}

const fmt = new Intl.NumberFormat("fr-FR");

export default function VisitCounter({
  chemin,
  variant = "page",
  className = "",
}: {
  chemin?: string;
  variant?: "page" | "today" | "total";
  className?: string;
}) {
  const [data, setData] = useState<Totals | null>(null);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res =
          variant === "page" && chemin
            ? await fetch("/api/visite", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chemin }),
              })
            : await fetch("/api/visite", { cache: "no-store" });
        if (!res.ok) return;
        const json = (await res.json()) as Totals;
        if (!cancelled) setData(json);
      } catch {
        /* le compteur est facultatif */
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [chemin, variant]);

  if (!data?.disponible) return null;

  if (variant === "today") {
    const n = data.aujourdhui ?? 0;
    return <span className={className}>{fmt.format(n)} lecteur{n > 1 ? "s" : ""} aujourd&apos;hui</span>;
  }
  if (variant === "total") {
    return <span className={className}>{fmt.format(data.total ?? 0)} lectures depuis l&apos;ouverture</span>;
  }
  const n = data.chemin ?? 0;
  return <span className={className}>{fmt.format(n)} lecture{n > 1 ? "s" : ""}</span>;
}
