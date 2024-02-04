const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`)
const levelSchema = require(`../../Schemas.js/level`)
const levelGuildSchema = require(`../../Schemas.js/levelGuildSchema`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`level-system`)
    .setDescription(`The level-system manager.`)
    .addSubcommand(command => command.setName(`setup`).setDescription(`Setup the leveling system.`).addChannelOption(option => option.setName(`channel`).setDescription(`The channel you want to send level up messages to`).setRequired(false)))
    .addSubcommand(command => command.setName(`remove`).setDescription(`Disable the leveling system.`)),
    async execute (interaction, client) {
        const perm = new EmbedBuilder()
        .setTitle(`Leveling Manager`)
        .setColor(`Orange`)
        .setDescription(`<:Denied:1125943015878443089> You do not have the permission to use this command. Only the server owner can use this command.`)
        if (interaction.user.id !== interaction.guild.ownerId) return await interaction.reply({ embeds: [perm], ephemeral: true});

        const { options } = interaction;

        const Data = await levelGuildSchema.findOne({ Guild: interaction.guild.id })

        const AC = options.getChannel(`channel`)
        
        const sub = options.getSubcommand()

        switch (sub) {
            case `setup`:
            
            const setupEmbed = new EmbedBuilder()
            .setTitle(`Leveling Manager`)
            .setColor(`Orange`)
            .setDescription(`<:Checkmark:1125943017434525776> The leveling system is now setup!`)

            if (Data) return await interaction.reply({ content: `<:Denied:1125943015878443089> You already have the leveling system setup! Do /level-system disable to disable the leveling system.`, ephemeral: true});
            
            if (!Data) {
                if (AC) {
                    await levelGuildSchema.create({
                        Guild: interaction.guild.id,
                        AnnouncementChannelId: AC.id,
                    })
                } else {
                    await levelGuildSchema.create({
                        Guild: interaction.guild.id,
                        AnnouncementChannelId: `none`,
                    })
                }
                await interaction.reply({ embeds: [setupEmbed]})
            }

            break;

            case `remove`:

            const disableEmbed = new EmbedBuilder()
            .setTitle(`Leveling Manager`)
            .setColor(`Orange`)
            .setDescription(`<:Checkmark:1125943017434525776> The leveling system is now disabled!`)

            if (!Data) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not currently have the leveling system setup! Do /level-system setup to setup the leveling system.`, ephemeral: true});
            
            if (Data) {
                await levelGuildSchema.deleteMany({ Guild: interaction.guild.id })
                await levelSchema.deleteMany({ Guild: interaction.guild.id})
                await interaction.reply({ embeds: [disableEmbed]})
            }
        
        }

    }
}