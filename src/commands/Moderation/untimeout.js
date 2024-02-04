const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js')
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('untimeout')
    .setDescription('Untimesout a server member')
    .addUserOption(option => option.setName('target').setDescription('The user you would like to untimeout').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason for untiming out the user')),
    async execute(interaction, message, client) {
 
        const timeUser = interaction.options.getUser('target');
        const timeMember = await interaction.guild.members.fetch(timeUser.id);
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) return interaction.reply({ content: "<:Denied:1125943015878443089> You do not have permission to use that command.", ephemeral: true})
        if (!timeMember.kickable) return interaction.reply({ content: '<:Denied:1125943015878443089> I cannot untimeout this user! This is either because their higher than me or you.', ephemeral: true})
        if (interaction.member.id === timeMember.id) return interaction.reply({content: "<:Denied:1125943015878443089> You cannot untimeout yourself!", ephemeral: true})
        if (timeMember.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({content: "<:Denied:1125943015878443089> You cannot untimeout staff members or people with the Administrator permission.", ephemeral: true})
 
        let reason = interaction.options.getString('reason');
        if (!reason) reason = "No reason given."
 
        await timeMember.timeout(null, reason)
 
            const minEmbed = new EmbedBuilder()
            .setColor("Orange")
            .setDescription(`<:UnmutedIcon:1128102552081289267> | ${timeUser.tag}'s timeout has been **revoked** | ${reason}`)
 
            const dmEmbed = new EmbedBuilder()
            .setDescription(`<:UnmutedIcon:1128102552081289267> | Your timeout has been **revoked** in ${interaction.guild.name} | ${reason}`)
            .setColor(`Orange`)
 
            await timeMember.send({ embeds: [dmEmbed] }).catch(err => {
                return;
            })
 
            await interaction.reply({ embeds: [minEmbed] })
 
 
 
    },
}