import { NextRequest, NextResponse } from "next/server";
import { dbEnabled, query } from "@/lib/db";
import { empreinte, isBot, normalizePath, todayISO } from "@/lib/empreinte";

export const dynamic = "force-dynamic";

interface Totals {
  total: number;
  aujourdhui: number;
  chemin?: number;
}

async function totals(chemin: string | null): Promise<Totals> {
  const [t] = await query<{ total: string; aujourdhui: string }>(
    `SELECT COALESCE(SUM(vues), 0)::text AS total,
            COALESCE(SUM(vues) FILTER (WHERE jour = $1), 0)::text AS aujourdhui
     FROM visites`,
    [todayISO()]
  );
  const result: Totals = { total: Number(t?.total ?? 0), aujourdhui: Number(t?.aujourdhui ?? 0) };
  if (chemin) {
    const [c] = await query<{ vues: string }>(
      `SELECT COALESCE(SUM(vues), 0)::text AS vues FROM visites WHERE chemin = $1`,
      [chemin]
    );
    result.chemin = Number(c?.vues ?? 0);
  }
  return result;
}

export async function GET(req: NextRequest) {
  if (!dbEnabled()) return NextResponse.json({ disponible: false }, { status: 503 });
  const chemin = normalizePath(req.nextUrl.searchParams.get("chemin"));
  try {
    return NextResponse.json({ disponible: true, ...(await totals(chemin)) }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error(`[visite] ${err}`);
    return NextResponse.json({ disponible: false }, { status: 503 });
  }
}

export async function POST(req: NextRequest) {
  if (!dbEnabled()) return NextResponse.json({ disponible: false }, { status: 503 });
  if (isBot(req.headers.get("user-agent"))) return new NextResponse(null, { status: 204 });

  let chemin: string | null = null;
  try {
    const body = (await req.json()) as { chemin?: string };
    chemin = normalizePath(body.chemin ?? null);
  } catch {
    chemin = null;
  }
  if (!chemin) return NextResponse.json({ error: "chemin invalide" }, { status: 400 });

  const jour = todayISO();
  const hash = empreinte(req.headers);

  try {
    const inserted = await query<{ ok: boolean }>(
      `INSERT INTO visites_uniques (jour, empreinte, chemin) VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING RETURNING true AS ok`,
      [jour, hash, chemin]
    );
    if (inserted.length > 0) {
      await query(
        `INSERT INTO visites (jour, chemin, vues) VALUES ($1, $2, 1)
         ON CONFLICT (jour, chemin) DO UPDATE SET vues = visites.vues + 1`,
        [jour, chemin]
      );
      if (Math.random() < 0.02) {
        await query(`DELETE FROM visites_uniques WHERE jour < CURRENT_DATE - 1`);
      }
    }
    return NextResponse.json({ disponible: true, ...(await totals(chemin)) }, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error(`[visite] ${err}`);
    return NextResponse.json({ disponible: false }, { status: 503 });
  }
}
