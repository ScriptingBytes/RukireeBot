const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js')
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName('member-count')
        .setDescription('Get the server member count...'),
    async execute(interaction, message) {
        const mcEmbed = new EmbedBuilder()
        .setColor("Orange")
        .setTitle('**Server Member Count**')
        .setDescription(`<a:PartyPopper:1125906182079533107> The server: "${interaction.guild.name}" has **${interaction.guild.memberCount}** members.`)
        await interaction.reply({ embeds: [mcEmbed] });
    }
}