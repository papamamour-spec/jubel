import { getEdition, listEditions } from "@/lib/revue-du-jour/reader";
import { formatDateLong } from "@/lib/dates";
import { pdfResponse } from "@/lib/pdf/response";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return listEditions().map((e) => ({ date: e.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const edition = getEdition(date);
  if (!edition) return new Response("Introuvable", { status: 404 });

  return pdfResponse(
    {
      kicker: "La Revue du Jour",
      label: "Synthèse de la presse",
      title: edition.meta.title,
      subtitle: edition.meta.chapeau,
      dateLabel: formatDateLong(edition.meta.date),
      body: edition.content,
      url: `/revue/${date}`,
      legende: edition.meta.illustration?.legende,
    },
    `revue-du-jour-${date}.pdf`
  );
}
