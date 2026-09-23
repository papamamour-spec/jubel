export interface ArticleFrontmatter {
  date: string;
  title: string;
  chapeau: string;
  category: CategoryId;
  sources: string[];
  readingTime: number;
}

export interface Article {
  meta: ArticleFrontmatter;
  content: string;
  slug: string;
}

export const CATEGORIES = [
  { id: "politique", label: "Politique" },
  { id: "economie", label: "Économie" },
  { id: "societe", label: "Société" },
  { id: "justice", label: "Justice" },
  { id: "international", label: "International" },
  { id: "education", label: "Éducation" },
  { id: "sante", label: "Santé" },
  { id: "culture", label: "Culture" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id) as CategoryId[];

export function isCategoryId(value: string): value is CategoryId {
  return (CATEGORY_IDS as string[]).includes(value);
}

export function categoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}
