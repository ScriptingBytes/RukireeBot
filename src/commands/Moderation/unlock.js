const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("unlock")
    .setDescription("Unlock a specified channel.")
    .addChannelOption(option => option.setName('channel').setDescription('The targeted channel to unlock').addChannelTypes(ChannelType.GuildText).setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have permission to use that command.`, ephemeral: true})
        let channel = interaction.options.getChannel('channel');

        channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: true })

        const unlockEmbed = new EmbedBuilder()
        .setTitle("Channel Manager")
        .setColor("Orange")
        .setDescription(`<:ChannelIcon:1125944760729866270> ${channel} has been **unlocked**`)

        await interaction.reply({ embeds: [unlockEmbed] })
    }
}