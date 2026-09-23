import { NextRequest, NextResponse } from "next/server";
import { dbEnabled, query } from "@/lib/db";
import { adminTokenValid } from "@/lib/empreinte";

export const dynamic = "force-dynamic";

const ACTIONS: Record<string, { table: "commentaires" | "contributions"; sql: string }> = {
  "commentaire:publier": { table: "commentaires", sql: `UPDATE commentaires SET statut = 'publie', signalements = 0 WHERE id = $1` },
  "commentaire:rejeter": { table: "commentaires", sql: `UPDATE commentaires SET statut = 'rejete' WHERE id = $1` },
  "commentaire:supprimer": { table: "commentaires", sql: `DELETE FROM commentaires WHERE id = $1` },
  "contribution:publier": { table: "contributions", sql: `UPDATE contributions SET statut = 'publiee', publie_le = now() WHERE id = $1` },
  "contribution:rejeter": { table: "contributions", sql: `UPDATE contributions SET statut = 'rejetee' WHERE id = $1` },
  "contribution:retirer": { table: "contributions", sql: `UPDATE contributions SET statut = 'recue', publie_le = NULL WHERE id = $1` },
  "contribution:supprimer": { table: "contributions", sql: `DELETE FROM contributions WHERE id = $1` },
};

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const token = String(form.get("token") ?? "");
  if (!adminTokenValid(token)) return new NextResponse("Non autorisé", { status: 401 });
  if (!dbEnabled()) return new NextResponse("Base indisponible", { status: 503 });

  const action = String(form.get("action") ?? "");
  const id = Number(form.get("id") ?? 0);
  const def = ACTIONS[action];
  if (!def || !Number.isInteger(id) || id <= 0) return new NextResponse("Action invalide", { status: 400 });

  try {
    await query(def.sql, [id]);
  } catch (err) {
    console.error(`[admin] ${err}`);
    return new NextResponse("Erreur", { status: 500 });
  }

  const back = new URL("/admin", req.nextUrl.origin);
  back.searchParams.set("token", token);
  return NextResponse.redirect(back, 303);
}
