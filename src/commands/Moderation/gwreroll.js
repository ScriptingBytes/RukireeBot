const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { PermissionsBitField } = require(`discord.js`)
const { mongoose } = require(`mongoose`)

module.exports = {
    data:new SlashCommandBuilder()
    .setName(`gwreroll`)
    .setDescription(`Rerolls A Giveaway`)
    .addStringOption(option =>
        option
            .setName('message_id')
            .setDescription('The Message id Of the Giveaway')
            .setRequired(true)),
            
                    async execute(interaction, client) {
                        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEvents)) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have permission to use that command..`, ephemeral: true});
                        const query = interaction.options.getString('message_id');
const giveaway =
    // Search with giveaway prize
    client.giveawayManager.giveaways.find((g) => g.guildId === interaction.guildId && g.prize === query) ||
    // Search with messageId
    client.giveawayManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === query);

// If no giveaway was found
if (!giveaway) return interaction.reply(`Unable to find a giveaway for \`${query}\`.`);
const messageId = interaction.options.getString('message_id');
client.giveawayManager.reroll(messageId).then(() => {
                interaction.reply({ content: '<:Checkmark:1125943017434525776> Success! Giveaway rerolled!', ephemeral: true});
            })
            .catch((err) => {
                interaction.reply({ content: `<:Warning:1125948329101103114> An error has occurred, please check and try again.\n\`${err}\``, ephemeral: true});
            });
                    }

}