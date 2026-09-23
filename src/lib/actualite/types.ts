export interface Illustration {
  src: string;
  alt: string;
  legende: string;
}

export interface ArticleFrontmatter {
  date: string;
  publishedAt: string;
  title: string;
  chapeau: string;
  category: CategoryId;
  sources: string[];
  readingTime: number;
  illustration?: Illustration;
}

export interface Article {
  meta: ArticleFrontmatter;
  content: string;
  slug: string;
}

// Full class names so Tailwind can see them when scanning src/lib.
export const CATEGORIES = [
  { id: "politique", label: "Politique", accent: "border-[#8B3A3A]", text: "text-[#8B3A3A]" },
  { id: "economie", label: "Économie", accent: "border-[#2E6B4F]", text: "text-[#2E6B4F]" },
  { id: "societe", label: "Société", accent: "border-[#2F5D8A]", text: "text-[#2F5D8A]" },
  { id: "justice", label: "Justice", accent: "border-[#5B4B8A]", text: "text-[#5B4B8A]" },
  { id: "international", label: "International", accent: "border-[#8A6A2F]", text: "text-[#8A6A2F]" },
  { id: "education", label: "Éducation", accent: "border-[#2F7A8A]", text: "text-[#2F7A8A]" },
  { id: "sante", label: "Santé", accent: "border-[#8A2F5D]", text: "text-[#8A2F5D]" },
  { id: "culture", label: "Culture", accent: "border-[#4A4A8A]", text: "text-[#4A4A8A]" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as CategoryId[];

export function isCategoryId(value: string): value is CategoryId {
  return (CATEGORY_IDS as string[]).includes(value);
}

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function categoryStyle(id: string): { accent: string; text: string } {
  const c = CATEGORIES.find((c) => c.id === id);
  return c ? { accent: c.accent, text: c.text } : { accent: "border-or", text: "text-or-text" };
}
