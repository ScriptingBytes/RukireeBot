const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require(`discord.js`);
const levelSchema = require(`../../Schemas.js/level`);
const levelGuildSchema = require(`../../Schemas.js/levelGuildSchema`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`xpreset-server`)
    .setDescription(`Resets the servers XP progress.`),
    async execute(interaction) {
        const perm = new EmbedBuilder()
        .setTitle(`Leveling Manager`)
        .setColor(`Orange`)
        .setDescription(`<:Denied:1125943015878443089> You do not have the permission to use that command. Only the server owner can use that command.`)
        if (interaction.user.id !== interaction.guild.ownerId) return await interaction.reply({ embeds: [perm], ephemeral: true});

        const levelGuildData = await levelGuildSchema.findOne({ Guild: interaction.guild.id })
        if (!levelGuildData) return await interaction.reply({ content: `<:Denied:1125943015878443089> Your server does not currently have the leveling system setup! Do /level-system setup to setup the leveling system!`, ephemeral: true})

        const { guildID } = interaction;

        levelSchema.deleteMany({ Guild: guildID}, async (err, data) => {
            const resetEmbed = new EmbedBuilder()
            .setTitle(`Leveling Manager`)
            .setColor(`Orange`)
            .setDescription(`<:Checkmark:1125943017434525776> All of the XP progress has been reset successfully!`)

            await interaction.reply({ embeds: [resetEmbed]})
        })
    }
}