const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('This clears channel messages. Cannot delete any messages older than 14 days.')
    .addIntegerOption(option => option.setName('amount').setDescription(`The amount of messages to delete`).setMinValue(1).setMaxValue(100).setRequired(true))
    .setDMPermission(false),
    async execute (interaction, client) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have permission to use that command.`, ephemeral: true})
        let number = interaction.options.getInteger('amount');

        const embed = new EmbedBuilder()
        .setColor("Orange")
        .setDescription(`<:Checkmark:1125943017434525776> Deleted ${number} messages`)


        await interaction.channel.bulkDelete(number)

        await interaction.reply({ embeds: [embed]});

                setTimeout(() => {

                    interaction.deleteReply();

                }, 5000);


    }
}