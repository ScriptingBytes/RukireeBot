const {SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionFlagsBits, ChannelType} = require('discord.js');
const TicketSetup = require('../../Schemas.js/ticketSetup');
const config = require('../../utils/ticketConfig');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticket-setup')
    .setDescription('Setup the ticket creation system')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addChannelOption((option) =>
      option
        .setName('channel')
        .setDescription('Select the channel where the tickets should be created.')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText)
    )
    .addChannelOption((option) =>
      option
        .setName('category')
        .setDescription('Select the parent where the tickets should be created.')
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildCategory)
    )
    .addRoleOption((option) =>
      option
        .setName('handlers')
        .setDescription('Select the ticket handlers role.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('description')
        .setDescription('Choose a description for the ticket embed.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('button')
        .setDescription('Choose a name for the ticket embed.')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('emoji')
        .setDescription('Choose a style, so choose a emoji.')
        .setRequired(true)
    ),
  async execute(interaction) {
    const { guild, options } = interaction;
    try {
      const channel = options.getChannel('channel');
      const category = options.getChannel('category');
      const handlers = options.getRole('handlers');
      const description = options.getString('description');
      const button = options.getString('button');
      const emoji = options.getString('emoji');

      await TicketSetup.findOneAndUpdate(
        { GuildID: guild.id },
        {
          Channel: channel.id,
          Category: category.id,
          Handlers: handlers.id,
          Description: description,
          Button: button,
          Emoji: emoji,
        },
        {
          new: true,
          upsert: true,
        }
      );
      const embed = new EmbedBuilder().setDescription(description).setColor(`Orange`).setTitle(`Ticket Creation / Support Manager`).setFooter({ text: `${interaction.guild.name} Ticket Creation / Support Manager`});
      const buttonshow = new ButtonBuilder()
        .setCustomId(button)
        .setLabel(button)
        .setEmoji(emoji)
        .setStyle(ButtonStyle.Secondary);
      await guild.channels.cache.get(channel.id).send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(buttonshow)],
      }).catch(error => {return});
  
      
      return interaction.reply({ embeds: [new EmbedBuilder().setTitle(`Ticket Creation / Support Manager`).setDescription('<:Checkmark:1125943017434525776> The ticket panel was successfully created.').setColor('Orange').setFooter({ text: `${interaction.guild.name} Ticket Creation / Support Manager`})], ephemeral: true});

    } catch (err) {
      console.log(err);
      const errEmbed = new EmbedBuilder().setColor('Orange').setDescription(`<:Warning:1125948329101103114> Uh oh, An error occured: ${config.ticketError}`).setTitle(`Ticket Creation / Support Manager`).setFooter({ text: `${interaction.guild.name} Ticket Creation / Support Manager`});
      return interaction.reply({ embeds: [errEmbed], ephemeral: true }).catch(error => {return});
    }
  },
};
