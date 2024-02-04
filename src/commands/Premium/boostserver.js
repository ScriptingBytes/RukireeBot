const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const boosterSchema = require('../../Schemas.js/boosterSchema');

const premiumSchema = require(`../../Schemas.js/premiumSchema`)

module.exports = {
  data : new SlashCommandBuilder()
  .setName('boost-annoucement')
  .setDescription('configure your booster channel')
  .addSubcommand(command => command
    .setName('set')
    .setDescription('set your booster channel')
    .addChannelOption(option => option
      .setName('channel1')
      .setDescription('choose your channel for booster')
      .setRequired(true))
    .addChannelOption(option => option
      .setName('channel2')
      .setDescription('log for your booster')
      .setRequired(true))
  )
  .addSubcommand(command => command 
    .setName('remove')
    .setDescription('remove your booster channel')),

    
  
  async execute(interaction) {

    const premiumData = await premiumSchema.findOne({ UserID: interaction.user.id})
    const premiumEmbed = new EmbedBuilder()
    .setColor(`Orange`)
    .setDescription(`<:Denied:1125943015878443089> This is a premium only command! Subscribe to our patreon to get access to this command and many others!`)
    .setThumbnail(`https://media.discordapp.net/attachments/1115814358803546175/1117459335241531503/RukireePremium.png?width=676&height=676`)
    if (!premiumData) return await interaction.reply({ embeds: [premiumEmbed], ephemeral: true})

    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
    return await interaction.reply({ content: "<:Denied:1125943015878443089> You do not have permission to use that command.", ephemeral: true });

    const sub = interaction.options.getSubcommand();

    switch (sub){
      
      case 'set':

      const Channel1 = interaction.options.getChannel('channel1');
      const Channel2 = interaction.options.getChannel('channel2');

      const boosterdata = await boosterSchema.findOne({ Guild: interaction.guild.id });

      if(boosterdata) return interaction.reply({ content : `<:Denied:1125943015878443089> You already have the boost annoucement system setup! Do /boost-annoucement remove to disable the boost annoucement system! (<#${boosterdata.Channel1}>)`, ephemeral: true})

      else {
        
        await boosterSchema.create({
          Guild : interaction.guild.id,
          Channel1: Channel1.id,
          Channel2: Channel2.id,
        });

        const embed = new EmbedBuilder()
          .setColor("Orange")
          .setTitle(`Boost Annoucement Manager`)
          .setTimestamp()
          .setFields({ name: `Public channel`, value: `⤷ The channel: ${Channel1} has been set as your booster annoucement channel.`, inline: false})
          .setFields({ name: `Log channel`, value: `⤷ The channel: ${Channel2} has been set as your boost log channel.`, inline: false})

        await interaction.reply({ embeds : [embed] });

      }

      break;

      case 'remove' :

      if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator))
         return await interaction.reply({ content: "<:Denied:1125943015878443089> You do not have permission to use that command.", ephemeral: true });

         const boosterdatas = await boosterSchema.findOne({ Guild : interaction.guild.id});

         if(!boosterdatas) return await interaction.reply({ content: `You do not currently have the boost annoucement system setup! Do /boost-annoucement set to setup the boost annoucement system!`, ephemeral: true}) 

         else {

          await boosterSchema.deleteMany({
            Guild : interaction.guild.id
          });

          const embed1 = new EmbedBuilder()
          .setColor("Orange")
          .setTitle(`Boost Annoucement Manager`)
          .setDescription(`<:Checkmark:1125943017434525776> Your Boost Annoucement system has been disabled`)
          .setTimestamp()

          await interaction.reply({ embeds: [embed1] });
        }
    }
  }
  
  
}