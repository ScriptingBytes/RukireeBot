const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const figlet = require('figlet')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('ascii')
    .setDescription('Spice up your chat, with ASCII art!')
    .addStringOption(option => option.setName('text').setDescription('Specified text will be converted into art.').setRequired(true).setMaxLength(15)),
    async execute(interaction) {
        const text = interaction.options.getString('text')

        figlet(`${text}`, function (err, data) {

            if (err) {
                return interaction.reply({ content: `<:Warning:1125948329101103114> Something went wrong while trying to execute.`, ephemeral: true})
            }

            const embed = new EmbedBuilder()
            .setColor('Orange')
            .setDescription(`Here is your generated ASCII art:\n\`\`\`${data}\`\`\``)
            .setTitle('ASCII Art Generator')

            interaction.reply({ embeds: [embed] });
        });
    }
}