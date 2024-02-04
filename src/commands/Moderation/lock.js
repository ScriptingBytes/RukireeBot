const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField, ChannelType } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName("lock")
    .setDescription("Lock a specified channel.")
    .addChannelOption(option => option.setName('channel').setDescription('The targeted channel to lock').addChannelTypes(ChannelType.GuildText).setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have permission to use that command.`, ephemeral: true})
        let channel = interaction.options.getChannel('channel');

        channel.permissionOverwrites.create(interaction.guild.id, { SendMessages: false })

        const lockEmbed = new EmbedBuilder()
        .setTitle("Channel Manager")
        .setColor("Orange")
        .setDescription(`<:LockedChannelIcon:1125944762852196463> ${channel} has been **locked**`)

        await interaction.reply({ embeds: [lockEmbed] })
    }
}