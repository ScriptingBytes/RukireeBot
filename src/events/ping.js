const {
    Events,
    EmbedBuilder,
    ButtonStyle,
    ButtonBuilder,
    ActionRowBuilder,
  } = require("discord.js");
  
  module.exports = {
    name: Events.MessageCreate,
  
    async execute(message, client, interaction) {
      if (message.author.bot) return;
      if (message.content.includes(`${client.user.id}`))  {
        
        const totalMembers = await client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0); 
        const pingEmbed = new EmbedBuilder()
        
          .setColor("Orange")
          .setTitle("Ay, who mentioned me??")
          .setDescription(
            `Hey there ${message.author.username}!, Here is some useful information about me.\n⁉️ • **How to view all commands?**\nEither use **/help** or do / to view a list of all the commands!`
          )
  
          .addFields({ name: `**🌎 • Servers:**`, value: `${client.guilds.cache.size}`, inline: true })
          .addFields({ name: `**👨‍👩‍👧‍👦 • Users:**`, value: `${totalMembers}`, inline: true})
          .addFields({ name: `**🤖 • Commands:**`, value: `${client.commands.size}`, inline: true})
          .setTimestamp()
          .setThumbnail(`https://media.discordapp.net/attachments/1115814358803546175/1116020217643024475/Rukiree.png?width=676&height=676`)
          .setFooter({text: `Requested by ${message.author.username}.`})
        const buttons = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Invite")
            .setURL(
              "https://discord.com/api/oauth2/authorize?client_id=1115811892607340668&permissions=8&scope=bot"
            )
            .setStyle(ButtonStyle.Link),

          new ButtonBuilder()
            .setLabel(`Support Server`)
            .setURL(`https://discord.gg/cjjqD8HqMB`)
            .setStyle(ButtonStyle.Link)
        );
  
        return message.reply({ embeds: [pingEmbed], components: [buttons] });
      }
    },
  };