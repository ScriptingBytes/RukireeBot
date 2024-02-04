const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require(`discord.js`);
const levelSchema = require(`../../Schemas.js/level`);
const levelGuildSchema = require(`../../Schemas.js/levelGuildSchema`);
const Canvacord = require (`canvacord`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`rank`)
    .setDescription(`Gets a members rank in the server.`)
    .addUserOption(option => option.setName(`user`).setDescription(`The user you want to view their rank.`).setRequired(false)),
    async execute(interaction) {
        const {options, user, guild} = interaction;

        const levelGuildData = await levelGuildSchema.findOne({ Guild: interaction.guild.id })
        if (!levelGuildData) return await interaction.reply({ content: `<:Denied:1125943015878443089> Your server does not currently have the leveling system setup! Do /level-system setup to setup the leveling system!`, ephemeral: true})

        const Member = options.getMember(`user`) || user;
        const member = guild.members.cache.get(Member.id);

        const Data = await levelSchema.findOne({ Guild: guild.id, User: member.id});

        const noXPEmbed = new EmbedBuilder()
        .setTitle(`Leveling Manager`)
        .setColor(`Orange`)
        .setDescription(`<:Denied:1125943015878443089> ${member} has not gained any XP yet.`)

        if (!Data) return await interaction.reply({ embeds: [noXPEmbed]});

        await interaction.deferReply();

        const Required = Data.Level * Data.Level * 20 + 20;
        const rank = new Canvacord.Rank()
        .setAvatar(member.displayAvatarURL({ forseStatic: true}))
        .setBackground(`IMAGE`, `https://cdn.discordapp.com/attachments/1115814358803546175/1118556900225724486/rankbackground.png`)
        .setCurrentXP(Data.XP)
        .setRequiredXP(Required)
        .setRank(1, `Rank`, false)
        .setLevel(Data.Level, "Level")
        .setUsername(member.user.username)
        .setDiscriminator(member.user.discriminator)

        const Card = await rank.build();
        const attachment = new AttachmentBuilder(Card, { name: `rank.png`});

        const rankEmbed = new EmbedBuilder()
        .setTitle(`Leveling Manager\n\n${member.user.username}'s Level / Rank`)
        .setColor(`Orange`)
        .setImage(`attachment://rank.png`)

        await interaction.editReply({ embeds: [rankEmbed], files: [attachment]});
        
        
    }
}