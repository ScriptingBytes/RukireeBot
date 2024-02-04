const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder, ChannelType } = require(`discord.js`);
const voiceSchema = require(`../../Schemas.js/jointocreateSchema`); 

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`join-to-create`)
    .setDescription(`Setup / Disable the join to create voice channel system`)
    .addSubcommand(command => command.setName(`set`).setDescription(`Setup the join to create voice channel system`).addChannelOption(option => option.setName(`channel`).setDescription(`The channel you want users to join`).setRequired(true).addChannelTypes(ChannelType.GuildVoice)).addChannelOption(option => option.setName(`category`).setDescription(`The category where the voice channels will be stored`).setRequired(true).addChannelTypes(ChannelType.GuildCategory)).addIntegerOption(option => option.setName(`voice-limit`).setDescription(`Set the default user limit for the created voice channels`).setMinValue(2).setMaxValue(10)))
    .addSubcommand(command => command.setName(`disable`).setDescription(`Disable the join to create voice channel system`)),
    async execute (interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: '<:Denied:1125943015878443089> You do not have permission to use that command.', ephemeral: true});

        const data = await voiceSchema.findOne({ Guild: interaction.guild.id});
        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case `set`:

            if (data) return await interaction.reply({ content: `<:Denied:1125943015878443089> You already have the join to create voice channel system setup. Do /join-to-create disable to disable the system.`, ephemeral: true});
            else {
                const channel = interaction.options.getChannel(`channel`);
                const category = interaction.options.getChannel(`category`);
                const voicelimit = interaction.options.getInteger(`voice-limit`) || 4;

                await voiceSchema.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id,
                    Category: category.id,
                    VoiceLimit: voicelimit
                });

                const embed = new EmbedBuilder()
                .setColor(`Orange`)
                .setTitle(`Join to Create VC Manager`)
                .setDescription(`<:Checkmark:1125943017434525776> The join to create voice channel system has been setup in ${channel}, all new created voice channels will be stored in ${category}`)

                await interaction.reply({ embeds: [embed], ephemeral: true});

            }

            break;

            case `disable`:

            if (!data) return await interaction.reply({ content: `<:Denied:1125943015878443089> You currently do not have the join to create voice channel system setup. Do /join-to-create set to setup the system.`, ephemeral: true});
            else {
                const embed2 = new EmbedBuilder()
                .setColor(`Orange`)
                .setTitle(`Join to Create VC Manager`)
                .setDescription(`<:Checkmark:1125943017434525776> The join to create voice channel system has been disabled.`)

                await voiceSchema.deleteMany({ Guild: interaction.guild.id});

                await interaction.reply({ embeds: [embed2], ephemeral: true});
            }

        }
    }
}