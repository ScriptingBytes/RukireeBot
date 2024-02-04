const { PermissionsBitField, EmbedBuilder, ChannelType, ActionRowBuilder, SelectMenuBuilder, SlashCommandBuilder } = require(`discord.js`);
const ticketSchema = require(`../../Schemas.js/ticketSetup`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`ticket-disable`)
    .setDescription(`Disables the ticket creation system`),
    async execute (interaction) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `:no_entry_sign: You do not have permission to setup the ticket creation system.`, ephemeral: true})
        
        const embed = new EmbedBuilder()
        .setTitle(`Ticket Creation / Support Manager`)
        .setColor(`Orange`)
        .setDescription(`Your ticket creation system has been disabled.`)
        .setFooter({ text: `${interaction.guild.name} Ticket Creation / Support Manager`})

        ticketSchema.deleteMany({ GuildID: interaction.guild.id}, async (err, data) => {
            await interaction.reply({ embeds: [embed]})
        })
    }

}