import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { generateText } from 'ai';
import { readFile } from 'fs/promises';
import { Bot } from "grammy";

const google = createGoogleGenerativeAI();
const model = google('gemini-2.0-flash-exp', {
  useSearchGrounding: true,
});

// Read system prompt from file
const system = await readFile('system-prompt.txt', 'utf-8');

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(process.env.BOT_TOKEN!); // <-- put your bot token between the ""

// You can now register listeners on your bot object `bot`.
// grammY will call the listeners when users send messages to your bot.

// Handle the /start command.
// bot.command("start", (ctx) => ctx.reply("Welcome! Up and running."));
// Handle other messages.
bot.on("message:text", async (ctx) => {
  ctx.replyWithChatAction("typing")
  const prompt = ctx.message.text
  const { text, experimental_providerMetadata } = await generateText({ model, prompt, system });

  await ctx.reply(text, { parse_mode: "HTML" })
});

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();
