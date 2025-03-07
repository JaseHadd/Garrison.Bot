import { ActionRowBuilder, EmbedBuilder, ModalBuilder, ModalSubmitInteraction, TextInputBuilder, TextInputStyle } from "discord.js";
import { Adventures } from "../db";

export const baseId = 'garrison.bot.modal.create-adventure';

const encodeUuid = (uuid: string) => Buffer.from(uuid.replace(/-/g, ''), 'hex').toString('base64');
const decodeUuid = (uuid: string) => {
    const hex = Buffer.from(uuid, 'base64').toString('hex').padStart(32, '0');
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
const getUuid = (customId: string) => decodeUuid(customId.slice(baseId.length + 1, customId.length - 1));

const modalId = (uuid: string) => `${baseId}(${encodeUuid(uuid)})`;
const fieldId = (field: string) => [baseId, field].join('.');
const fields = {
    name: fieldId('name'),
    description: fieldId('description')
}

export const makeTemplate = (uuid: string) => new ModalBuilder()
    .setCustomId(modalId(uuid))
    .setTitle('Create Adventure')
    .addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId(fields.name)
                .setLabel("Name")
                .setMinLength(8)
                .setMaxLength(256)
                .setStyle(TextInputStyle.Short)),
        new ActionRowBuilder<TextInputBuilder>().addComponents(
            new TextInputBuilder()
                .setCustomId(fields.description)
                .setLabel('Description')
                .setMinLength(0)
                .setMaxLength(2048)
                .setStyle(TextInputStyle.Paragraph)
        ));

export async function handleResponse(interaction: ModalSubmitInteraction) {
    await interaction.deferReply();

    const uuid = getUuid(interaction.customId);
    const adventure = await Adventures.findByPk(uuid);

    return await interaction.editReply({ embeds: [
        new EmbedBuilder().addFields(
            { name: 'Name', value: interaction.fields.getTextInputValue(fields.name) },
            { name: 'Players', value: `${adventure!.minimumPlayers}—${adventure!.maximumPlayers}` },
            { name: 'Levels', value: `${adventure!.minimumLevel}—${adventure!.maximumLevel}` },
            { name: 'Description', value: interaction.fields.getTextInputValue(fields.description) }
        )]});
}