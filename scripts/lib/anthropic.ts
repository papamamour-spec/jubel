import Anthropic from "@anthropic-ai/sdk";

export const MODELS = {
  fast: "claude-haiku-4-5-20251001",
  editorial: "claude-sonnet-4-6",
} as const;

export function createClient(timeoutMs: number): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set");
  }
  return new Anthropic({ timeout: timeoutMs, maxRetries: 2 });
}

export function extractText(message: Anthropic.Message): string {
  const block = message.content.find((b) => b.type === "text");
  if (!block || block.type !== "text") {
    throw new Error("Model returned no text block");
  }
  return block.text;
}

export function extractJsonArray<T>(text: string): T[] {
  const cleaned = text.trim();
  const match = cleaned.match(/\[[\s\S]*\]/);
  const candidate = match ? match[0] : cleaned;
  const parsed: unknown = JSON.parse(candidate);
  if (!Array.isArray(parsed)) throw new Error("Expected a JSON array");
  return parsed as T[];
}

export async function withRetry<T>(
  label: string,
  attempts: number,
  fn: () => Promise<T>
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      console.error(`[${label}] attempt ${i + 1}/${attempts} failed: ${err}`);
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, 10000 * (i + 1)));
      }
    }
  }
  throw new Error(`[${label}] all ${attempts} attempts failed: ${lastError}`);
}
