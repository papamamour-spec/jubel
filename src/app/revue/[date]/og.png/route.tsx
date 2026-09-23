import { getEdition, listEditions } from "@/lib/revue-du-jour/reader";
import { formatDateLong } from "@/lib/dates";
import { ogImage } from "@/lib/og";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return listEditions().map((e) => ({ date: e.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const edition = getEdition(date);
  if (!edition) return new Response("Introuvable", { status: 404 });

  return ogImage({
    kicker: "La Revue du Jour",
    dateLabel: formatDateLong(edition.meta.date),
    title: edition.meta.title,
    subtitle: edition.meta.chapeau,
  });
}
