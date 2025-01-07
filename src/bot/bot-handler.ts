import { Bot } from "grammy";
import { generateText } from "ai";
import { model } from "../config/ai-config";
import { loadSystemPrompt } from "../utils/system-prompt";

export async function initializeBot() {
  const bot = new Bot(process.env.BOT_TOKEN!);
  const system = await loadSystemPrompt();

  bot.on("message:text", async (ctx) => {
    try {
      ctx.replyWithChatAction("typing");
      const prompt = ctx.message.text;
      const { text } = await generateText({
        model,
        prompt,
        system,
      });

      await ctx.reply(text, { parse_mode: "HTML" });
    } catch (error) {
      console.error(
        `[ERROR] Message processing failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      await ctx.reply(
        "Sorry, I'm experiencing technical difficulties. Please try again later."
      );
    }
  });

  return bot;
}
