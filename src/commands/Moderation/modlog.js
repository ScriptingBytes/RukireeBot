const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require(`discord.js`);
const modLogSchema = require(`../../Schemas.js/modLogSchema`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`modlogs`)
    .setDescription(`Setup or Remove the moderation logging system`)
    .addSubcommand(command => command.setName(`set`).setDescription(`Setup the moderation logging system`).addChannelOption(option => option.setName(`channel`).setDescription(`The channel you want the logging system to go`).setRequired(true)))
    .addSubcommand(command => command.setName(`remove`).setDescription(`Remove the moderation logging system`)),
    async execute (interaction) {
        const { options } = interaction;

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ViewAuditLog)) return await interaction.reply({ content: '<:Denied:1125943015878443089> You do not have the permission to use this command.', ephemeral: true});

        const  sub  = options.getSubcommand();

        const embed = new EmbedBuilder()
        .setTitle(`Moderation Logging Manager`)
        .setColor(`Orange`)

        switch (sub) {
            case `set`:

            const channel = options.getChannel(`channel`);

            const schemaData = await modLogSchema.findOne({ Guild: interaction.guild.id})
            if (!schemaData) {
                await modLogSchema.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id
                })

                embed.setDescription(`<:Checkmark:1125943017434525776> The moderation logging system has been setup`)
                await interaction.reply({ embeds: [embed], ephemeral: true})
            } else {
                embed.setDescription(`<:Denied:1125943015878443089> The moderation logging system has already been setup`)
                await interaction.reply({ embeds: [embed], ephemeral: true})
            }

            break;

            case `remove`:

            const schemaData2 = await modLogSchema.findOne({ Guild: interaction.guild.id})
            if (schemaData2) {
                await modLogSchema.deleteMany({ Guild: interaction.guild.id})

                embed.setDescription(`<:Checkmark:1125943017434525776> The moderation logging system has been removed`)
                await interaction.reply({ embeds: [embed], ephemeral: true})
            } else {
                embed.setDescription(`<:Denied:1125943015878443089> The moderation logging system is not currently setup`)
                await interaction.reply({ embeds: [embed], ephemeral: true})
            }
        }
    }
}