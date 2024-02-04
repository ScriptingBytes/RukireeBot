const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require(`discord.js`)
const leaveSchema = require(`../../Schemas.js/leaveSchema`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`leave`)
    .setDescription(`Manage your leave message system`)
    .addSubcommand(command => command.setName(`setup`).setDescription(`Setup your leave message system`).addChannelOption(option => option.setName(`channel`).setDescription(`The channel you want the system to be based in.`).addChannelTypes(ChannelType.GuildText).setRequired(true)).addStringOption(option => option.setName(`message`).setDescription(`The message you want to leave people with. Use {member} to ping. Use (member) to put their username.`).setRequired(true)).addStringOption(option => option.setName(`reaction`).setDescription(`The reaction you want to add to whenever someone leaves.`).setRequired(false)))
    .addSubcommand(command => command.setName(`disable`).setDescription(`Disables your leave message system.`)),
    async execute(interaction) {
        const { options } = interaction;

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have permission to use that command.`, ephemeral: true})

        const sub = options.getSubcommand();
        const data = await leaveSchema.findOne({ Guild: interaction.guild.id});

        switch (sub) {
            case `setup`:

            if (data) {
                return await interaction.reply({ content: `<:Denied:1125943015878443089> You already have a leave message system setup. Do /leave disable to disable the message system.`, ephemeral: true});
            } else {
                const channel = options.getChannel(`channel`);
                const message = options.getString(`message`);
                const reaction = options.getString(`reaction`);

                await leaveSchema.create({
                    Guild: interaction.guild.id,
                    Channel: channel.id,
                    Message: message,
                    Reaction: reaction
                });

                const embed = new EmbedBuilder()
                .setTitle(`Welcome / Leave Message Manager`)
                .setColor(`Orange`)
                .setDescription(`<:Checkmark:1125943017434525776> Your leave message system has been setup! When a member leaves the message \`${message}\` will be sent in ${channel}`)

                await interaction.reply({ embeds: [embed], ephemeral: true})
            }

            break;
            case `disable`:

            if (!data) {
                return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not currently have a leave message system setup. Do /leave setup to setup the message system.`, ephemeral: true})
            } else {
                await leaveSchema.deleteMany({ Guild: interaction.guild.id});

                const embed2 = new EmbedBuilder()
                .setTitle(`Welcome / Leave Message Manager`)
                .setColor(`Orange`)
                .setDescription(`<:Checkmark:1125943017434525776> Your leave message system has been disabled! It will no longer produce leave messages.`)

                await interaction.reply({ embeds: [embed2], ephemeral: true})
            }
        }
    }
}