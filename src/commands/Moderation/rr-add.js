const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField} = require("discord.js");
const roleSchema = require("../../Schemas.js/rrSchema");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('rr-add')
    .setDescription('Add a button to the reaction role system message')
    .addStringOption(option =>
      option.setName("messageid")
        .setDescription("The message ID")
        .setRequired(true))

    .addStringOption(option =>
      option.setName("button")
        .setDescription("The button name")
        .setRequired(true))
      
    .addRoleOption(option => 
      option.setName('role')
    .setDescription('The role corresponding to the button')
      .setRequired(true))
      
    .addStringOption(option =>
      option.setName("icon")
        .setDescription("The buttons icon/emoji")
        .setRequired(false))
  ,
  async execute(interaction , client) {
    
    const {options} = interaction;

    // Permissions
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have permission to use that command.`, ephemeral: true});


    const messageID = options.getString("messageid");
    const button = options.getString("button");
    const role = options.getRole("role");
    const icon = options.getString("icon");

    const BotRole = interaction.guild.members.me.roles.highest.position;

    if (BotRole <= role.position) return interaction.reply({embeds: [
      new EmbedBuilder()
      .setTitle(`Reaction Role Manager`)
      .setColor("Orange")
      .setDescription(`**Role provided is above or equal to the bots highest role.**\n**Please add the specified role lower thanbots role for the system to function.**`)
    ] , ephemeral:true})
    
    const data = await roleSchema.findOne({
      Guild: interaction.guild.id,
      MessageID: messageID
    });

    if (!data) return interaction.reply({embeds: [
      new EmbedBuilder()
      .setTitle(`Reaction Role Manager`)
      .setColor("Orange")
      .setDescription(`**There is no message with the given message ID**`)
    ] , ephemeral:true})


    const pick1 = new ActionRowBuilder();
    const pick2 = new ActionRowBuilder();
    const pick3 = new ActionRowBuilder();
    
    if (icon) {
      if (!icon.match(/<:([^:]+):(\d+)>/)) return interaction.reply({embeds: [
      new EmbedBuilder()
      .setTitle(`Reaction Role Manager`)
      .setColor('Orange')
      .setDescription(`**The emoji entered is invalid**`)
    ], ephemeral:true});}

    if (data.RoleID1) {
      
       if (data.RoleID2) {

          if (data.RoleID3) {

             if (data.RoleID4) {

               if (data.RoleID5) {

                 if (data.RoleID6) {

                   if (data.RoleID7) {

                     if (data.RoleID8) {

                       if (data.RoleID9) {

                         if (data.ButtonID10) return;

              pick1.addComponents(
           but1 = new ButtonBuilder()
            .setLabel(data.Button1)
            .setCustomId('role-1')
            .setStyle(ButtonStyle.Secondary));   
         
             pick1.addComponents(
         but2 = new ButtonBuilder()
            .setLabel(data.Button2)
            .setCustomId('role-2')  
            .setStyle(ButtonStyle.Secondary));        
      
             pick1.addComponents(
         but3 = new ButtonBuilder()
            .setLabel(data.Button3)
            .setCustomId('role-3')  
            .setStyle(ButtonStyle.Secondary));

            pick1.addComponents(
         but4 = new ButtonBuilder()
            .setLabel(data.Button4)
            .setCustomId('role-4')  
            .setStyle(ButtonStyle.Secondary));

            pick1.addComponents(
         but5 = new ButtonBuilder()
            .setLabel(data.Button5)
            .setCustomId('role-5')  
            .setStyle(ButtonStyle.Secondary));


                     
            pick2.addComponents(
           but6 = new ButtonBuilder()
            .setLabel(data.Button6)
            .setCustomId('role-6')
            .setStyle(ButtonStyle.Secondary));

            pick2.addComponents(
           but7 = new ButtonBuilder()
            .setLabel(data.Button7)
            .setCustomId('role-7')
            .setStyle(ButtonStyle.Secondary));

             pick2.addComponents(
           but8 = new ButtonBuilder()
            .setLabel(data.Button8)
            .setCustomId('role-8')
            .setStyle(ButtonStyle.Secondary));

             pick2.addComponents(
           but9 = new ButtonBuilder()
            .setLabel(data.Button9)
            .setCustomId('role-9')
            .setStyle(ButtonStyle.Secondary));

            pick2.addComponents(
           but10 = new ButtonBuilder()
            .setLabel(button)
            .setCustomId('role-10')
            .setStyle(ButtonStyle.Secondary));

      
      const embed = new EmbedBuilder()
      .setTitle(data.Title)
      .setDescription(`${data.Description}`)
      .setColor("Orange")
      .setTimestamp()

      if (data.Image) {
        embed.setImage(data.Image)
      }

      if (data.Thumbnail) {
        embed.setThumbnail(data.Thumbnail)
      }
                         
      if (data.Emoji1) {
        but1.setEmoji(data.Emoji1)
      }

      if (data.Emoji2) {
        but2.setEmoji(data.Emoji2)
      }

      if (data.Emoji3) {
        but3.setEmoji(data.Emoji3)
      }

      if (data.Emoji4) {
        but4.setEmoji(data.Emoji4)
      }

      if (data.Emoji5) {
        but5.setEmoji(data.Emoji5)
      }

      if (data.Emoji6) {
        but6.setEmoji(data.Emoji6)
      }

      if (data.Emoji7) {
        but7.setEmoji(data.Emoji7)
      }

      if (data.Emoji8) {
        but8.setEmoji(data.Emoji8)
      }

      if (data.Emoji9) {
        but9.setEmoji(data.Emoji9)
      }
      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);
        
        but10.setEmoji(emojiMatch[2])
      }


      const channel = await client.channels.fetch(data.ChannelID);
    
      const message = await channel.messages.fetch(messageID);
    
      message.edit({embeds: [embed], components: [pick1 , pick2]});

      const dataa = await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          RoleID10: role.id,
          Button10: button,
        }, {new: true});

      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);

      await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          Emoji10: emojiMatch[2]
        }, {new: true}); 
      }
    
      await interaction.reply({embeds: [
        new EmbedBuilder()
        .setTitle(`Reaction Role Manager`)
        .setColor("Orange")
        .setDescription(`Added button with corresponding role: <@&${dataa.RoleID10}>`)
      ], ephemeral:true})
      return;             
                       }

              pick1.addComponents(
           but1 = new ButtonBuilder()
            .setLabel(data.Button1)
            .setCustomId('role-1')
            .setStyle(ButtonStyle.Secondary));   
         
             pick1.addComponents(
         but2 = new ButtonBuilder()
            .setLabel(data.Button2)
            .setCustomId('role-2')  
            .setStyle(ButtonStyle.Secondary));        
      
             pick1.addComponents(
         but3 = new ButtonBuilder()
            .setLabel(data.Button3)
            .setCustomId('role-3')  
            .setStyle(ButtonStyle.Secondary));

            pick1.addComponents(
         but4 = new ButtonBuilder()
            .setLabel(data.Button4)
            .setCustomId('role-4')  
            .setStyle(ButtonStyle.Secondary));

            pick1.addComponents(
         but5 = new ButtonBuilder()
            .setLabel(data.Button5)
            .setCustomId('role-5')  
            .setStyle(ButtonStyle.Secondary));


                     
            pick2.addComponents(
           but6 = new ButtonBuilder()
            .setLabel(data.Button6)
            .setCustomId('role-6')
            .setStyle(ButtonStyle.Secondary));

            pick2.addComponents(
           but7 = new ButtonBuilder()
            .setLabel(data.Button7)
            .setCustomId('role-7')
            .setStyle(ButtonStyle.Secondary));

             pick2.addComponents(
           but8 = new ButtonBuilder()
            .setLabel(data.Button8)
            .setCustomId('role-8')
            .setStyle(ButtonStyle.Secondary));

             pick2.addComponents(
           but9 = new ButtonBuilder()
            .setLabel(button)
            .setCustomId('role-9')
            .setStyle(ButtonStyle.Secondary));

      
      const embed = new EmbedBuilder()
      .setTitle(data.Title)
      .setDescription(`${data.Description}`)
      .setColor("Orange")
      .setTimestamp()

      if (data.Image) {
        embed.setImage(data.Image)
      }

      if (data.Thumbnail) {
        embed.setThumbnail(data.Thumbnail)
      }
 
      if (data.Emoji1) {
        but1.setEmoji(data.Emoji1)
      }

      if (data.Emoji2) {
        but2.setEmoji(data.Emoji2)
      }

      if (data.Emoji3) {
        but3.setEmoji(data.Emoji3)
      }

      if (data.Emoji4) {
        but4.setEmoji(data.Emoji4)
      }

      if (data.Emoji5) {
        but5.setEmoji(data.Emoji5)
      }

      if (data.Emoji6) {
        but6.setEmoji(data.Emoji6)
      }

      if (data.Emoji7) {
        but7.setEmoji(data.Emoji7)
      }

      if (data.Emoji8) {
        but8.setEmoji(data.Emoji8)
      }
      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);
        
        but9.setEmoji(emojiMatch[2])
      }


      const channel = await client.channels.fetch(data.ChannelID);
    
      const message = await channel.messages.fetch(messageID);
    
      message.edit({embeds: [embed], components: [pick1 , pick2]});

      const dataa = await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          RoleID9: role.id,
          Button9: button,
        }, {new: true});

      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);

      await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          Emoji9: emojiMatch[2]
        }, {new: true}); 
      }
    
      await interaction.reply({embeds: [
        new EmbedBuilder()
        .setTitle(`Reaction Role Manager`)
        .setColor("Orange")
        .setDescription(`Added button with corresponding role: <@&${dataa.RoleID9}>`)
      ], ephemeral:true})
      return;                            
                     }

             pick1.addComponents(
           but1 = new ButtonBuilder()
            .setLabel(data.Button1)
            .setCustomId('role-1')
            .setStyle(ButtonStyle.Secondary));   
         
             pick1.addComponents(
         but2 = new ButtonBuilder()
            .setLabel(data.Button2)
            .setCustomId('role-2')  
            .setStyle(ButtonStyle.Secondary));        
      
             pick1.addComponents(
         but3 = new ButtonBuilder()
            .setLabel(data.Button3)
            .setCustomId('role-3')  
            .setStyle(ButtonStyle.Secondary));

            pick1.addComponents(
         but4 = new ButtonBuilder()
            .setLabel(data.Button4)
            .setCustomId('role-4')  
            .setStyle(ButtonStyle.Secondary));

            pick1.addComponents(
         but5 = new ButtonBuilder()
            .setLabel(data.Button5)
            .setCustomId('role-5')  
            .setStyle(ButtonStyle.Secondary));


                     
            pick2.addComponents(
           but6 = new ButtonBuilder()
            .setLabel(data.Button6)
            .setCustomId('role-6')
            .setStyle(ButtonStyle.Secondary));

            pick2.addComponents(
           but7 = new ButtonBuilder()
            .setLabel(data.Button7)
            .setCustomId('role-7')
            .setStyle(ButtonStyle.Secondary));

             pick2.addComponents(
           but8 = new ButtonBuilder()
            .setLabel(button)
            .setCustomId('role-8')
            .setStyle(ButtonStyle.Secondary));

      
      const embed = new EmbedBuilder()
      .setTitle(data.Title)
      .setDescription(`${data.Description}`)
      .setColor("Orange")
      .setTimestamp()

      if (data.Image) {
        embed.setImage(data.Image)
      }

      if (data.Thumbnail) {
        embed.setThumbnail(data.Thumbnail)
      }
 
      if (data.Emoji1) {
        but1.setEmoji(data.Emoji1)
      }

      if (data.Emoji2) {
        but2.setEmoji(data.Emoji2)
      }

      if (data.Emoji3) {
        but3.setEmoji(data.Emoji3)
      }

      if (data.Emoji4) {
        but4.setEmoji(data.Emoji4)
      }

      if (data.Emoji5) {
        but5.setEmoji(data.Emoji5)
      }

      if (data.Emoji6) {
        but6.setEmoji(data.Emoji6)
      }

       if (data.Emoji7) {
        but7.setEmoji(data.Emoji7)
      }
                     
      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);
        
        but8.setEmoji(emojiMatch[2])
      }


      const channel = await client.channels.fetch(data.ChannelID);
    
      const message = await channel.messages.fetch(messageID);
    
      message.edit({embeds: [embed], components: [pick1 , pick2]});

      const dataa = await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          RoleID8: role.id,
          Button8: button,
        }, {new: true});

      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);

      await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          Emoji8: emojiMatch[2]
        }, {new: true}); 
      }
    
      await interaction.reply({embeds: [
        new EmbedBuilder()
        .setTitle(`Reaction Role Manager`)
        .setColor("Orange")
        .setDescription(`Added button with corresponding role: <@&${dataa.RoleID8}>`)
      ], ephemeral:true})
      return;                   
                   }

            pick1.addComponents(
           but1 = new ButtonBuilder()
            .setLabel(data.Button1)
            .setCustomId('role-1')
            .setStyle(ButtonStyle.Secondary));   
         
             pick1.addComponents(
         but2 = new ButtonBuilder()
            .setLabel(data.Button2)
            .setCustomId('role-2')  
            .setStyle(ButtonStyle.Secondary));        
      
             pick1.addComponents(
         but3 = new ButtonBuilder()
            .setLabel(data.Button3)
            .setCustomId('role-3')  
            .setStyle(ButtonStyle.Secondary));

            pick1.addComponents(
         but4 = new ButtonBuilder()
            .setLabel(data.Button4)
            .setCustomId('role-4')  
            .setStyle(ButtonStyle.Secondary));

            pick1.addComponents(
         but5 = new ButtonBuilder()
            .setLabel(data.Button5)
            .setCustomId('role-5')  
            .setStyle(ButtonStyle.Secondary));

            pick2.addComponents(
           but6 = new ButtonBuilder()
            .setLabel(data.Button6)
            .setCustomId('role-6')
            .setStyle(ButtonStyle.Secondary));

            pick2.addComponents(
           but7 = new ButtonBuilder()
            .setLabel(button)
            .setCustomId('role-7')
            .setStyle(ButtonStyle.Secondary));

      
      const embed = new EmbedBuilder()
      .setTitle(data.Title)
      .setDescription(`${data.Description}`)
      .setColor("Orange")
      .setTimestamp()

      if (data.Image) {
        embed.setImage(data.Image)
      }

      if (data.Thumbnail) {
        embed.setThumbnail(data.Thumbnail)
      }
 
      if (data.Emoji1) {
        but1.setEmoji(data.Emoji1)
      }

      if (data.Emoji2) {
        but2.setEmoji(data.Emoji2)
      }

      if (data.Emoji3) {
        but3.setEmoji(data.Emoji3)
      }

      if (data.Emoji4) {
        but4.setEmoji(data.Emoji4)
      }

      if (data.Emoji5) {
        but5.setEmoji(data.Emoji5)
      }

       if (data.Emoji6) {
        but6.setEmoji(data.Emoji6)
      }
      
      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);
        
        but7.setEmoji(emojiMatch[2])
      }


      const channel = await client.channels.fetch(data.ChannelID);
    
      const message = await channel.messages.fetch(messageID);
    
      message.edit({embeds: [embed], components: [pick1 , pick2]});

      const dataa = await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          RoleID7: role.id,
          Button7: button,
        }, {new: true});

      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);

      await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          Emoji7: emojiMatch[2]
        }, {new: true}); 
      }
    
      await interaction.reply({embeds: [
        new EmbedBuilder()
        .setTitle(`Reaction Role Manager`)
        .setColor("Orange")
        .setDescription(`Added button with corresponding role: <@&${dataa.RoleID7}>`)
      ], ephemeral:true})
      return;                   
                 }

             pick1.addComponents(
           but1 = new ButtonBuilder()
            .setLabel(data.Button1)
            .setCustomId('role-1')
            .setStyle(ButtonStyle.Secondary));   
         
      
             pick1.addComponents(
         but2 = new ButtonBuilder()
            .setLabel(data.Button2)
            .setCustomId('role-2')  
            .setStyle(ButtonStyle.Secondary));        
      
             pick1.addComponents(
         but3 = new ButtonBuilder()
            .setLabel(data.Button3)
            .setCustomId('role-3')  
            .setStyle(ButtonStyle.Secondary));

            pick1.addComponents(
         but4 = new ButtonBuilder()
            .setLabel(data.Button4)
            .setCustomId('role-4')  
            .setStyle(ButtonStyle.Secondary));

            pick1.addComponents(
         but5 = new ButtonBuilder()
            .setLabel(data.Button5)
            .setCustomId('role-5')  
            .setStyle(ButtonStyle.Secondary));

            pick2.addComponents(
           but6 = new ButtonBuilder()
            .setLabel(button)
            .setCustomId('role-6')
            .setStyle(ButtonStyle.Secondary));

      
      const embed = new EmbedBuilder()
      .setTitle(data.Title)
      .setDescription(`${data.Description}`)
      .setColor("Orange")
      .setTimestamp()

      if (data.Image) {
        embed.setImage(data.Image)
      }

      if (data.Thumbnail) {
        embed.setThumbnail(data.Thumbnail)
      }
 
      if (data.Emoji1) {
        but1.setEmoji(data.Emoji1)
      }

      if (data.Emoji2) {
        but2.setEmoji(data.Emoji2)
      }

      if (data.Emoji3) {
        but3.setEmoji(data.Emoji3)
      }

      if (data.Emoji4) {
        but4.setEmoji(data.Emoji4)
      }

      if (data.Emoji5) {
        but5.setEmoji(data.Emoji5)
      }
      
      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);
        
        but6.setEmoji(emojiMatch[2])
      }


      const channel = await client.channels.fetch(data.ChannelID);
    
      const message = await channel.messages.fetch(messageID);
    
      message.edit({embeds: [embed], components: [pick1 , pick2]});

      const dataa = await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          RoleID6: role.id,
          Button6: button,
        }, {new: true});

      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);

      await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          Emoji6: emojiMatch[2]
        }, {new: true}); 
      }
    
      await interaction.reply({embeds: [
        new EmbedBuilder()
        .setTitle(`Reaction Role Manager`)
        .setColor("Orange")
        .setDescription(`Added button with corresponding role: <@&${dataa.RoleID6}>`)
      ], ephemeral:true})
      return;
               }

               
          pick1.addComponents(
           but1 = new ButtonBuilder()
            .setLabel(data.Button1)
            .setCustomId('role-1')
                    .setStyle(ButtonStyle.Secondary));   
         
      
             pick1.addComponents(
         but2 = new ButtonBuilder()
            .setLabel(data.Button2)
            .setCustomId('role-2')  
            .setStyle(ButtonStyle.Secondary));        
      
             pick1.addComponents(
         but3 = new ButtonBuilder()
            .setLabel(data.Button3)
            .setCustomId('role-3')  
            .setStyle(ButtonStyle.Secondary));

            pick1.addComponents(
         but4 = new ButtonBuilder()
            .setLabel(data.Button4)
            .setCustomId('role-4')  
            .setStyle(ButtonStyle.Secondary));

            pick1.addComponents(
         but5 = new ButtonBuilder()
            .setLabel(button)
            .setCustomId('role-5')  
            .setStyle(ButtonStyle.Secondary));

      
      const embed1 = new EmbedBuilder()
      .setTitle(data.Title)
      .setDescription(`${data.Description}`)
      .setColor("Orange")
      .setTimestamp()

      if (data.Image) {
        embed1.setImage(data.Image)
      }

      if (data.Thumbnail) {
        embed1.setThumbnail(data.Thumbnail)
      }
 
      if (data.Emoji1) {
        but1.setEmoji(data.Emoji1)
      }

      if (data.Emoji2) {
        but2.setEmoji(data.Emoji2)
      }

      if (data.Emoji3) {
        but3.setEmoji(data.Emoji3)
      }

      if (data.Emoji4) {
        but4.setEmoji(data.Emoji4)
      }
      
      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);
        
        but5.setEmoji(emojiMatch[2])
      }


      const channel = await client.channels.fetch(data.ChannelID);
    
      const message = await channel.messages.fetch(messageID);
    
      message.edit({embeds: [embed1], components: [pick1]});

      const dataa = await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          RoleID5: role.id,
          Button5: button,
        }, {new: true});

      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);

      await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          Emoji5: emojiMatch[2]
        }, {new: true}); 
      }
    
      await interaction.reply({embeds: [
        new EmbedBuilder()
        .setColor("Orange")
        .setTitle(`Reaction Role Manager`)
        .setDescription(`Added button with corresponding role: <@&${dataa.RoleID5}>`)
      ], ephemeral:true})
      return; 
               
             }
          
          pick1.addComponents(
           but1 = new ButtonBuilder()
            .setLabel(data.Button1)
            .setCustomId('role-1')
                    .setStyle(ButtonStyle.Secondary));   
         
      
             pick1.addComponents(
         but2 = new ButtonBuilder()
            .setLabel(data.Button2)
            .setCustomId('role-2')  
            .setStyle(ButtonStyle.Secondary));        
      
             pick1.addComponents(
         but3 = new ButtonBuilder()
            .setLabel(data.Button3)
            .setCustomId('role-3')  
            .setStyle(ButtonStyle.Secondary));

            pick1.addComponents(
         but4 = new ButtonBuilder()
            .setLabel(button)
            .setCustomId('role-4')  
            .setStyle(ButtonStyle.Secondary));

      
      const embed1 = new EmbedBuilder()
      .setTitle(data.Title)
      .setDescription(`${data.Description}`)
      .setColor("Orange")
      .setTimestamp()

      if (data.Image) {
        embed1.setImage(data.Image)
      }

      if (data.Thumbnail) {
        embed1.setThumbnail(data.Thumbnail)
      }
            
      if (data.Emoji1) {
        but1.setEmoji(data.Emoji1)
      }

      if (data.Emoji2) {
        but2.setEmoji(data.Emoji2)
      }

      if (data.Emoji3) {
        but3.setEmoji(data.Emoji3)
      }
      
      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);
        
        but4.setEmoji(emojiMatch[2])
      }


      const channel = await client.channels.fetch(data.ChannelID);
    
      const message = await channel.messages.fetch(messageID);
    
      message.edit({embeds: [embed1], components: [pick1]});

      const dataa = await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          RoleID4: role.id,
          Button4: button,
        }, {new: true});

      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);

      await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          Emoji4: emojiMatch[2]
        }, {new: true}); 
      }
    
      await interaction.reply({embeds: [
        new EmbedBuilder()
        .setColor("Orange")
        .setTitle(`Reaction Role Manager`)
        .setDescription(`Added button with corresponding role: <@&${dataa.RoleID4}>`)
      ], ephemeral:true})
      return; 
          }

                  pick1.addComponents(
           but1 = new ButtonBuilder()
            .setLabel(data.Button1)
            .setCustomId('role-1')
                    .setStyle(ButtonStyle.Secondary));   
         
      
             pick1.addComponents(
         but2 = new ButtonBuilder()
            .setLabel(data.Button2)
            .setCustomId('role-2')  
            .setStyle(ButtonStyle.Secondary));        
      
             pick1.addComponents(
         but3 = new ButtonBuilder()
            .setLabel(button)
            .setCustomId('role-3')  
            .setStyle(ButtonStyle.Secondary));

      
      const embed1 = new EmbedBuilder()
      .setTitle(data.Title)
      .setDescription(`${data.Description}`)
      .setTimestamp()

      if (data.Image) {
        embed1.setImage(data.Image)
      }

      if (data.Thumbnail) {
        embed1.setThumbnail(data.Thumbnail)
      }
 
      if (data.Emoji1) {
        but1.setEmoji(data.Emoji1)
      }

      if (data.Emoji2) {
        but2.setEmoji(data.Emoji2)
      }
      
      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);
        
        but3.setEmoji(emojiMatch[2])
      }


      const channel = await client.channels.fetch(data.ChannelID);
    
      const message = await channel.messages.fetch(messageID);
    
      message.edit({embeds: [embed1], components: [pick1]});

      const dataa = await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          RoleID3: role.id,
          Button3: button,
        }, {new: true});

      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);

      await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          Emoji3: emojiMatch[2]
        }, {new: true}); 
      }
    
      await interaction.reply({embeds: [
        new EmbedBuilder()
        .setTitle(`Reaction Role Manager`)
        .setColor("Orange")
        .setDescription(`Added button with corresponding role: <@&${dataa.RoleID3}>`)
      ], ephemeral:true})
      return; 
         
       }

          pick1.addComponents(
           but1 = new ButtonBuilder()
            .setLabel(data.Button1)
            .setCustomId('role-1')
                   .setStyle(ButtonStyle.Secondary));   
      
             pick1.addComponents(
         but2 = new ButtonBuilder()
            .setLabel(button)
            .setCustomId('role-2')  
            .setStyle(ButtonStyle.Secondary));

      
      const embed1 = new EmbedBuilder()
      .setTitle(data.Title)
      .setDescription(`${data.Description}`)
      .setColor("Orange")
      .setTimestamp()

      if (data.Image) {
        embed1.setImage(data.Image)
      }

      if (data.Thumbnail) {
        embed1.setThumbnail(data.Thumbnail)
      }
      
      if (data.Emoji1) {
        but1.setEmoji(data.Emoji1)
      }
      
      if (icon) {
        const emoji2Match = icon.match(/<:([^:]+):(\d+)>/);
        
        but2.setEmoji(emoji2Match[2])
      }


      const channel = await client.channels.fetch(data.ChannelID);
    
      const message = await channel.messages.fetch(messageID);
    
      message.edit({embeds: [embed1], components: [pick1]});

      const dataa = await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          RoleID2: role.id,
          Button2: button,
        }, {new: true});

      if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);

      await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          Emoji2: emojiMatch[2]
        }, {new: true}); 
      }
    
      await interaction.reply({embeds: [
        new EmbedBuilder()
        .setTitle(`Reaction Role Manager`)
        .setColor("Orange")
        .setDescription(`Added button with corresponding role: <@&${dataa.RoleID2}>`)
      ], ephemeral:true})
      return;
    } 
      pick1.addComponents(
         but1 = new ButtonBuilder()
            .setLabel(button)
            .setCustomId('role-1')  
            .setStyle(ButtonStyle.Secondary));

      
      const embed1 = new EmbedBuilder()
      .setTitle(data.Title)
      .setDescription(`${data.Description}`)
      .setColor("Orange")
      .setTimestamp()

      if (data.Image) {
        embed1.setImage(data.Image)
      }

      if (data.Thumbnail) {
        embed1.setThumbnail(data.Thumbnail)
      }
    
      if (icon) {
        const emoji1Match = icon.match(/<:([^:]+):(\d+)>/);
        but1.setEmoji(emoji1Match[2])
      }

      const channel = await client.channels.fetch(data.ChannelID);
    
      const message = await channel.messages.fetch(messageID);
    
      message.edit({embeds: [embed1], components: [pick1]});

      const dataa = await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          RoleID1: role.id,
          Button1: button,
        }, {new: true});

    if (icon) {
        const emojiMatch = icon.match(/<:([^:]+):(\d+)>/);

      await roleSchema.findOneAndUpdate(
        {Guild: interaction.guild.id,
        MessageID: data.MessageID}, {
          Emoji1: emojiMatch[2]
        }, {new: true}); 
      }
    
      await interaction.reply({embeds: [
        new EmbedBuilder()
        .setTitle(`Reaction Role Manager`)
        .setColor("Orange")
        .setDescription(`Added button with corresponding role: <@&${dataa.RoleID1}>`)
      ], ephemeral:true})
  },
};