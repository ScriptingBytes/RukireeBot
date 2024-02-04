const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('staff-apply')
    .setDescription('Apply for staff!')
    .addUserOption(option => option.setName('username').setDescription('Your Discord username').setRequired(true))
    .addStringOption(option => option.setName('reason').setDescription('The reason you want to apply').setRequired(true))
    .addNumberOption(option => option.setName('age').setDescription('Your age').setRequired(true))
    .addStringOption(option => option.setName('position').setDescription('The position you are applying for').setRequired(true).addChoices(
        { name: `Helper`, value: `helper`},
        { name: `Translator`, value: `translator`},
        { name: 'Moderator', value: 'moderator' },
        { name: 'Admin', value: 'admin' },
        { name: 'Developer', value: 'developer' },
    ))
    .addStringOption(option => option.setName('experience').setDescription('Tell us if you have had any experience like this before').setRequired(true)),
    async execute(interaction, client) {

        const guild = client.guilds.cache.get(`1115814357226491924`)

        if (interaction.guild.id != guild) return await interaction.reply({ content: `You must be in the Rukiree Support Discord server to use this command!`, ephemeral: true});

        const channel = client.channels.cache.get('1138229654390591499');
        const user = interaction.options.getUser('user') || interaction.user;
        let reason = interaction.options.getString('reason');
        let age = interaction.options.getNumber('age')
        let position = interaction.options.getString('position')
        let experiencce = interaction.options.getString('experience')
        const icon = user.displayAvatarURL();
        const tag = user.tag;
        const member = await interaction.guild.members.fetch(user.id);
        if (age <= 15) return await interaction.reply({ content: "You must be atleast 16 years old to apply for staff", ephemeral: true })
        if (age >= 40) return await interaction.reply({ content: "You are too old to apply for staff", ephemeral: true })

        const embed = new EmbedBuilder()
        .setTitle('Rukiree Staff Applications')
        .setColor(`Orange`)
        .setAuthor({ name: tag, iconURL: icon })
        .setThumbnail(icon)
        .setDescription(`**Reason:** ${reason} \n \n **Age:** ${age} \n \n **Applied position:** ${position} \n \n **Experience:** ${experiencce}`)
        .setFooter({ text: `User ID: ${user.id}`, inline: false })
        .addFields({ name: "Joined Rukiree Support Server:", value: `<t:${parseInt(member.joinedAt / 1000)}:R>`, inline: false })
        .setTimestamp()

        await channel.send({ embeds: [embed] })

        const embed2 = new EmbedBuilder()
        .setTitle(`Rukiree Staff Applications`)
        .setColor(`Orange`)
        .setDescription(`Hello <@${user.id}>, your application has been succesfully sent to Rukiree staff team <a:PartyPopper:1125906182079533107>. Best of luck to you.`)
        user.send({ embeds: [embed2]})

        await interaction.reply({ content: `<:Checkmark:1125943017434525776> Thanks for applying your application was sent to our team! The results will be announced to you shortly.`, ephemeral: true })
    }
}