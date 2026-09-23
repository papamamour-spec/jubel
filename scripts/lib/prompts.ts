import { formatDateLong } from "../../src/lib/dates";

export function fillDateTokens(prompt: string, date: string): string {
  return prompt
    .replaceAll("{{DATE_ISO}}", date)
    .replaceAll("{{DATE_LONGUE}}", formatDateLong(date))
    .replaceAll("{{ANNEE}}", date.slice(0, 4));
}
