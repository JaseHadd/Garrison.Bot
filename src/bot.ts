import { commands } from "./commands";
import { botConfig } from "./config";
import { BitFieldResolvable, Client, GatewayIntentsString } from "discord.js";
import { handleResponse, baseId } from "./modals/create-adventure";

export default class Bot
{
    static #intents: BitFieldResolvable<GatewayIntentsString, number> = ['Guilds', 'GuildMessages'];
    
    #client = this.#createClient();

    #createClient()
    {
        return new Client({ intents: Bot.#intents });
    }

    addEvents()
    {
        this.#client.once('ready', () => console.log('Client ready'));
        this.#client.on('interactionCreate', async (interaction) => {
            if (!interaction.isChatInputCommand()) return;
            
            commands[interaction.commandName as keyof typeof commands]?.execute(interaction);
        });

        this.#client.on('interactionCreate', async interaction => {
            if (!interaction.isModalSubmit()) return;
            console.log(interaction.customId);
            if (interaction.customId.startsWith(baseId))
                await handleResponse(interaction);
        });
    }

    login()
    {
        this.#client.login(botConfig.token);
    }
}