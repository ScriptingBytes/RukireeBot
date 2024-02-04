const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require(`discord.js`);
const levelSchema = require(`../../Schemas.js/level`);
const levelGuildSchema = require(`../../Schemas.js/levelGuildSchema`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`xpreset-user`)
    .setDescription(`Resets a users XP progress.`)
    .addUserOption(option => option.setName(`user`).setDescription(`The user you want to reset their XP.`).setRequired(true)),
    async execute(interaction) {
        const perm = new EmbedBuilder()
        .setTitle(`Leveling Manager`)
        .setColor(`Orange`)
        .setDescription(`<:Denied:1125943015878443089> You do not have permission to use that command.`)
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ embeds: [perm], ephemeral: true});

        const levelGuildData = await levelGuildSchema.findOne({ Guild: interaction.guild.id })
        if (!levelGuildData) return await interaction.reply({ content: `<:Denied:1125943015878443089> Your server does not currently have the leveling system setup! Do /level-system setup to setup the leveling system!`, ephemeral: true})

        const target = interaction.options.getUser(`user`);

        levelSchema.deleteMany({ Guild: interaction.guild.id, User: target.id}, async (err, data) => {
            const resetEmbed = new EmbedBuilder()
            .setTitle(`Leveling Manager`)
            .setColor(`Orange`)
            .setDescription(`<:Checkmark:1125943017434525776> ${target.tag}'s XP progress has been reset successfully!`)

            await interaction.reply({ embeds: [resetEmbed]})
        })
    }
}