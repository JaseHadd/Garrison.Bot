import { REST, Routes } from "discord.js";
import { botConfig } from "./config";
import { commands } from "./commands";

const commandData = Object.values(commands).map(c => c.data);
const rest = new REST().setToken(botConfig.token);

type DeployCommandProps = {
    guildId: string
}

export async function deployCommands({ guildId }: DeployCommandProps) {
    console.log('Deploying slash commands');
    
    try {
        await rest.put(
            Routes.applicationGuildCommands(botConfig.clientId, guildId),
            { body: commandData });

        console.log('Finished deploying slash commands');
    } catch (error) {
        console.log('Error deploying slash commands', error);
    }
}