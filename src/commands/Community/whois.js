const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`who-is`)
    .setDescription(`Look up who a server member is...`)
    .addUserOption(option => option.setName(`user`).setDescription(`Person who you want to look up`).setRequired(true)),
    async execute (interaction) {
        const user = interaction.options.getUser('user') || interaction.user;
        const member = await interaction.guild.members.fetch(user.id);
        const icon = user.displayAvatarURL();
        const tag = user.tag;

        const embed = new EmbedBuilder()
        .setTitle(`User Lookup Manager`)
        .setColor(`Orange`)
        .setAuthor({ name: tag, iconURL: icon})
        .setThumbnail(icon)
        .addFields({ name: `Username / Member: `, value: `${user}`, inline: false})
        .addFields({ name: `Roles: `, value: `${member.roles.cache.map(r => r).join(` `)}`, inline: false})
        .addFields({ name: `Account Created: `, value: `${user.createdAt.toLocaleDateString()}\n<t:${parseInt(user.createdAt / 1000)}:R>`})
        .addFields({ name: `Joined Server: `, value: `${member.joinedAt.toLocaleDateString()}\n<t:${parseInt(member.joinedAt / 1000)}:R>`})
        .setFooter({ text: `ID: ${user.id}`})
        .setTimestamp()

        await interaction.reply({ embeds: [embed]})
    }
}