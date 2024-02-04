const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a specified user.')
    .addUserOption(option => option.setName('user').setDescription('The specified unban target.').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('Reasoning behind unban.').setRequired(true)),
    async execute(interaction, client) {
        const userID = interaction.options.getUser('user');

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have permission to use that command.`, ephemeral: true});
        if (interaction.member.id === userID) return await interaction.reply({ content: `<:Denied:1125943015878443089> You cannot ban yourself!`, ephemeral: true});

        let reason = interaction.options.getString('reason');
        if (!reason) reason = 'No reason included.';

        const UnbanEmbed = new EmbedBuilder()
        .setColor("Orange")
        .setDescription(`<a:PartyPopper:1125906182079533107> ${userID} has been **unbanned** for | ${reason}`)

        await interaction.guild.bans.fetch()
        .then(async bans => {
            if (bans.size == 0) return await interaction.reply({ content: '<:Warning:1125948329101103114> There are no banned users', ephemeral: true})
            let bannedID = bans.find(ban => ban.user.id == userID);
            if(!bannedID) return await interaction.reply({ content: '<:Warning:1125948329101103114> The ID mentioned is not banned.', ephemeral: true})
            
            await interaction.guild.bans.remove(userID, reason).catch(err => {
                return interaction.reply({ content: "<:Warning:1125948329101103114> I cannot unban this user."})
            })
        })

        await interaction.reply({ embeds: [UnbanEmbed] });
    }
}