import { NextRequest, NextResponse } from "next/server";
import { dbEnabled, query } from "@/lib/db";
import { empreinte } from "@/lib/empreinte";

export const dynamic = "force-dynamic";

const HIDE_AFTER = 3;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!dbEnabled()) return NextResponse.json({ ok: false }, { status: 503 });
  const { id } = await params;
  if (!/^\d{1,9}$/.test(id)) return NextResponse.json({ ok: false }, { status: 400 });

  const hash = empreinte(req.headers);
  try {
    // One report per reader and per day is enough; the fingerprint is
    // stored in the reason column to avoid a dedicated table.
    const rows = await query<{ signalements: number; motif: string | null }>(
      `SELECT signalements, motif FROM commentaires WHERE id = $1`,
      [Number(id)]
    );
    if (rows.length === 0) return NextResponse.json({ ok: false }, { status: 404 });
    const marker = `signale:${hash}`;
    if ((rows[0].motif ?? "").includes(marker)) return NextResponse.json({ ok: true });

    await query(
      `UPDATE commentaires
       SET signalements = signalements + 1,
           motif = COALESCE(motif, '') || ' ' || $2,
           statut = CASE WHEN signalements + 1 >= $3 AND statut = 'publie' THEN 'signale' ELSE statut END
       WHERE id = $1`,
      [Number(id), marker, HIDE_AFTER]
    );
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(`[signaler] ${err}`);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
