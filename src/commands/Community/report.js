const { SlashCommandBuilder, ModalBuilder, ActionRowBuilder, TextInputBuilder, TextInputStyle } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`report`)
    .setDescription(`Send a bug report to the developers`),
    async execute (interaction) {
        const reportmodal = new ModalBuilder()
        .setCustomId(`bugreport`)
        .setTitle(`Bug / Command Abuse Reporting`)
        
        const command = new TextInputBuilder()
        .setCustomId(`command`)
        .setRequired(true)
        .setPlaceholder(`Please only state the command name`)
        .setLabel(`What command has a bug / been abused`)
        .setStyle(TextInputStyle.Short);
        
        const description = new TextInputBuilder()
        .setCustomId(`description`)
        .setRequired(true)
        .setPlaceholder(`Be detailed as possible so that the devs can take action. If reporting abuse add the abusers ID!`)
        .setLabel(`Describe the bug / command abuse`)
        .setStyle(TextInputStyle.Paragraph);
        
        const firstActionRow = new ActionRowBuilder().addComponents(command);
        const secondActionRow = new ActionRowBuilder().addComponents(description);
        
        reportmodal.addComponents(firstActionRow, secondActionRow);
        await interaction.showModal(reportmodal);
    }
}