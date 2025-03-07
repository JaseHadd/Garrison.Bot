import Bot from "./bot";
import { deployCommands } from "./deploy-commands";

deployCommands({ guildId: '1303866055743242281' })

const bot = new Bot();
bot.addEvents();
bot.login();