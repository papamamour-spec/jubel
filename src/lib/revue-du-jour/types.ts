export interface FeedSource {
  name: string;
  url: string;
  profile: string;
}

export interface RawArticle {
  id: string;
  source: string;
  title: string;
  url: string;
  summary: string;
  publishedAt: string;
}

export interface ClassifiedArticle extends RawArticle {
  category: string;
  salience: number;
}

export interface RevueFrontmatter {
  date: string;
  title: string;
  chapeau: string;
  categories: string[];
  sourcesCount: number;
  itemsCount: number;
  readingTime: number;
  _internal?: {
    model: string;
    generatedAt: string;
    runId: string;
  };
}

export interface RevueEdition {
  meta: RevueFrontmatter;
  content: string;
  slug: string;
}
