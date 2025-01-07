import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { Bot } from "grammy";
import { readFile } from "fs/promises";

const google = createGoogleGenerativeAI();
const model = google("gemini-2.0-flash-exp", {
  useSearchGrounding: true,
});

// Read system prompt from file with error handling
let system = `You are Nettra, an AI assistant. Default system prompt could not be loaded.`;
try {
  system = await readFile("system-prompt.txt", "utf-8");
} catch (error) {
  console.error(
    `[CRITICAL] Failed to load system prompt: ${
      error instanceof Error ? error.message : "Unknown error"
    }`
  );
  // Optionally send an alert or log to monitoring system
}

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(process.env.BOT_TOKEN!); // <-- put your bot token between the ""

// Handle other messages.
bot.on("message:text", async (ctx) => {
  try {
    ctx.replyWithChatAction("typing");
    const prompt = ctx.message.text;
    const { text, experimental_providerMetadata } = await generateText({
      model,
      prompt,
      system,
    });

    await ctx.reply(text, { parse_mode: "Markdown" });
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

// Start the bot.
bot.start({
  onStart: (botInfo) =>
    console.log("The bot is running on https://t.me/" + botInfo.username),
});
