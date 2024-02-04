const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`vote`)
    .setDescription(`Brings you to the top.gg voting page.`),
    async execute (interaction) {
        const embed = new EmbedBuilder()
        .setTitle(`Vote!`)
        .setColor(`Orange`)
        .addFields({name: `Here is our top.gg voting link!`, value: `⤷ https://top.gg/bot/1115811892607340668`})

        await interaction.reply({embeds: [embed]})
    }
}