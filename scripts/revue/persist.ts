import fs from "fs";
import path from "path";

const CONTENT_DIR = path.join(process.cwd(), "content", "revue-du-jour");

export function persistEdition(date: string, mdxContent: string): string {
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  const filePath = path.join(CONTENT_DIR, `${date}.mdx`);
  fs.writeFileSync(filePath, mdxContent, "utf-8");

  console.log(`[persist] Written: ${filePath}`);
  return filePath;
}
