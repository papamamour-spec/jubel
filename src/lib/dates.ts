export function toISODate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const str = String(value ?? "");
  const match = str.match(/(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[1]}-${match[2]}-${match[3]}` : str;
}

function parse(iso: string): Date | null {
  const d = new Date(`${iso}T12:00:00`);
  return isNaN(d.getTime()) ? null : d;
}

export function formatDateLong(value: unknown): string {
  const iso = toISODate(value);
  const d = parse(iso);
  if (!d) return iso;
  return d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDateShort(value: unknown): string {
  const iso = toISODate(value);
  const d = parse(iso);
  if (!d) return iso;
  return d.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatMonthYear(value: unknown): string {
  const iso = toISODate(value);
  const d = parse(iso);
  if (!d) return iso;
  return d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
}

export function readingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
