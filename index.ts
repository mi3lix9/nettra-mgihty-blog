import { initializeBot } from "./src/bot/bot-handler";

const bot = await initializeBot();

// Start the bot.
bot.start({
  onStart: (botInfo) =>
    console.log("The bot is running on https://t.me/" + botInfo.username),
});
