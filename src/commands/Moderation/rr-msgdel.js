const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType } = require(`discord.js`);
const roleSchema = require("../../Schemas.js/rrSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rr-msg-delete")
    .setDescription("Delete the message by message ID")
    .addStringOption(option =>
      option.setName("messageid")
        .setDescription("The message ID")
        .setRequired(true)),
  async execute(interaction, client) {
    const {options} = interaction;

    // Permissions
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have permission to use that command.`, ephemeral: true});

    const messageid = options.getString("messageid");

    const data = await roleSchema.findOne({ MessageID: messageid });

    if (!data) {
      return interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle(`Reaction Role Manager`)
            .setColor('Orange')
            .setDescription(`**There is no message with the given message ID**`)
        ],
        ephemeral: true
      });
    }

    const channel = await client.channels.fetch(data.ChannelID);
    const message = await channel.messages.fetch(messageid);
    message.delete();

    interaction.reply({
      embeds: [
        new EmbedBuilder()
        .setTitle(`Reaction Role Manager`)
        .setColor('Orange')
        .setDescription(`**The message ID specified has been deleted.**\nTo re-establish the system do: \`/rr-msg-create\``)
      ], ephemeral:true
    });

    await roleSchema.findOneAndDelete({MessageID: messageid});
  },
};
