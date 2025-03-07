import { ChatInputCommandInteraction, CommandInteraction, SlashCommandBuilder } from "discord.js";
import { Users } from "../db"
import { apiConfig } from "../config"

export const data = new SlashCommandBuilder()
    .setName('user')
    .setDescription('Connect to your Garrison account')
    .addSubcommand(subcommand =>
        subcommand
            .setName('status')
            .setDescription('Display the current status of your account link'))
    .addSubcommand(subcommand =>
        subcommand
            .setName('register')
            .setDescription('Start an automatic registration flow that will link your account'))
    .addSubcommand(subcommand =>
        subcommand
            .setName('authorize')
            .setDescription('Manually enter an API key to use to link to Garrison')
            .addStringOption(option =>
                option
                    .setName('key')
                    .setDescription('The 32-character API key issued from Garrison')
                    .setMinLength(32)
                    .setMaxLength(32)
                    .setRequired(true)));

export async function execute(interaction: ChatInputCommandInteraction)
{
    const subcommand: string = interaction.options.getSubcommand()
    
    if (subcommand === 'status')
    {
        await interaction.deferReply();

        const user = await getUser(interaction);
        if (user.apiKey)
            await interaction.editReply('Your Garrison account is linked!')
        else
            await interaction.editReply('You do not currently have a Garrison account linked')
    } else if (subcommand === 'register') {
        await interaction.reply({
            content: 'This is not yet implemented, please use `/user authorize` to link your account',
            flags: 'Ephemeral'
        });
    } else if (subcommand === 'authorize') {
        const defer = interaction.deferReply();
        const user = getUser(interaction);
        const apiKey = interaction.options.getString('key')!;

        const apiUrl = `${apiConfig.baseUrl}/user/me`;
        const headers = {
            Authorization: `Bearer ${apiKey}`
        };

        const apiCall = fetch(apiUrl, { headers: headers })
            .then(r => { console.log(r); return r; })
            .then(r => r.json() as Promise<MeResponse>)
            .catch(e => {
                console.log(e);
                throw new Error('Unable to authenticate with your API key');
            });

        Promise.all([defer, user, apiCall])
            .then(async ([, user, apiResponse]) => {
                user.set('apiKey', apiKey);
                await user.save();
                await interaction.editReply(`Successfully authenticated to Garrison as user ${apiResponse.name}`);
            }).catch(async (e: Error) => {
                await defer.then(() => interaction.editReply(e.message));
                throw e;
            });
    }
}

async function getUser(interaction: CommandInteraction)
{
    let user = await Users.findOne({ where: { discordId: interaction.user.id }});
    if (!user)
        user = await Users.create({
            discordId: BigInt(interaction.user.id),
            name: interaction.user.globalName || interaction.user.displayName});

    return user;
}

type MeResponse = {
    id: number,
    name: string
}