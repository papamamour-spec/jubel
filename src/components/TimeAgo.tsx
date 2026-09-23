"use client";

import { useEffect, useState } from "react";

function relative(iso: string, now: number): string | null {
  const t = new Date(iso).getTime();
  if (isNaN(t)) return null;
  const diff = Math.max(0, now - t);
  const min = Math.round(diff / 60000);
  if (min < 1) return "à l'instant";
  if (min < 60) return `il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `il y a ${h} h`;
  const d = Math.round(h / 24);
  if (d < 7) return d === 1 ? "hier" : `il y a ${d} jours`;
  return null;
}

export default function TimeAgo({
  iso,
  fallback,
  className,
}: {
  iso: string;
  fallback: string;
  className?: string;
}) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setLabel(relative(iso, Date.now()));
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [iso]);

  return (
    <time dateTime={iso} className={className} title={fallback}>
      {label ?? fallback}
    </time>
  );
}
