const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require(`discord.js`)
const autoreactSchema = require(`../../Schemas.js/autoreactSchema`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`auto-reaction`)
    .setDescription(`Manage the auto reaction system`)
    .addSubcommand(command => command.setName(`setup`).setDescription(`Setup the auto reaction system for a channel`).addStringOption(option => option.setName(`emoji`).setDescription(`The emoji you want to be as the reaction`).setRequired(true)).addChannelOption(option => option.setName(`channel`).setDescription(`The channel the system will be setup in`).setRequired(false)))
    .addSubcommand(command => command.setName(`disable-one`).setDescription(`Disable a channel in the auto reaction system`).addChannelOption(option => option.setName(`channel`).setDescription(`The channel to remove from the auto reaction system list`).setRequired(true)))
    .addSubcommand(command => command.setName(`disable-all`).setDescription(`Disable all the channels in auto reaction system`)),
    async execute(interaction) {

        const { options } = interaction;
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have permission to use that command.`, ephemeral: true});

        const channel = options.getChannel(`channel`) || interaction.channel;
        const sub = options.getSubcommand();
        const data = await autoreactSchema.findOne({ Guild: interaction.guild.id, Channel: channel.id});

        switch(sub) {
            case `setup`:

            if (data) {
                return await interaction.reply({ content: `<:Denied:1125943015878443089> You already have the auto reaction system setup for ${channel}! Do /auto-reaction disable-one to remove the channel from the list.`, ephemeral: true})
            } else {
                const emoji = options.getString(`emoji`)

                await autoreactSchema.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id,
                    Emoji: emoji
                })

                const embed = new EmbedBuilder()
                .setTitle(`Auto Reaction Manager`)
                .setColor(`Orange`)
                .setDescription(`<:Checkmark:1125943017434525776> The auto reaction system has been setup successfully for ${channel}! Type a message in the channel to see it's effects.`)

                await interaction.reply({ embeds: [embed], ephemeral: true})
            }

            break;

            case `disable-one`:

            if (!data) {
                return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not currently have the auto reaction system setup for ${channel}! Do /auto-reaction setup to add the channel to the list.`, ephemeral: true})
            } else {
                await autoreactSchema.deleteMany({ Guild: interaction.guild.id, Channel: channel.id})

                const embed = new EmbedBuilder()
                .setTitle(`Auto Reaction Manager`)
                .setColor(`Orange`)
                .setDescription(`<:Checkmark:1125943017434525776> The auto reaction system has been disabled for ${channel}!`)

                await interaction.reply({ embeds: [embed], ephemeral: true})
            }
            break;

            case `disable-all`:

            const removeData = await autoreactSchema.findOne({ Guild: interaction.guild.id})
            if (!removeData) {
                return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not currently have the auto reaction system setup for any channels! Do /auto-reaction setup to add a channel to the list.`, ephemeral: true})
            } else {
                await autoreactSchema.deleteMany({ Guild: interaction.guild.id})

                const embed = new EmbedBuilder()
                .setTitle(`Auto Reaction Manager`)
                .setColor(`Orange`)
                .setDescription(`<:Checkmark:1125943017434525776> The auto reaction system has been disabled for all channels!`)

                await interaction.reply({ embeds: [embed], ephemeral: true})
            }
        }
    }
}