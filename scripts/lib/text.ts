export function slugify(text: string, max = 60): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/[\s-]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, max)
    .replace(/-$/, "");
}

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function stripCodeFences(text: string): string {
  let out = text.trim();
  const fence = /^```[a-z]*\s*\n([\s\S]*?)\n```\s*$/i;
  const match = out.match(fence);
  if (match) out = match[1].trim();
  return out;
}

// Defence in depth: rendering uses markdown-only mode, but generated files
// are committed to the repository, so anything that could be interpreted
// as code by another consumer is removed as well.
export function sanitizeMarkdown(text: string): string {
  return text
    .replace(/<\/?script[^>]*>/gi, "")
    .replace(/<\/?iframe[^>]*>/gi, "")
    .replace(/<[a-z][^>]*on[a-z]+\s*=[^>]*>/gi, "")
    .replace(/^\s*(import|export)\s.*$/gm, "")
    .replace(/[—–]/g, ",")
    .replace(/[—–]/g, ",");
}

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
