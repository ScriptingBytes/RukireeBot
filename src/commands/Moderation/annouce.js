const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, ChannelType } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Send an announcement to a specific channel')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption(option => option.setName('role').setDescription('The role you want to @').setRequired(true))
        .addStringOption(option => option.setName('title').setDescription('Title of the embed').setRequired(true))
        .addStringOption(option => option.setName('message').setDescription('Message contents of the announcement').setRequired(true))
        .addStringOption(option => option.setName('image').setDescription('Image of the embed (not required)').setRequired(false)),
    async execute(interaction) {
        const { options } = interaction;

        const role = options.getRole('role');
        const title = options.getString('title');
        const message = options.getString('message');
        const image = options.getString('image') || null;

        const embed = new EmbedBuilder()
            .setTitle(`:mega:  ${title}`)
            .setColor("Orange")
            .setDescription(`${message}`)
            .setImage(image)
            .setTimestamp()

        await interaction.channel.send({ embeds: [embed], content: `${role}` })
        await interaction.reply({ content: `<:AnnoucementsIcon:1135194509697876071> Annoucement was created. <a:PartyPopper:1125906182079533107>`, ephemeral: true}).catch(err => {
            return;
        })

    }
}