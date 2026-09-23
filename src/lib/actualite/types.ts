export interface ArticleFrontmatter {
  date: string;
  title: string;
  chapeau: string;
  category: string;
  sources: string[];
  readingTime: number;
  _internal?: {
    model: string;
    generatedAt: string;
    runId: string;
  };
}

export interface Article {
  meta: ArticleFrontmatter;
  content: string;
  slug: string;
}

export const CATEGORIES = [
  { id: "politique", label: "Politique", color: "text-red-700/70" },
  { id: "economie", label: "Economie", color: "text-emerald-700/70" },
  { id: "societe", label: "Societe", color: "text-blue-700/70" },
  { id: "justice", label: "Justice", color: "text-purple-700/70" },
  { id: "international", label: "International", color: "text-amber-700/70" },
  { id: "education", label: "Education", color: "text-cyan-700/70" },
  { id: "sante", label: "Sante", color: "text-pink-700/70" },
  { id: "culture", label: "Culture", color: "text-indigo-700/70" },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]["id"];
