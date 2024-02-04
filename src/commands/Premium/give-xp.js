const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const levelSchema = require('../../Schemas.js/level');
const levelGuildSchema = require(`../../Schemas.js/levelGuildSchema`);

const premiumSchema = require(`../../Schemas.js/premiumSchema`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName('give-xp')
    .setDescription('Give a user specified amount of XP.')
    .addUserOption(option => option.setName('user').setDescription('Specified user will be given specified amount of XP.').setRequired(true))
    .addNumberOption(option => option.setName('amount').setDescription('The amount of XP you want to give specified user.').setRequired(true)),
    async execute(interaction) {

        const premiumData = await premiumSchema.findOne({ UserID: interaction.user.id})
        const premiumEmbed = new EmbedBuilder()
        .setColor(`Orange`)
        .setDescription(`<:Denied:1125943015878443089> This is a premium only command! Subscribe to our patreon to get access to this command and many others!`)
        .setThumbnail(`https://media.discordapp.net/attachments/1115814358803546175/1117459335241531503/RukireePremium.png?width=676&height=676`)
        if (!premiumData) return await interaction.reply({ embeds: [premiumEmbed], ephemeral: true})

        const levelGuildData = await levelGuildSchema.findOne({ Guild: interaction.guild.id })
        if (!levelGuildData) return await interaction.reply({ content: `<:Denied:1125943015878443089> Your server does not currently have the leveling system setup! Do /level-system setup to setup the leveling system!`, ephemeral: true})

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: '<:Denied:1125943015878443089> You do not have the permission to use this command.', ephemeral: true});

        const user = interaction.options.getUser('user');
        const amount = interaction.options.getNumber('amount');

        if (amount > 999) return await interaction.reply({ content: `<:Denied:1125943015878443089> You cannont give this user more than 999 xp.`, ephemeral: true})
        const { guildId } = interaction;

        levelSchema.findOne({ Guild: interaction.guild.id, User: user.id}, async (err, data) => {

            if (err) throw err;
    
            if (!data) return await interaction.reply({ content: `<:Denied:1125943015878443089> ${user} needs to have **earned** past XP in order to add to their XP.`, ephemeral: true})

            const give = amount;

            const Data = await levelSchema.findOne({ Guild: interaction.guild.id, User: user.id});

            if (!Data) return;

            const requiredXP = Data.Level * Data.Level * 20 + 20;
            Data.XP += give;
            Data.save();

            interaction.reply({ content: `<:Checkmark:1125943017434525776> Gave **${user.username}** **${amount}** XP.`, ephemeral: true})
        })
    }
}