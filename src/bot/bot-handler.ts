import { Bot, Context } from "grammy";
import { generateText } from "ai";
import { model } from "../config/ai-config";
import { loadSystemPrompt } from "../utils/system-prompt";
import makeRTLIfArabic from "../utils/makeRTLIfArabic";
import splitTelegramMessage from "../utils/splitTelegramMessage";
import type { Message } from "grammy/types";

import { readFile } from "fs/promises";

async function handleTextGeneration(
  ctx: Context,
  prompt: string,
  system: string
) {
  try {
    ctx.replyWithChatAction("typing");
    const interval = setInterval(() => {
      ctx.replyWithChatAction("typing");
    }, 5000);
    const { text } = await generateText({
      model,
      prompt,
      system,
    });

    clearInterval(interval);
    const splittedText = splitTelegramMessage(makeRTLIfArabic(text));

    let lastMessage: Message | undefined;
    for (const text of splittedText) {
      const msg = await ctx.reply(text, {
        parse_mode: "HTML",
        reply_parameters: lastMessage
          ? { message_id: lastMessage.message_id }
          : undefined,
      });
      lastMessage = msg;
    }
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
}

export async function initializeBot() {
  const bot = new Bot(process.env.BOT_TOKEN!);
  const system = await loadSystemPrompt();

  bot.command("ask", async (ctx) => {
    if (ctx.match === "") {
      ctx.reply("write /ask with question.");
      return;
    }
    await handleTextGeneration(ctx, ctx.match!, system);
  });

  bot.on("message:text", (ctx) =>
    handleTextGeneration(ctx, ctx.message.text, system)
  );

  return bot;
}
