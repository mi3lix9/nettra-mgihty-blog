import { readFile } from "fs/promises";

export async function loadSystemPrompt(
  defaultPrompt: string = "You are Nettra, an AI assistant. Default system prompt could not be loaded."
): Promise<string> {
  try {
    return await readFile("system-prompt.txt", "utf-8");
  } catch (error) {
    console.error(
      `[CRITICAL] Failed to load system prompt: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
    return defaultPrompt;
  }
}
