import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong!')

export async function execute(interaction: ChatInputCommandInteraction)
{
    const sent = await interaction.reply({ content: 'Pinging…' });
    return await interaction.editReply(`Pong!\nRound-trip latency: ${sent.createdTimestamp - interaction.createdTimestamp}ms`);
}