const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a specified user.')
    .addUserOption(option => option.setName('user').setDescription('The specified ban target.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reasoning behind ban.').setRequired(true)),
    async execute(interaction, client) {

        const users = interaction.options.getUser('user');
        const ID = users.id;
        const banUser = client.users.cache.get(ID)
        
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have permission to use that command.`, ephemeral: true});
        if (interaction.member.id === ID) return await interaction.reply({ content: `<:Denied:1125943015878443089> You cannot ban yourself.`, ephemeral: true});

        let reason = interaction.options.getString('reason');
        if (!reason) reason = 'No reason included.';

        const dmBanEmbed = new EmbedBuilder()
        .setColor("Orange")
        .setDescription(`<:BanHammer:1125942817429147690> You have been **banned** from **${interaction.guild.name}** | ${reason}`)

        const BanEmbed = new EmbedBuilder()
        .setColor("Orange")
        .setDescription(`<:BanHammer:1125942817429147690> ${banUser.tag} has been **banned** for | ${reason}`)

        await interaction.guild.bans.create(banUser.id, {reason}).catch(err => {
            return interaction.reply({ content: `<:Warning:1125948329101103114> There was an error banning this user`, ephemeral: true})
        })

        await banUser.send({ embed: [dmBanEmbed] }).catch(err => {
            return;
        })

        await interaction.reply({ embeds: [BanEmbed] });
    }
}