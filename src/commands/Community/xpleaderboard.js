const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder, PermissionsBitField } = require(`discord.js`);
const levelSchema = require(`../../Schemas.js/level`);
const levelGuildSchema = require(`../../Schemas.js/levelGuildSchema`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`xp-leaderboard`)
    .setDescription(`This gets a servers XP leaderboard`),
    async execute(interaction) {
        const { guild, client } = interaction;

        const levelGuildData = await levelGuildSchema.findOne({ Guild: interaction.guild.id })
        if (!levelGuildData) return await interaction.reply({ content: `<:Denied:1125943015878443089> Your server does not currently have the leveling system setup! Do /level-system setup to setup the leveling system!`, ephemeral: true})


        let text = "";

        const noLeaderboardEmbed = new EmbedBuilder()
        .setTitle(`Leveling Manger`)
        .setColor(`Orange`)
        .setDescription(`<:Denied:1125943015878443089> Nobody is on the leaderboard currently...`)

        const Data = await levelSchema.find({ Guild: guild.id})
            .sort({
                XP: -1,
                Level: -1
            })
            .limit(25)

        if (!Data) return await interaction.reply({ embeds: [noLeaderboardEmbed]});

        await interaction.deferReply();

        for (let counter = 0; counter < Data.length; ++counter) {
            let { User, XP, Level } = Data[counter];

            const value = await client.users.fetch(User) || "Unknown Member"
            const member = value.tag;

            text += `${counter + 1}. ${member} | XP: ${XP}, Level: ${Level} \n`

            const leaderboardEmbed = new EmbedBuilder()
            .setTitle(`Leveling Manger`)
            .setColor(`Orange`)
            .setDescription(`\`\`\`${text}\`\`\``)
            .setTimestamp()
            .setFooter({ text: `${interaction.guild}'s XP Leaderboard`})

            interaction.editReply({ embeds: [leaderboardEmbed]})
        }
    }
}