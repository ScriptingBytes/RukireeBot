const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const staffSchema = require(`../../Schemas.js/staffSchema`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName('app-dec')
    .setDescription('Decline a staff application')
    .addUserOption(option => option.setName('username').setDescription('The applicants username').setRequired(true))
    .addStringOption(option => option.setName('position').setDescription('The position that was decided for the applicant').setRequired(true).addChoices(
        { name: `Helper`, value: `helper`},
        { name: `Translator`, value: `translator`},
        { name: 'Moderator', value: 'moderator' },
        { name: 'Admin', value: 'admin' },
        { name: 'Developer', value: 'developer' },
    )),
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(`1115814357226491924`)

        if (interaction.guild.id != guild) return await interaction.reply({ content: `You must be in the Rukiree Support Discord server to use this command!`, ephemeral: true});

        const staffData = await staffSchema.findOne({ UserID: interaction.user.id})
        const staffEmbed = new EmbedBuilder()
        .setColor(`Orange`)
        .setDescription(`You must be in the Rukiree staff team to be able to use this command!`)
        if (!staffData) return await interaction.reply({ embeds: [staffEmbed], ephemeral: true})

        let position = interaction.options.getString('position')
        const user = interaction.options.getUser('username')

        const accembed = new EmbedBuilder()
        .setTitle("Rukiree Staff Applications")
        .setColor(`Orange`)
        .setDescription(`<:Checkmark:1125943017434525776> <@${user.id}>'s application has been succesfully declined!`)
        .setTimestamp()

        const accembeduser = new EmbedBuilder()
        .setTitle("Rukiree Staff Applications")
        .setColor(`Orange`)
        .setDescription(`Hello <@${user.id}>, I'm sorry to say that but your submitted application to be a **${position}** was declined. \n Feel free to re-apply at any time!`)
        .setTimestamp()

        await interaction.reply({ embeds: [accembed] })

        user.send({ embeds: [accembeduser] })

    }

} 