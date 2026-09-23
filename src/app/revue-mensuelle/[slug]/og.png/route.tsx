import { getRevue, getRevues } from "@/lib/content";
import { formatMonthYear } from "@/lib/dates";
import { ogImage } from "@/lib/og";

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

  return ogImage({
    kicker: "Revue mensuelle",
    dateLabel: revue.meta.numero ? `Numéro ${revue.meta.numero}` : "",
    title: capitalize(formatMonthYear(revue.meta.date)),
    subtitle: capitalize(revue.meta.description.replace(/^[^:]{3,25}\s:\s/, "")),
  });
}
