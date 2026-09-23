import { z } from "zod";
import { CATEGORY_IDS } from "../../src/lib/actualite/types";

export const topicSchema = z.object({
  topic: z.string().min(5).max(120),
  category: z.enum(CATEGORY_IDS as [string, ...string[]]),
  articleIds: z.array(z.string()).min(2),
  importance: z.number().int().min(1).max(5),
});

export type Topic = z.infer<typeof topicSchema>;

export interface ManifestEntry {
  slug: string;
  title: string;
  articleIds: string[];
  generatedAt: string;
}
