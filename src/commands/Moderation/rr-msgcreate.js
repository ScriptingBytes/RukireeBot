const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType } = require(`discord.js`);
const roleSchema = require("../../Schemas.js/rrSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rr-msg-create")
    .setDescription("Setup the reaction role system")
    .addStringOption(option =>
      option.setName("title")
        .setDescription("Title of the system")
        .setRequired(true))
    .addStringOption(option =>
      option.setName("description")
        .setDescription("Description of the system")
        .setRequired(true))
    .addChannelOption(option =>
      option.setName("channel")
        .setDescription("Channel that contains the system")
        .setRequired(true)
        .addChannelTypes(ChannelType.GuildText))
  
    .addStringOption(option => 
      option.setName('image')
      .setDescription(`Attached image on message (png link)`)
      .setRequired(false))
  
    .addStringOption(option => 
      option.setName('thumbnail')
      .setDescription(`Attached thumbnail on message (png link)`)
      .setRequired(false)),
  
  async execute(interaction) {
    const { options } = interaction;

    // Permissions
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have permission to use that command.`, ephemeral: true});

    const channel = options.getChannel("channel");
    const title = options.getString("title");
    const description = options.getString("description");
    const image = options.getString('image') || 'null';
    const thumbnail = interaction.options.getString('thumbnail') || 'null';
  

  const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor('Orange')
        .setDescription(`${description}`)
        .setTimestamp();

    if (image) {
                if (!image.startsWith('http') && image !== 'null') return await interaction.reply({ content: 'The entered image is not valid.', ephemeral: true})
            }
    if (thumbnail) {
                if (!thumbnail.startsWith('http') && thumbnail !== 'null') return await interaction.reply({ content: 'The entered thumbnail is not valid.', ephemeral: true})
            }
    
    if (image !== 'null') {
                embed.setImage(image)
            }
    
    if (thumbnail !== 'null') {
                embed.setThumbnail(thumbnail)
            }


      const mess = await channel.send({ embeds: [embed]});
      const messid = mess.id;

      const data = await roleSchema.create({
        Guild: interaction.guild.id,
        ChannelID: channel.id,
        MessageID: messid,
        Title: title,
        Description: description,
    });

    if (image !== 'null') {
       await roleSchema.findOneAndUpdate(
          {MessageID: messid}, {Image: image}, {new: true});
    }
    
    if (thumbnail !== 'null') {
       await roleSchema.findOneAndUpdate(
          {MessageID: messid}, {Thumbnail: thumbnail}, {new: true});
    }

    const embed2 = new EmbedBuilder()
    .setColor('Orange')
    .setTitle(`Reaction Role Manager`)
    .setDescription(`<:Checkmark:1125943017434525776> The reaction role system has been setup`)
    .addFields({name: 'Message ID', value: `${data.MessageID}`})
    .setTimestamp()
    
    await interaction.reply({embeds: [embed2], ephemeral: true});
  },
};
