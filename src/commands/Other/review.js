const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
 
module.exports = {
    data: new SlashCommandBuilder()
        .setName("review")
        .setDescription("Leave a review in our reviews channel!")
        .setDMPermission(false)
        .addStringOption(option => 
            option.setName("stars")
                .setDescription("Amount of stars you want to give.")
                .addChoices(
                    { name: "⭐", value: "⭐" },
                    { name: "⭐⭐", value: "⭐⭐" },
                    { name: "⭐⭐⭐", value: "⭐⭐⭐" },
                    { name: "⭐⭐⭐⭐", value: "⭐⭐⭐⭐" },
                    { name: "⭐⭐⭐⭐⭐", value: "⭐⭐⭐⭐⭐" }
                )
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("description")
                .setDescription("Description of your review.")
                .setRequired(true)
        ),
    async execute(interaction, client) {
        const { options, member } = interaction;
 
        const stars = options.getString("stars");
        const description = options.getString("description");
 
        const channel = member.guild.channels.cache.get("1118306085825159188");
        const guild = client.guilds.cache.get(`1115814357226491924`)

        if (interaction.guild.id != guild) return await interaction.reply({ content: `You must be in the Rukiree Support Discord server to actually leave a review!`, ephemeral: true});

        const embed = new EmbedBuilder()
        .addFields(
            { name: "Stars", value: `${stars}`, inline: true },
            { name: "Review", value: `${description}\n` },
            { name: "User", value: `${interaction.user.tag}`}
            )
        .setColor(`Orange`)
        .setFooter({ text: `Rukiree Reviews`})
        .setTimestamp();
        channel.send({ embeds: [embed]});
 
        return interaction.reply({ content: `Your review was successfully submitted in: ${channel}! Thank you for the review!`, ephemeral: true });
    }
}