import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { Adventures } from "../db";
import { makeTemplate } from "../modals/create-adventure";

const fields = {
    minPlayers: 'min_players',
    maxPlayers: 'max_players',
    minLevel: 'min_level',
    maxLevel: 'max_level'
}

export const data = new SlashCommandBuilder()
    .setName('adventure')
    .setDescription('Create a new adventure')
    .addIntegerOption(o => 
        o.setName(fields.minPlayers)
            .setDescription('The minimum amount of players your adventure needs')
            .setMinValue(1)
            .setMaxValue(12)
            .setRequired(true))
    .addIntegerOption(o => 
        o.setName(fields.maxPlayers)
            .setDescription('The maximum amount of players your adventure can support')
            .setMinValue(1)
            .setMaxValue(12)
            .setRequired(true))
    .addIntegerOption(o => 
        o.setName(fields.minLevel)
            .setDescription('The lowest level your adventure requires')
            .setMinValue(1)
            .setMaxValue(20)
            .setRequired(true))
    .addIntegerOption(o => 
        o.setName(fields.maxLevel)
            .setDescription('The maximum level for characters')
            .setMinValue(1)
            .setMaxValue(20)
            .setRequired(true))

export async function execute(interaction: ChatInputCommandInteraction)
{
    const [minimumPlayers, maximumPlayers, minimumLevel, maximumLevel] = [fields.minPlayers, fields.maxPlayers, fields.minLevel, fields.maxLevel]
        .map(k => interaction.options.get(k, true).value as number);

    const newId = crypto.randomUUID();
    const adventure = Adventures.create({
        id: newId, minimumLevel, maximumLevel, minimumPlayers, maximumPlayers
    });

    const modal = makeTemplate(newId);

    return interaction.showModal(modal);
}