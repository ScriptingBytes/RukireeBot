const {
  EmbedBuilder,
} = require("discord.js");

const boosterSchema = require('../Schemas.js/boosterSchema');

module.exports = {
  name: "guildMemberUpdate",
  async execute(oldMember, newMember, client,) {
    
    const boosterdata = await boosterSchema.findOne({ Guild: newMember.guild.id }) 

    if (!boosterdata) return;

    const boostAnnounceChannel = newMember.guild.channels.cache.get(boosterdata.Channel1);

    const boostAnnouceLogChannel = newMember.guild.channels.cache.get(boosterdata.Channel2);

    const format = {
      0: "No Level",
      1: "Level 1",
      2: "Level 2",
      3: "Level 3",
    };

    const boostLevel = format[newMember.guild.premiumTier];

    const boostemoji = `<a:BoostRoles:1125904375878008902>`

    if (!oldMember.roles.cache.size !== newMember.roles.cache.size) {
      if (
        !oldMember.roles.cache.has(
          newMember.guild.roles.premiumSubscriberRole.id
        ) &&
        newMember.roles.cache.has(
          newMember.guild.roles.premiumSubscriberRole.id
        )
      ) {
        const boostAnnounceEmbed = new EmbedBuilder()
          .setAuthor({
            name: `🎉 New Boost! 🎉`,
            iconURL: newMember.guild.iconURL({ size: 1024 }),
          })
          .setDescription(
            `> <@${newMember.user.id}>, Thank you for boosting ${newMember.guild.name}.\n\n> Enjoy your ${newMember.guild.roles.premiumSubscriberRole} role and other Exclusive Perks!`
          )
          .addFields({
            name: `> ${boostemoji} Total Boost:`,
            value: `${newMember.guild.premiumSubscriptionCount} Boost | ${boostLevel}`,
            inline: false,
          })
          .setImage(
            "https://media.discordapp.net/attachments/1115814358803546175/1117251799510958110/boostbanner.png"
          )
          .setColor("F47FFF")
          .setFooter({
            text: `${newMember.guild.name} Boost Detection System`,
            iconURL: newMember.user.displayAvatarURL({ size: 1024 }),
          })
          .setTimestamp();
        
        const msg = await boostAnnounceChannel.send({
          content: `${newMember} \`<@${newMember.user.id}>\``,
          embeds: [boostAnnounceEmbed]
        });
        msg.react(`${boostemoji}`);

        //Boost Announce Log System
        const boostLogEmbed = new EmbedBuilder()
            .setColor(`Orange`)
            .setTitle(`Boost Detection System - New Boost`)
            .addFields(
            {
              name: `${boostemoji} Nitro Booster`,
              value: `${newMember.user} | ${newMember.user.tag}`,
            },
            {
              name: "🎉 Server Boost at:",
              value: `<t:${Math.round(
                newMember.premiumSinceTimestamp / 1000
              )}:f> | <t:${Math.round(
                newMember.premiumSinceTimestamp / 1000
              )}:R>`,
              inline: true,
            },
            {
              name: "⏰ Account Created at:",
              value: `<t:${Math.round(
                newMember.user.createdTimestamp / 1000
              )}:f> | <t:${Math.round(
                newMember.user.createdTimestamp / 1000
              )}:R>`,
              inline: true,
            },
            {
              name: "📆 Joined Server at:",
              value: `<t:${Math.round(
                newMember.joinedTimestamp / 1000
              )}:f> | <t:${Math.round(newMember.joinedTimestamp / 1000)}:R>`,
              inline: true,
            },
            {
              name: `${boostemoji} Total Boost`,
              value: `${newMember.guild.premiumSubscriptionCount} Boost | ${boostLevel}`,
              inline: false,
            },
            {
              name: "✅ Assigned Role:",
              value: `${newMember.guild.roles.premiumSubscriberRole} | ${newMember.guild.roles.premiumSubscriberRole.name} | ${newMember.guild.roles.premiumSubscriberRole.id}`,
              inline: false,
            }
          )
          .setThumbnail(newMember.user.displayAvatarURL({ size: 1024 }))
          .setFooter({
            text: `User ID: ${newMember.user.id}`,
            iconURL: newMember.guild.iconURL({ size: 1024 }),
          })
          .setTimestamp();
        await boostAnnouceLogChannel.send({embeds: [boostLogEmbed]});
    }

    
    if (
      oldMember.roles.cache.has(
        oldMember.guild.roles.premiumSubscriberRole.id
      ) &&
      !newMember.roles.cache.has(oldMember.guild.roles.premiumSubscriberRole.id)
    ) {
      const unboostEmbedLog = new EmbedBuilder()
      .setColor(`Orange`)
      .setTitle(`Boost Detection System - Unboost / Expired Boost`)
        .addFields(
          {
            name: "📌 Unbooster:",
            value: `${oldMember.user} | ${oldMember.user.tag}`,
          },
          {
            name: "⏰ Account Created at:",
            value: `<t:${Math.round(
              oldMember.user.createdTimestamp / 1000
            )}:f> | <t:${Math.round(
              oldMember.user.createdTimestamp / 1000
            )}:R>`,
            inline: true,
          },
          {
            name: "📆 Joined Server at:",
            value: `<t:${Math.round(
              oldMember.joinedTimestamp / 1000
            )}:f> | <t:${Math.round(oldMember.joinedTimestamp / 1000)}:R>`,
            inline: true,
          },

          {
            name: "<a:BoostRoles:1125904375878008902> Total Boost:",
            value: `${oldMember.guild.premiumSubscriptionCount} Boost | ${boostLevel}`,
            inline: false,
          },

          {
            name: "❌ Removed Role:",
            value: `${oldMember.guild.roles.premiumSubscriberRole} | ${oldMember.guild.roles.premiumSubscriberRole.name} | ${oldMember.guild.roles.premiumSubscriberRole.id}`,
            inline: false,
          }
        )
        .setThumbnail(oldMember.user.displayAvatarURL({ size: 1024 }))
        .setFooter({
          text: `ID: ${oldMember.user.id}`,
          iconURL: oldMember.guild.iconURL({ size: 1024 }),
        })
        .setTimestamp();
      await boostAnnouceLogChannel.send({embeds: [unboostEmbedLog]});
    }
 
    }
  },
};