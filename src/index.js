const { Client, GatewayIntentBits, EmbedBuilder, PermissionsBitField, PermissionFlagsBits, Permissions, MessageManager, Embed, Collection, Partials, Events, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, ButtonStyle, ChannelType, ButtonBuilder, AuditLogEvent } = require(`discord.js`);
const fs = require('fs');
const GiveawaysManager = require("./utils/gw.js");

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildModeration, GatewayIntentBits.AutoModerationConfiguration, GatewayIntentBits.AutoModerationExecution, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildPresences], 
    partials: [Partials.Channel, Partials.Message],
    events: [Events.VoiceStateUpdate, Events.GuildMemberAdd, Events.GuildMemberRemove, Events.MessageCreate] 
}); 

client.commands = new Collection();

module.exports = client;

require('dotenv').config();

const functions = fs.readdirSync("./src/functions").filter(file => file.endsWith(".js"));
const eventFiles = fs.readdirSync("./src/events").filter(file => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./src/commands");

client.giveawayManager = new GiveawaysManager(client, {
    default: {
      botsCanWin: false,
      embedColor: "#FF0000",
      embedColorEnd: "#000000",
      reaction: "🎉",
    },
});

// Anti-Crash
const process = require(`node:process`)
process.on(`unhandledRejection`, async(reason, promise) => {
    console.log(`UnhandledRejection at:`, promise, `Reason:`, reason);
});

process.on(`uncaughtException`, (err) => {
    console.log(`UncaughtException: `, err);
});

process.on(`uncaughtExceptionMonitor`, (err, origin) => {
    console.log(`UncaughtExceptionMonitor: `, err, origin);
});

(async () => {
    for (file of functions) {
        require(`./functions/${file}`)(client);
    }
    client.handleEvents(eventFiles, "./src/events");
    client.handleCommands(commandFolders, "./src/commands");
    client.login(process.env.token)
})();



// Bot Welcome MSG
client.on('guildCreate', async guild => {
    try {
      const owner = await guild.fetchOwner();
      const avatarURL = client.user.displayAvatarURL({ format: 'png', size: 512 });
      const topChannel = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).sort((a, b) => a.rawPosition - b.rawPosition || a.id - b.id).first();
      const embed = new EmbedBuilder()
      .setTitle(`Rukiree Message`)
      .setColor(`Orange`)
      .setDescription(`Thanks for adding me to your server!\nHere is some of the following you can expect from me:`)
      .addFields({ name: `Moderation`, value: `<:ReplyContinuedIcon:1134120279346520195> Name a moderation command, we probably have that command!\n<:ReplyIcon:1134120277157089301> Moderation is taken very seriously and we want the best to protect your server!`})
      .addFields({ name: `Fun`, value: `<:ReplyIcon:1134120277157089301> We have also gone ahead and made some little games users can play! No need to thank us.`})
      .addFields({ name: `Support`, value: `<:ReplyIcon:1134120277157089301> Ever need support on our bot? Just click the button below to join our support server! We'll be looking forward to seeing you!`})
      .addFields({ name: `Important`, value: `<:ReplyIcon:1134120277157089301> Make sure that the bot has the ability to do what is needed! You don't want a bot sitting there without permission do ya?`})
      .setThumbnail(avatarURL)
      .setFooter({ text: `Thanks again! - Rukiree Dev Team`})

      const channel = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Support Server')
            .setURL('https://discord.gg/cjjqD8HqMB'),

            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Invite the Bot')
            .setURL('https://discord.com/api/oauth2/authorize?client_id=1115811892607340668&permissions=8&scope=bot'),

            new ButtonBuilder()
            .setLabel('Vote')
            .setStyle(ButtonStyle.Link)
            .setURL("https://top.gg/bot/1115811892607340668")

        );

        const dmbot = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel('Support Server')
            .setURL('https://discord.gg/cjjqD8HqMB'),

            new ButtonBuilder()
            .setLabel('Vote')
            .setStyle(ButtonStyle.Link)
            .setURL("https://top.gg/bot/1115811892607340668")
            
        );

      owner.send({ embeds: [embed], components: [dmbot] });
      topChannel.send({ embeds: [embed], components: [channel] });

    } catch (error) {
      console.error(`Unable to send message to server owner for guild ${guild.name}.`, error);
    }
});

// DM Tracker
client.on(Events.MessageCreate, async(message) => {
    if (message.author.bot) return;
    if (!message.guild) {
        let dmEmbed = new EmbedBuilder()
        .setTitle(`New DM`)
        .setColor(`Orange`)
        .addFields({name: `User:`, value: `${message.author.tag} | ID: ${message.author.id}`, inline: true}, {name: `Message:`, value: `${message.content || 'None'}`, inline: true})
        .setTimestamp()

        if (message.attachments.size > 0) {
            dmEmbed.addFields({name: `Attachments`, value: `${message.attachments.first()?.url}`, inline: false});
        }

        await client.channels.cache.get("1122645660399849502").send({embeds: [dmEmbed]});
    }
});

// Console Tracker
let consoleLogger = process.openStdin()
consoleLogger.addListener("data", res => {
    let msg = res.toString().trim().split(/ +/g)
    const RukireeGuild = client.guilds.cache.get(`1115814357226491924`)
    const RukireeChannel = RukireeGuild.channels.cache.get(`1150205379901407232`)

    RukireeChannel.send({ content: msg.join(" ")})
})

// DisTube/Music
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnFinish: true,
    emitAddSongWhenCreatingQueue: false,
    plugins: [new SpotifyPlugin()]
});

// Snipe System
client.snipes = new Map()
client.on('messageDelete', function(message, channel) {
    client.snipes.set(message.channel.id, {
        content: message.content,
        author: message.author,
        image: message.attachments.first() ? message.attachments.first().proxyURL : null
    })
})

// AFK System
const afkSchema = require(`./Schemas.js/afkSchema`);
client.on(Events.MessageCreate, async message => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const check = await afkSchema.findOne({ Guild: message.guild.id, User: message.author.id});
    if (check) {
        const nick = check.Nickname;
        await afkSchema.deleteMany({ Guild: message.guild.id, User: message.author.id});

        await message.member.setNickname(`${nick}`).catch(err => {
            return;
        })

        const m1 = await message.reply({ content: `Welcome back, ${message.author}. Your AFK status has been removed.`, ephemeral: true});
        setTimeout(() => {
            m1.delete();
        }, 4000)
    } else {
        const members = message.mentions.users.first();
        if (!members) return;
        const Data = await afkSchema.findOne({ Guild: message.guild.id, User: members.id});
        if (!Data) return;

        const member = message.guild.members.cache.get(members.id);
        const msg = Data.Message || `No Reason Given.`;

        if (message.content.includes(members)) {
            const m = await message.reply({ content: `${member.user.tag} is currently AFK, don't mention them at this time. | Reason: ${msg}`});
            setTimeout(() => {
                m.delete();
                message.delete();
            },4000)
        }
    }
})

// EcoModal
// const ecoSchema = require(`./Schemas.js/ecoSchema.js`);

// Modal Aftermath
client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isModalSubmit()) return;

    if (interaction.isModalSubmit()) {
        if (interaction.customId === `bugreport`) {
            const command = interaction.fields.getTextInputValue(`command`);
            const description = interaction.fields.getTextInputValue(`description`);
            const id = interaction.user.id;
            const member = interaction.member;
            const server = interaction.guild.id || `No server provided`;
    
            const channel = await client.channels.cache.get(`1128097136203022457`);
    
            const embed = new EmbedBuilder()
            .setColor(`Orange`)
            .setTitle(`New Report Issued`)
            .addFields({ name: `User:`, value: `⤷ ${member}`})
            .addFields({ name: `ID:`, value: `⤷ ${id}`})
            .addFields({ name: `Server ID:`, value: `⤷ ${server}`})
            .addFields({ name: `Command Reported:`, value: `⤷ ${command}`})
            .addFields({ name: `Description of Report:`, value: `⤷ ${description}`})
            .setTimestamp()
            .setFooter({ text: `Report Bug System`})
    
            await channel.send({ embeds: [embed]}).catch(err => {});
            await interaction.reply({ content: `<:Checkmark:1125943017434525776> Your report has been sent to the developers. Thanks for reporting!`, ephemeral: true})
        };

    }
})

// Member VC
const voiceschema = require(`./Schemas.js/membervcSchema`)
client.on(Events.GuildMemberAdd, async (member, err) => {
 
    if (member.guild === null) return;
    const voicedata = await voiceschema.findOne({ Guild: member.guild.id });
 
    if (!voicedata) return;
    else {
 
        const totalvoicechannel = member.guild.channels.cache.get(voicedata.TotalChannel);
        if (!totalvoicechannel || totalvoicechannel === null) return;
        const totalmembers = member.guild.memberCount;
 
        totalvoicechannel.setName(`• Total Members: ${totalmembers}`).catch(err);
 
    }
})
 
client.on(Events.GuildMemberRemove, async (member, err) => {
 
    if (member.guild === null) return;
    const voicedata1 = await voiceschema.findOne({ Guild: member.guild.id });
 
    if (!voicedata1) return;
    else {
 
        const totalvoicechannel1 = member.guild.channels.cache.get(voicedata1.TotalChannel);
        if (!totalvoicechannel1 || totalvoicechannel1 === null) return;
        const totalmembers1 = member.guild.memberCount;
 
        totalvoicechannel1.setName(`• Total Members: ${totalmembers1}`).catch(err);
 
    }
})

// Bot Info VC
client.on(Events.GuildCreate, async (guild, err) => {
    const servervc = client.guilds.cache.get(`1115814357226491924`).channels.cache.get(`1127663877056905226`);
    const servercount = client.guilds.cache.size

    const uservc = client.guilds.cache.get(`1115814357226491924`).channels.cache.get(`1127664034171330681`);
    const usercount = await client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);


    uservc.setName(`• Total Users: ${usercount}`).catch(err);
    servervc.setName(`• Servers: ${servercount}`).catch(err);
    
    const rukireeGuild = client.guilds.cache.get(`1115814357226491924`)
    const rukireeChannel = rukireeGuild.channels.cache.get(`1150205379901407232`)
    await rukireeChannel.send({ content: `**New Guild - ${guild}`})
    console.log(`**New Guild - ${guild}**`)
})

client.on(Events.GuildDelete, async (guild, err) => {
    const servervc1 = client.guilds.cache.get(`1115814357226491924`).channels.cache.get(`1127663877056905226`);
    const servercount1 = client.guilds.cache.size

    const uservc = client.guilds.cache.get(`1115814357226491924`).channels.cache.get(`1127664034171330681`);
    const usercount = await client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);


    uservc.setName(`• Total Users: ${usercount}`).catch(err);
    servervc1.setName(`• Servers: ${servercount1}`).catch(err);

    const rukireeGuild = client.guilds.cache.get(`1115814357226491924`)
    const rukireeChannel = rukireeGuild.channels.cache.get(`1150205379901407232`)
    await rukireeChannel.send({ content: `**Guild Deleted - ${guild}`})
    console.log(`**Guild Deleted - ${guild}**`)
})

client.on(Events.GuildMemberAdd, async (member, err) => {
    const uservc = client.guilds.cache.get(`1115814357226491924`).channels.cache.get(`1127664034171330681`);
    const usercount = await client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

    uservc.setName(`• Total Users: ${usercount}`).catch(err);

    const rukireeGuild = client.guilds.cache.get(`1115814357226491924`)
    const rukireeChannel = rukireeGuild.channels.cache.get(`1150205379901407232`)
    await rukireeChannel.send({ content: `**New User - ${member.user.username}, ID: ${member.id}**`})
    console.log(`**New User - ${member.user.username}, ID: ${member.id}**`)
})

client.on(Events.GuildMemberRemove, async (member, err) => {
    const uservc1 = client.guilds.cache.get(`1115814357226491924`).channels.cache.get(`1127664034171330681`)
    const usercount1 = await client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);

    uservc1.setName(`• Total Users: ${usercount1}`).catch(err);

    const rukireeGuild = client.guilds.cache.get(`1115814357226491924`)
    const rukireeChannel = rukireeGuild.channels.cache.get(`1150205379901407232`)
    await rukireeChannel.send({ content: `**User left a server containing Rukiree - ${member.user.username}, ID: ${member.id}**`})
    console.log(`**User left a server containing Rukiree - ${member.user.username}, ID: ${member.id}**`)
})

// Welcome Message w/ Autorole
const welcomeSchema = require(`./Schemas.js/welcomeSchema`);
const roleSchema = require(`./Schemas.js/autorole`)
client.on(Events.GuildMemberAdd, async member => {
    const data = await welcomeSchema.findOne({ Guild: member.guild.id});

    if (!data) return;
    else {
        const channel = await member.guild.channels.cache.get(data.Channel);
        const roledata = await roleSchema.findOne({ Guild: member.guild.id });
 
        if (roledata) {
            const giverole = await member.guild.roles.cache.get(roledata.Role)
 
            member.roles.add(giverole).catch(err => {
                console.log('Error received trying to give an auto role!');
            })
        }

        const avatarURL = member.displayAvatarURL({ format: 'png', size: 512 });

        const embed = new EmbedBuilder()
        .setTitle(`<a:Wave:1128457020765376662> New Member!`)
        .setColor(`Orange`)
        .setDescription(`${data.Message.replace('{member}', member).replace('(member)', member.user.username)}`)
        .setThumbnail(avatarURL)
        .setTimestamp()

        const msg = await channel.send({ embeds: [embed] })
        try {
            await msg.react(data.Reaction);
        } catch (e) {
            return;
        }
    }
})

// Leave Message
const leaveSchema = require(`./Schemas.js/leaveSchema`);
client.on(Events.GuildMemberRemove, async member => {
    const data = await leaveSchema.findOne({ Guild: member.guild.id});

    if (!data) return;
    else {
        const channel = await member.guild.channels.cache.get(data.Channel);

        const avatarURL = member.displayAvatarURL({ format: 'png', size: 512 });

        const embed = new EmbedBuilder()
        .setTitle(`<a:Wave:1128457020765376662> Member left...`)
        .setColor(`Orange`)
        .setDescription(`${data.Message.replace('{member}', member).replace('(member)', member.user.username)}`)
        .setThumbnail(avatarURL)
        .setTimestamp()
        .setFooter({ text: `See you later!`})

        const msg = await channel.send({ embeds: [embed] })
        try {
            await msg.react(data.Reaction);
        } catch (e) {
            return;
        }
    }
})

// Autopublish
const autopublishSchema = require(`./Schemas.js/autopublish`)
client.on(Events.MessageCreate, async message => {
    if (message.channel.type !== ChannelType.GuildAnnouncement) return;
    if (message.author.bot) return;
    if (message.content.startsWith(`.`)) return;
    else {
        const data = await autopublishSchema.findOne({ Guild: message.guild.id});

        if (!data) return;
        if (!data.Channel.includes(message.channel.id)) return;

        try {
            message.crosspost();
        } catch (e) {
            return;
        }
    }
})

// Leveling System
const levelSchema = require(`./Schemas.js/level`);
const levelGuildSchema = require(`./Schemas.js/levelGuildSchema`)
const levelRoleSchema = require(`./Schemas.js/levelRolesSchema`);
client.on(Events.MessageCreate, async (message) => {
    const {guild, author} = message;


    if (!guild || author.bot) return;
    const data = await levelSchema.findOne({ Guild: guild.id, User: author.id});
    const data2 = await levelGuildSchema.findOne({Guild: guild.id})
    const data3 = await levelRoleSchema.findOne({ GuildID: guild.id })

    if (data2) {
        if (!data) {
            levelSchema.create({
                Guild: guild.id,
                User: author.id,
                XP: 0,
                Level: 0,
            })
        };
    };

    if (!data2) return;

    const channel = data2.AnnouncementChannelId || message.channel;

    const give = 1;

    if (!data) return;

    const requiredXP = data.Level * data.Level * 20 + 20;

    if (data.XP + give >= requiredXP) {
        data.XP += give;
        data.Level += 1;

        await data.save();

        if (!channel) return;

        const embed = new EmbedBuilder()
        .setTitle(`Leveling Manager`)
        .setColor(`Orange`)
        .setDescription(`${author}, you have reached level: ${data.Level}!`)
    
        if (data3) {
            for (const item of data3.LevelRoleData) {
                const level = item.level;
                const roleId = item.roleId;
                if (!message.member.roles.cache.has(roleId) && data.Level > level) {
                    message.member.roles.add(roleId)
                }
                if (data.Level === level) {
                    const role = guild.roles.cache.get(roleId)
                    message.member.roles.add(role).catch(err => {})
                    embed.setDescription(`${author}, you have reached level: ${data.Level} and got: <@&${roleId}>!`)
                }
            }
        }

        client.channels.cache.get(channel).send({ embeds: [embed]});
    } else {
        data.XP += give;
        data.save();
    }
})

// Join to Create System
const joinSchema = require(`./Schemas.js/jointocreateSchema`);
const joinCHNLSchema = require(`./Schemas.js/jointocreateCHANNELSSchema`);
client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    try {
        if (newState.member.guild === null) return;
    } catch (err) {
        return;
    }

    const joindata = await joinSchema.findOne({ Guild: newState.guild.id});
    const joinCHNLData = await joinCHNLSchema.findOne({ Guild: newState.member.guild.id, User: newState.member.id});

    const vc = newState.channel;

    if (!joindata) return;

    if (!vc) return;
    else {
        if (vc.id === joindata.Channel) {
            if (joinCHNLData) {
                try {
                    return await newState.member.send({ content: `<:Denied:1125943015878443089> You already have a voice channel open in: ${newState.member.guild}`, ephemeral: true})
                } catch (err) {
                    return;
                }
            } else {
                try {
                    const channel = await newState.member.guild.channels.create({
                        type: ChannelType.GuildVoice,
                        name: `${newState.member.user.username}'s Voice`,
                        userLimit: joindata.VoiceLimit,
                        parent: joindata.Category
                    })
    
                    try {
                        await newState.member.voice.setChannel(channel.id);
                    } catch (err) {
                        return;
                    }
    
                    setTimeout(() => {
                        joinCHNLSchema.create({
                            Guild: newState.member.guild.id,
                            Channel: channel.id,
                            User: newState.member.id
                        })
                    }, 500)
                } catch (err) {
                    try {
                        await newState.member.send({ contnet: `<:Warning:1125948329101103114> Could not create your channel. It's possible that I'm missing some permissions.`})
                    } catch (err) {
                        return;
                    }
    
                    return;
                }
    
                try {
                    const embed = new EmbedBuilder()
                    .setColor(`Orange`)
                    .setTitle(`Join to Create VC Manager`)
                    .setDescription(`Channel Created\n\n <:Checkmark:1125943017434525776> Your voice channel has been created in **${newState.member.guild.name}**`)
                    .setTimestamp()
    
                    await newState.member.send({ embeds: [embed]});
                } catch (err) {
                    return;
                }
            }
        } 
    
    }
})

client.on(Events.VoiceStateUpdate, async (oldState, newState) => {
    try {
        if (oldState.member.guild === null) return;
    } catch (err) {
        return;
    }

    const leaveCHNLData = await joinCHNLSchema.findOne({ Guild: oldState.member.guild.id, User: oldState.member.id});
    if (!leaveCHNLData) return;
    else {
        const vc = await oldState.member.guild.channels.cache.get(leaveCHNLData.Channel);

        if (newState.channel === vc) return;

        try {
            await vc.delete();
        } catch (err) {
            return;
        }

        await joinCHNLSchema.deleteMany({ Guild: oldState.guild.id, User: oldState.member.id});
        try {
            const embed = new EmbedBuilder()
            .setColor(`Orange`)
            .setTitle(`Join to Create VC Manager`)
            .setDescription(`Channel Deleted\n\n <:Checkmark:1125943017434525776> Your voice channel has been deleted in **${newState.member.guild.name}**`)
            .setTimestamp()

            await newState.member.send({ embeds: [embed]});
        } catch (err) {
            return;
        }
    }
})

// ModLogs
const Audit_Log = require("./Schemas.js/modLogSchema.js");

client.on(Events.GuildBanAdd, async (guild, user) => {  
    const data = await Audit_Log.findOne({
        Guild: guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const banInfo = await guild.fetchBan(user);
    if (!banInfo) return;
  
    const { reason, executor } = banInfo;
    const auditEmbed = new EmbedBuilder().setColor("Orange").setTimestamp().setFooter({ text: "Rukiree Audit Log System"})
 
    const auditChannel = client.channels.cache.get(logID);
 
    auditEmbed.setTitle("Ban Added").addFields(
        {name: "Banned Member:", value: user.tag, inline: false},
        {name: "Executor:", value: executor.tag, inline: false},
        {name: "Reason:", reason}
    )
 
    await auditChannel.send({ embeds: [auditEmbed]});
});

client.on(Events.GuildBanRemove, async (user) => {
    const data = await Audit_Log.findOne({
        Guild: user.guild.id
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditEmbed = new EmbedBuilder().setColor("Orange").setTimestamp().setFooter({ text: "Rukiree Audit Log System"})
 
    const auditChannel = client.channels.cache.get(logID);
 
    auditEmbed.setTitle("Ban Removed").addFields(
        {name: "Member:", value: `${user}`}
    )
    await auditChannel.send({ embeds: [auditEmbed]});
});

client.on(Events.ChannelCreate, async (channel) => {
    const data = await Audit_Log.findOne({
        Guild: channel.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);

    const embed = new EmbedBuilder()
        .setColor('Orange')
        .setTitle('Channel Created')
        .setDescription(`Channel: <#${channel.id}> (${channel.id})\nType: ${channel.type}`)
        .setTimestamp()
        .setFooter({ text: "Rukiree Audit Log System"});

    await auditChannel.send({ embeds: [embed] });
});
 
client.on(Events.ChannelDelete, async (channel) => {
    const data = await Audit_Log.findOne({
        Guild: channel.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);

    const embed = new EmbedBuilder()
        .setColor('Orange')
        .setTitle('Channel Deleted')
        .setDescription(`Channel: ${channel.name} (${channel.id})\nType: ${channel.type}`)
        .setTimestamp()
        .setFooter({ text: "Rukiree Audit Log System"});

    await auditChannel.send({ embeds: [embed] });
});
 
client.on(Events.ChannelUpdate, async (oldChannel, newChannel) => {
    const data = await Audit_Log.findOne({
        Guild: newChannel.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);

    const changes = [];
    if (oldChannel.name !== newChannel.name) {
        changes.push(`Name: ${oldChannel.name} to ${newChannel.name}`);
    }
    if (oldChannel.topic !== newChannel.topic) {
        changes.push(`Topic: ${oldChannel.topic || 'None'} to ${newChannel.topic || 'None'}`);
    }


    if (changes.length === 0) return; 

    const embed = new EmbedBuilder()
        .setColor('Orange')
        .setTitle('Channel Updated')
        .setDescription(`Channel: ${newChannel} (${newChannel.id})\nChanges:\n${changes.join('\n')}`)
        .setTimestamp()
        .setFooter({ text: "Rukiree Audit Log System"});

    await auditChannel.send({ content: ``, embeds: [embed] });
});

client.on(Events.GuildRoleCreate, async (role) => {
    
    const data = await Audit_Log.findOne({
        Guild: role.guild.id
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditEmbed = new EmbedBuilder().setColor("Orange").setTimestamp().setFooter({ text: "Rukiree Audit Log System"})
 
    const auditChannel = client.channels.cache.get(logID);
 
    auditEmbed.setTitle("Role Created").addFields(
        {name: "Role Name:", value: `<@&${role.id}>`, inline: false},
        {name: "Role ID:", value: role.id, inline: false}
    )
    await auditChannel.send({ embeds: [auditEmbed]});
});

client.on(Events.GuildRoleDelete, async (role) => {
    const auditEmbed = new EmbedBuilder().setColor("Orange").setTimestamp().setFooter({ text: "Rukiree Audit Log System"})
    
    const data = await Audit_Log.findOne({
        Guild: role.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);
 
    auditEmbed.setTitle("Role Removed").addFields(
        {name: "Role Name:", value: `<@&${role.id}>`, inline: false},
        {name: "Role ID:", value: role.id, inline: false}
    )
    await auditChannel.send({ embeds: [auditEmbed]});
});

client.on(Events.GuildRoleUpdate, async (oldRole, newRole) => {
    const data = await Audit_Log.findOne({
        Guild: newRole.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);
 
    const changes = [];
 
    if (oldRole.name !== newRole.name) {
      changes.push(`Name: ${oldRole.name} to ${newRole.name}`);
    }
 
    if (oldRole.color !== newRole.color) {
      changes.push(`Color: ${oldRole.color} to ${newRole.color}`);
    }
 
    if (oldRole.permissions.bitfield !== newRole.permissions.bitfield) {
      changes.push(`Permissions: ${oldRole.permissions.toArray()} to ${newRole.permissions.toArray()}`);
    }
 
    if (oldRole.mentionable !== newRole.mentionable) {
      changes.push(`Mentionable: ${oldRole.mentionable} to ${newRole.mentionable}`);
    }
 
    if (oldRole.hoist !== newRole.hoist) {
      changes.push(`Display Separately: ${oldRole.hoist} to ${newRole.hoist}`);
    }
 
    if (changes.length === 0) {
      return; 
    }
 
    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle('Role Updated')
      .setDescription(`Role: <@&${newRole.id}> (${newRole.id})\nChanges:\n${changes.join('\n')}`)
      .setTimestamp()
      .setFooter({ text: "Rukiree Audit Log System"});
 
    await auditChannel.send({ embeds: [embed] });
});

client.on(Events.AutoModerationRuleCreate, async (autoModerationRule) => {
    
    const data = await Audit_Log.findOne({
        Guild: autoModerationRule.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    
    const auditEmbed = new EmbedBuilder().setColor("Orange").setTimestamp().setFooter({ text: "Rukiree Audit Log System"})
 
    const auditChannel = client.channels.cache.get(logID);
 
    auditEmbed.setTitle("Automod Rule Created").addFields(
        {name: "Rulecreator:", value: `<@${autoModerationRule.creatorId}>`, inline: false},
        {name: "Rulename:", value: autoModerationRule.name},
        {name: "Actions:", value: `${autoModerationRule.actions}`, inline: false},
    )
    await auditChannel.send({ embeds: [auditEmbed]});
});

client.on(Events.AutoModerationRuleDelete, async (autoModerationRule) => {
    
    const data = await Audit_Log.findOne({
        Guild: autoModerationRule.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    
    const auditEmbed = new EmbedBuilder().setColor("Orange").setTimestamp().setFooter({ text: "Rukiree Audit Log System"})
 
    const auditChannel = client.channels.cache.get(logID);
 
    auditEmbed.setTitle("Automod Rule Created").addFields(
        {name: "Rulecreator:", value: `<@${autoModerationRule.creatorId}>`, inline: false},
        {name: "Rulename:", value: autoModerationRule.name},
        {name: "Actions:", value: `${autoModerationRule.actions}`, inline: false},
    )
    await auditChannel.send({ embeds: [auditEmbed]});
});

client.on(Events.AutoModerationRuleUpdate, async (newAutoModerationRule, oldAutoModerationRule) => {
    
    const data = await Audit_Log.findOne({
        Guild: newAutoModerationRule.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    
    const auditEmbed = new EmbedBuilder().setColor("Orange").setTimestamp().setFooter({ text: "Rukiree Audit Log System"})
 
    const auditChannel = client.channels.cache.get(logID);
 
    auditEmbed.setTitle("Automod Rule Updated").addFields(
        {name: "Old Rulename:", value: `${oldAutoModerationRule.name}`, inline: false},
        {name: "Old Actions:", value: `${oldAutoModerationRule.actions}`, inline: false},
        {name: "New Rulename:", value: newAutoModerationRule.name, inline: false},
        {name: "New Actions:", value: newAutoModerationRule.actions}
    )
    await auditChannel.send({ embeds: [auditEmbed]});
});

client.on(Events.ThreadCreate, async (thread) => {
    
    const data = await Audit_Log.findOne({
        Guild: thread.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditEmbed = new EmbedBuilder().setColor("Orange").setTimestamp().setFooter({ text: "Rukiree Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);
 
    auditEmbed.setTitle("Thread Created").addFields(
        {name: "Name:", value: thread.name, inline: false},
        {name: "Tag:", value: `<#${thread.id}>`, inline: false},
        {name: "ID:", value: thread.id, inline: false},
    )
    await auditChannel.send({ embeds: [auditEmbed]});
});

client.on(Events.ThreadDelete, async (thread) => {
    
    const data = await Audit_Log.findOne({
        Guild: thread.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditEmbed = new EmbedBuilder().setColor("Orange").setTimestamp().setFooter({ text: "Rukiree Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);
 
    auditEmbed.setTitle("Thread Deleted").addFields(
        {name: "Name:", value: thread.name, inline: false},
        {name: "Tag:", value: `<#${thread.id}>`, inline: false},
        {name: "ID:", value: thread.id, inline: false},
    )
    await auditChannel.send({ embeds: [auditEmbed]});
});

client.on(Events.GuildEmojiCreate, async (emoji) => {
    const data = await Audit_Log.findOne({
        Guild: emoji.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);
 
    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle('Emoji Created')
      .setDescription(`Emoji: ${emoji}\nName: ${emoji.name}\nID: ${emoji.id}`)
      .setTimestamp()
      .setFooter({ text: "Rukiree Audit Log System"});
 
    await auditChannel.send({ embeds: [embed] });
});

client.on(Events.GuildEmojiDelete, async (emoji) => {
    const data = await Audit_Log.findOne({
        Guild: emoji.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);

    const embed = new EmbedBuilder()
        .setColor('Orange')
        .setTitle('Emoji Deleted')
        .setDescription(`Emoji: ${emoji.name}\nID: ${emoji.id}`)
        .setTimestamp()
        .setFooter({ text: "Rukiree Audit Log System"});

    await auditChannel.send({ embeds: [embed] });
});
  
client.on(Events.GuildEmojiUpdate, async (oldEmoji, newEmoji) => {
    const data = await Audit_Log.findOne({
        Guild: newEmoji.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);

    const embed = new EmbedBuilder()
        .setColor('Orange')
        .setTitle('Emoji Updated')
        .setDescription(`Emoji: ${newEmoji}\nOld Name: ${oldEmoji.name}\nNew Name: ${newEmoji.name}`)
        .setTimestamp()
        .setFooter({ text: "Rukiree Audit Log System"});

    await auditChannel.send({ embeds: [embed] });
});

client.on(Events.GuildStickerCreate, async (sticker) => {
    const data = await Audit_Log.findOne({
        Guild: sticker.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);
 
    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle('Sticker Created')
      .setDescription(`Sticker: ${sticker.name} (${sticker.id})`)
      .setTimestamp()
      .setFooter({ text: "Rukiree Audit Log System"});
 
    await auditChannel.send({ embeds: [embed] });
});
 
client.on(Events.GuildStickerDelete, async (sticker) => {
    const data = await Audit_Log.findOne({
        Guild: sticker.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);

    const embed = new EmbedBuilder()
        .setColor('Orange')
        .setTitle('Sticker Deleted')
        .setDescription(`Sticker: ${sticker.name} (${sticker.id})`)
        .setTimestamp()
        .setFooter({ text: "Rukiree Audit Log System"});

    await auditChannel.send({ embeds: [embed] });
});
 
client.on(Events.GuildStickerUpdate, async (oldSticker, newSticker) => {
    const logData = await Audit_Log.findOne({ Guild: newSticker.guild.id });
    if (!logData) return;

    const logChannel = newSticker.guild.channels.cache.get(logData.Channel);
    if (!logChannel) return;

    const changedProperties = [];

    if (oldSticker.name !== newSticker.name) {
        changedProperties.push(`Name: ${oldSticker.name} to ${newSticker.name}`);
    }

    if (oldSticker.description !== newSticker.description) {
        changedProperties.push(`Description: ${oldSticker.description} to ${newSticker.description}`);
    }

    if (JSON.stringify(oldSticker.tags) !== JSON.stringify(newSticker.tags)) {
        changedProperties.push('Tags');
    }

    if (changedProperties.length === 0) return;

    const embed = new EmbedBuilder()
        .setColor('Orange')
        .setTitle('Sticker Updated')
        .setDescription(`Sticker: ${newSticker.name} (${newSticker.id})\n${changedProperties.join('\n')}`)
        .setTimestamp()
        .setFooter({ text: "Rukiree Audit Log System"});

    await logChannel.send({ embeds: [embed] });
});

client.on(Events.GuildScheduledEventCreate, async (event) => {
    const data = await Audit_Log.findOne({
        Guild: event.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);

    const embed = new EmbedBuilder()
        .setColor('Orange')
        .setTitle('Scheduled Event Created')
        .setDescription(`Event Name: ${event.name}\nStarts: ${event.startsAt}`)
        .setTimestamp()
        .setFooter({ text: "Rukiree Audit Log System"});

    await auditChannel.send({ embeds: [embed] });
});
 
client.on(Events.GuildScheduledEventDelete, async (event) => {
    const data = await Audit_Log.findOne({
        Guild: event.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);

    const embed = new EmbedBuilder()
        .setColor('Orange')
        .setTitle('Scheduled Event Deleted')
        .setDescription(`Event Name: ${event.name}\nStarts: ${event.startsAt}`)
        .setTimestamp()
        .setFooter({ text: "Rukiree Audit Log System"});

    await auditChannel.send({ embeds: [embed] });
});
 
client.on(Events.GuildScheduledEventUpdate, async (oldEvent, newEvent) => {
    const data = await Audit_Log.findOne({
        Guild: newEvent.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditChannel = client.channels.cache.get(logID);

    const changes = [];

    if (oldEvent.name !== newEvent.name) {
        changes.push(`Name: ${oldEvent.name} to ${newEvent.name}`);
    }

    if (oldEvent.topic !== newEvent.topic) {
        changes.push(`Topic: ${oldEvent.topic || 'None'} to ${newEvent.topic || 'None'}`);
    }

    if (oldEvent.data !== newEvent.data) {
        changes.push(`Data: ${oldEvent.data} to ${newEvent.data}`);
    }

    if (oldEvent.start !== newEvent.start) {
        changes.push(`Start: ${oldEvent.start} to ${newEvent.start}`);
    }

    if (newEvent.canceled) {
        changes.push("Event Canceled");
    }

    if (changes.length === 0) return; 

    const embed = new EmbedBuilder()
        .setColor('Orange')
        .setTitle('Scheduled Event Updated')
        .setDescription(`Event Name: ${newEvent.name}\nChanges:\n${changes.join('\n')}`)
        .setTimestamp()
        .setFooter({ text: "Rukiree Audit Log System"});

    await auditChannel.send({ embeds: [embed] });
});

client.on(Events.InviteCreate, async (invite) => {
    const data = await Audit_Log.findOne({
        Guild: invite.guild.id,
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditEmbed = new EmbedBuilder().setColor("Orange").setTimestamp().setFooter({ text: "Rukiree Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);

    auditEmbed.setTitle("Invite Created").addFields(
        {name: "User:", value: `<@${invite.inviterId}>`, inline: false},
        {name: "Invite Code:", value: `${invite.code}`, inline: false},
        {name: "Expires at:", value: `${invite.expiresAt}`, inline: false},
        {name: "Created at:", value: `${invite.createdAt}`, inline: false},
        {name: "Channel:", value: `<#${invite.channelId}>`, inline: false},
        {name: "Max Uses:", value: `${invite.maxUses}`, inline: false},
        {name: "URL", value: `${invite.url}`}
    )
    await auditChannel.send({ embeds: [auditEmbed]}).catch(err => {
        return;
    });
});

client.on(Events.InviteDelete, async (invite) => {
  
    const data = await Audit_Log.findOne({
        Guild: invite.guild.id 
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }
    const auditEmbed = new EmbedBuilder().setColor("Orange").setTimestamp().setFooter({ text: "Rukiree Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);
   
    auditEmbed.setTitle("Invite Deleted").addFields(
        {name: "User:", value: `<@${invite.user.id}>`, inline: false},
        {name: "Invite Code:", value: `${invite.code}`, inline: false},
        {name: "Expires at:", value: `${invite.expiresAt}`, inline: false},
        {name: "Created at:", value: `${invite.createdAt}`, inline: false},
        {name: "Channel:", value: `<#${invite.channelId}>`, inline: false},
        {name: "Max Uses:", value: `${invite.maxUses}`, inline: false},
        {name: "URL", value: `${invite.url}`}
    )
    await auditChannel.send({ embeds: [auditEmbed]}).catch((err) => {return;});
});

client.on(Events.GuildUpdate, async (oldGuild, newGuild) => {
    //Old Stuff
    const oldName = oldGuild.name;
    const oldDesc = oldGuild.description;
    const oldBanner = oldGuild.bannerURL();
    const oldIcon = oldGuild.iconURL();

    //New Stuff
    const newName = newGuild.name;
    const newDesc = newGuild.description;
    const newBanner = newGuild.bannerURL();
    const newIcon = newGuild.iconURL();


    const data = await Audit_Log.findOne({
        Guild: newGuild.id
    })
    let logID;
    if (data) {
        logID = data.Channel
    } else {
        return;
    }

    var icon;
    var name;
    var banner;
    var desc;

    if (oldIcon !== newIcon) {
        icon = {
        name: "Icon:",
        value: `Old Icon: ${oldIcon} \nNew Icon: ${newIcon}`,
        inline: false,
        }
    } else {
        icon = {
        name: "Icon:",
        value: "No icon changes have been made"
        }
    }

    if (oldName !== newName) {
        name = {
        name: "Name:",
        value: `Old name: ${oldName}\nNew Name: ${newName}`,
        inline: false
        }
    } else {
        name = {
        name: "Name:",
        value:"No name changes have been made"
        }
    }

    const auditEmbed = new EmbedBuilder().setTitle(`Server Changes`).setColor("Orange").setTimestamp().setFooter({ text: "Rukiree Audit Log System"})
    const auditChannel = client.channels.cache.get(logID);

    if (newBanner !== oldBanner) {
        auditEmbed.setImage(newBanner)

        banner = {
        name: "Banner:",
        value: `[Old Banner}(${oldBanner}) \n[New Banner](${newBanner})`,
        inline: false
        }
    } else {
        banner = {
        name: "Banner:",
        value: `No banner changes have been made`,
        inline: false
        }
    }

    if (oldDesc !== newDesc) {
        desc = {
        name: "Description:",
        value: `Old: ${oldDesc} \nNew: ${newDesc}`,
        inline: false
        }
    } else {
        desc = {
        name: "Description:",
        value: `No description changes have been made`,
        inline: false
        }
    }

    auditEmbed.addFields(
        icon,
        name,
        banner,
        desc
    )

    await auditChannel.send({
        embeds: [auditEmbed]
    })

});

// Reaction Roles Stuff
client.on(Events.InteractionCreate, async (interaction) => {

      const { customId, guild, channel, member, message } = interaction;   
      if (!interaction.isButton()) return;
      
      const roleSchema = require("./Schemas.js/rrSchema.js");
    
      const data = await roleSchema.findOne({
        Guild: guild.id,
        MessageID: message.id
      });
    
      if (customId === 'role-1') {
        if (!data) return interaction.reply({content: `There was an error obtaining data.`});
        
        const role = guild.roles.cache.get(data.RoleID1);
        
        if (role && member.roles.cache.has(data.RoleID1)) {
          await member.roles.remove(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Removed the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else if (role) {
          await member.roles.add(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Gave the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else {
          interaction.reply(`The role no longer exists.`);
        }
      }
    
      if (customId === 'role-2') {
        if (!data) return interaction.reply({content: `There was an error obtaining data.`});
        
        const role = guild.roles.cache.get(data.RoleID2);
        
        if (role && member.roles.cache.has(data.RoleID2)) {
          await member.roles.remove(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Removed the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else if (role) {
          await member.roles.add(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Gave the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else {
          interaction.reply(`The role no longer exists.`);
        }
      }
    
      if (customId === 'role-3') {
        if (!data) return interaction.reply({content: `There was an error obtaining data.`});
        
        const role = guild.roles.cache.get(data.RoleID3);
        
        if (role && member.roles.cache.has(data.RoleID3)) {
          await member.roles.remove(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Removed the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else if (role) {
          await member.roles.add(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Gave the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else {
          interaction.reply(`The role no longer exists.`);
        }
      }
    
      if (customId === 'role-4') {
        if (!data) return interaction.reply({content: `There was an error obtaining data.`});
        
        const role = guild.roles.cache.get(data.RoleID4);
        
        if (role && member.roles.cache.has(data.RoleID4)) {
          await member.roles.remove(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Removed the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else if (role) {
          await member.roles.add(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Gave the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else {
          interaction.reply(`The role no longer exists.`);
        }
      }
    
      if (customId === 'role-5') {
        if (!data) return interaction.reply({content: `There was an error obtaining data.`});
        
        const role = guild.roles.cache.get(data.RoleID5);
        
        if (role && member.roles.cache.has(data.RoleID5)) {
          await member.roles.remove(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Removed the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else if (role) {
          await member.roles.add(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Gave the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else {
          interaction.reply(`The role no longer exists.`);
        }
      }
    
      if (customId === 'role-6') {
        if (!data) return interaction.reply({content: `There was an error obtaining data.`});
        
        const role = guild.roles.cache.get(data.RoleID6);
        
        if (role && member.roles.cache.has(data.RoleID6)) {
          await member.roles.remove(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Removed the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else if (role) {
          await member.roles.add(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Gave the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else {
          interaction.reply(`The role no longer exists.`);
        }
      }
    
      if (customId === 'role-7') {
        if (!data) return interaction.reply({content: `There was an error obtaining data.`});
        
        const role = guild.roles.cache.get(data.RoleID7);
        
        if (role && member.roles.cache.has(data.RoleID7)) {
          await member.roles.remove(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Removed the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else if (role) {
          await member.roles.add(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Gave the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else {
          interaction.reply(`The role no longer exists.`);
        }
      }
    
      if (customId === 'role-8') {
        if (!data) return interaction.reply({content: `There was an error obtaining data.`});
        
        const role = guild.roles.cache.get(data.RoleID8);
        
        if (role && member.roles.cache.has(data.RoleID8)) {
          await member.roles.remove(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Removed the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else if (role) {
          await member.roles.add(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Gave the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else {
          interaction.reply(`The role no longer exists.`);
        }
      }
    
      if (customId === 'role-9') {
        if (!data) return interaction.reply({content: `There was an error obtaining data.`});
        
        const role = guild.roles.cache.get(data.RoleID9);
        
        if (role && member.roles.cache.has(data.RoleID9)) {
          await member.roles.remove(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Removed the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else if (role) {
          await member.roles.add(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Gave the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else {
          interaction.reply(`The role no longer exists.`);
        }
      }
    
      if (customId === 'role-10') {
        if (!data) return interaction.reply({content: `There was an error obtaining data.`});
        
        const role = guild.roles.cache.get(data.RoleID10);
        
        if (role && member.roles.cache.has(data.RoleID10)) {
          await member.roles.remove(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Removed the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else if (role) {
          await member.roles.add(role);
    
          const embed1 = new EmbedBuilder()
          .setTitle(`Reaction Role Manager`)
          .setColor('Orange')
          .setDescription(`Gave the role: ${role}`);

          interaction.reply({ embeds: [embed1], ephemeral: true });
        } else {
          interaction.reply(`The role no longer exists.`);
        }
      }
    
      
});

// Auto Reaction
const autoreactSchema = require(`./Schemas.js/autoreactSchema`)
client.on(Events.MessageCreate, async (message) => {
    const autoReactData = await autoreactSchema.findOne({ Guild: message.guild.id, Channel: message.channel.id});
    if (!autoReactData) return;
    else {
        if (message.author.bot) return;
        message.react(autoReactData.Emoji).catch(async err => {
            const owner = await message.guild.members.cache.get(message.guild.ownerId);

            const embed = new EmbedBuilder()
            .setTitle(`A very important message!`)
            .setColor(`Orange`)
            .setDescription(`Hello there user, it looks like I have found an error with the auto reaction system for your server: **${message.guild.name}**, I gathered your attention here to show you what your error is: \`\`\`yml${error}\`\`\``)
            await owner.send({ embeds: [embed]})
        })
    }
});

// Bump Reminder
const brSchema = require('./Schemas.js/bumpSchema.js');
client.on(Events.MessageCreate, async (message) => {
    const user = message.author;
    if (!user.bot || user.id !== "302050872383242240") return;

    const embeds = message.embeds;
    const msgEmbeds = embeds.length
    const msgDesc = embeds[0]?.description?.toString();

    const data = await brSchema.findOne({ guild: message.guild.id });
    if (!data) return;
    
    if (msgEmbeds >= 1 && msgDesc.includes("Bump done! :thumbsup:")) {
        await message.react('<:TimerIcon:1156034558383366307>')

        let currentTime = new Date().getTime();
        let timeIn2Hours = new Date(currentTime + 2 * 60 * 60 * 1000);

        const bumpedEmbed = new EmbedBuilder()
        .setColor("Orange")
        .setTitle("Bump Reminder")
        .setDescription(`Bumped Successfully!\n\nI'll remind you to bump again <t:${Math.floor(timeIn2Hours/1000)}:R>`)

        message.channel.send({ embeds: [bumpedEmbed] })

        var hrs2 = 7200000;

        setTimeout(async () => {
            const date = new Date().getTime()
            const embed = new EmbedBuilder()
            .setColor("Orange")
            .setTitle("Bump Reminder")
            .setDescription(data.description ?? `Bump Ready!\n\nThis server has been ready to bump since: <t:${Math.floor(date/1000)}:R>`)
            message.channel.send({ content: `<@&${data.pingRole}>`, embeds: [embed] })
            .then( async (message) => {
                await message.react('<:TimerIcon:1156034558383366307>')
            })
        }, hrs2) 
    }
});