import { createHash, timingSafeEqual } from "crypto";

const BOT_UA = /bot|crawl|spider|slurp|headless|preview|fetch|monitor|lighthouse|pingdom|facebookexternalhit|whatsapp|telegram|discord|curl|wget|python-requests|go-http-client/i;

export function isBot(userAgent: string | null): boolean {
  if (!userAgent) return true;
  return BOT_UA.test(userAgent);
}

export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "0.0.0.0";
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// A daily, salted, one-way hash: it lets us count a reader once per day
// without storing an address, and it cannot be reversed or linked
// across days.
export function empreinte(headers: Headers): string {
  const salt = process.env.EMPREINTE_SEL ?? process.env.ADMIN_TOKEN ?? "jubel";
  const raw = `${clientIp(headers)}|${headers.get("user-agent") ?? ""}|${todayISO()}|${salt}`;
  return createHash("sha256").update(raw).digest("hex").slice(0, 32);
}

export function adminTokenValid(candidate: string | null): boolean {
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || !candidate) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function normalizePath(input: string | null): string | null {
  if (!input) return null;
  try {
    const url = new URL(input, "https://jubel.sn");
    const chemin = url.pathname.replace(/\/+$/, "") || "/";
    if (chemin.length > 200 || !/^\/[a-z0-9\-/]*$/i.test(chemin)) return null;
    return chemin;
  } catch {
    return null;
  }
}
