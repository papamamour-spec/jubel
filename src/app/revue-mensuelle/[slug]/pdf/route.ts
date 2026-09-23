import { getRevue, getRevues } from "@/lib/content";
import { formatMonthYear } from "@/lib/dates";
import { pdfResponse } from "@/lib/pdf/response";

export const dynamic = "force-static";
export const dynamicParams = false;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function generateStaticParams() {
  return getRevues().map((r) => ({ slug: r.meta.slug }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const revue = getRevue(slug);
  if (!revue) return new Response("Introuvable", { status: 404 });

  return pdfResponse(
    {
      kicker: "La Revue mensuelle",
      label: `Numéro ${revue.meta.numero ?? ""}`,
      title: capitalize(formatMonthYear(revue.meta.date)),
      subtitle: capitalize(revue.meta.description.replace(/^[^:]{3,25}\s:\s/, "")),
      breakRubriques: true,
      dateLabel: formatMonthYear(revue.meta.date),
      body: revue.content,
      url: `/revue-mensuelle/${slug}`,
    },
    `revue-jubel-${slug}.pdf`
  );
}
