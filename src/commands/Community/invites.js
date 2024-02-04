const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('invites')
    .setDescription('Get a users server invite count...')
    .addUserOption(option => option.setName('user').setDescription('The user you want to check invites of...').setRequired(true)),
    async execute(interation, message) {
        const user = interation.options.getUser('user');
        let invites = await interation.guild.invites.fetch();
        let userInv = invites.filter(u => u.inviter && u.inviter.id === user.id);

        let i = 0;
        userInv.forEach(inv => i += inv.uses);

        const invitesEmbed = new EmbedBuilder()
        .setColor("Orange")
        .setDescription(`<:InviteIcon:1125946625219637248> ${user.tag} has **${i}** invites. <a:PartyPopper:1125906182079533107>`)

        await interation.reply({ embeds: [invitesEmbed] });
    }
}
