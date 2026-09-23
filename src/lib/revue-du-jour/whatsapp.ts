import { fromMarkdown } from "mdast-util-from-markdown";
import { toString } from "mdast-util-to-string";
import type { Root } from "mdast";
import { formatDateLong } from "@/lib/dates";
import { SITE_URL } from "@/lib/site";
import type { RevueEdition } from "./types";

const MAX_POINTS = 5;

// Message prêt à coller dans la chaîne WhatsApp (gras *…*, italique _…_).
export function whatsappMessage(edition: RevueEdition): string {
  const tree = fromMarkdown(edition.content) as Root;
  const points = tree.children
    .filter((n) => n.type === "heading" && n.depth === 3)
    .map((n) => toString(n).trim())
    .filter(Boolean)
    .slice(0, MAX_POINTS);

  const url = `${SITE_URL}/revue/${edition.slug}`;
  const date = formatDateLong(edition.meta.date);

  return [
    `*La Revue du Jour* · ${date.charAt(0).toUpperCase()}${date.slice(1)}`,
    "",
    `*${edition.meta.title}*`,
    ...(edition.meta.chapeau ? ["", `_${edition.meta.chapeau}_`] : []),
    ...(points.length ? ["", "L'essentiel :", ...points.map((p) => `• ${p}`)] : []),
    "",
    `Lire la revue : ${url}`,
    `Version PDF : ${url}/pdf`,
    "",
    "Institut Jubël, comprendre le Sénégal.",
  ].join("\n");
}
