const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits, VoiceChannel, ChannelType, GuildEmoji } = require('discord.js');
const premiumSchema = require(`../../Schemas.js/premiumSchema`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName('music')
    .setDescription("A system to satisfy your music needs")
    .addSubcommand(cmd => cmd.setName('play').setDescription("Play music").addStringOption(opt => opt.setName('query').setDescription("The title/url of your song").setRequired(true)))
    .addSubcommand(cmd => cmd.setName('volume').setDescription("Adjust the volume of your song").addNumberOption(opt => opt.setName('volume').setDescription("The volume to set it to").setMinValue(1).setMaxValue(100).setRequired(true)))
    .addSubcommand(cmd => cmd.setName('skip').setDescription("Skip the current song"))
    .addSubcommand(cmd => cmd.setName('stop').setDescription("Makes the bot leave the VC"))
    .addSubcommand(cmd => cmd.setName('pause').setDescription("Pauses the queue"))
    .addSubcommand(cmd => cmd.setName('resume').setDescription("Resumes the queue"))
    .addSubcommand(cmd => cmd.setName('queue').setDescription("Shows the queue"))
    .addSubcommand(cmd => cmd.setName('shuffle').setDescription("Shuffles the queue"))
    .addSubcommand(cmd => cmd.setName('loop').setDescription("Loops the music").addStringOption(opt => opt.setName('mode').setDescription("The mode (to loop)").addChoices({name: 'Queue', value: '2' }, {name: 'Song', value: '1' }, {name: 'Disable', value: '0' } ).setRequired(true))),

    async execute (interaction, client) {
        const { options, member, guild, channel } = interaction;
        const sub = options.getSubcommand();

        const query = options.getString("query");
        const mode = options.getString('mode')
        const volume = options.getNumber("volume");
        const opt = options.getString("settings")
        const vc = member.voice.channel;
        
        const embed = new EmbedBuilder()
        .setTitle(`Music Player`);

        if (!vc) {
            embed.setColor('Orange').setDescription("<:Denied:1125943015878443089> You need to be in a VC to use music commands!")
            
            return await interaction.reply({ embeds: [embed] })
        }

        const queue = client.distube.getQueue(vc)
        
        const premiumData = await premiumSchema.findOne({ UserID: interaction.user.id})

    try{
        switch (sub) {
            case 'play':
                client.distube.play(vc, query, { textChannel: channel, member: member })
                embed.setColor(`Orange`).setDescription(`<:PlayIcon:1133941021122756658> Joining with requested music.`)
                return await interaction.reply({ embeds: [embed] });

            case 'volume':
                if (!queue) {
                    embed.setColor('Orange').setDescription("<:Denied:1125943015878443089> There is currently no music playing!")
                    return await interaction.reply({ embeds: [embed] })
                }
                client.distube.setVolume(vc, volume)

                embed.setColor(`Orange`).setDescription(`<:VoiceChannelIcon:1128109774731477174> Volume set to: **\`${volume}%\`**`)
                return await interaction.reply({ embeds: [embed] });
            
            case 'queue':
                if (!queue) {
                    embed.setColor('Orange').setDescription("<:Denied:1125943015878443089> There is currently no music playing!")
                    return await interaction.reply({ embeds: [embed] })
                }
                if (queue.songs.length === 1) {
                    embed.setColor('Orange').setDescription("<:Warning:1125948329101103114> There is only **1** song queued up right now!")
                    return await interaction.reply({ embeds: [embed] })
                } 
                embed.setColor('Orange')
                .setDescription(`${queue.songs.map(
                    (song, id) => `\n**${id + 1}.** "${song.name}" - \`${song.formattedDuration}\``
                )}`)

                return await interaction.reply({ embeds: [embed] });

            case 'skip':
                if (!queue) {
                    embed.setColor('Orange').setDescription("<:Denied:1125943015878443089> There is currently no music playing!")
                    return await interaction.reply({ embeds: [embed] })
                };

                if (queue.songs.length === 1) {
                    embed.setColor('Orange').setDescription("<:Warning:1125948329101103114> There is only **1** song queued up right now!")
                    return await interaction.reply({ embeds: [embed] })
                } 

                await queue.skip(vc)
                const nowPlayingSong = queue.songs[1]
                embed.setColor('Orange').setDescription(`<:SkipIcon:1133942486625177642> Skipped current song.\n**Now playing:** ${nowPlayingSong.name}`)
                return await interaction.reply({ embeds: [embed] });
            
            case 'stop':
                if (!queue) {
                    embed.setColor('Orange').setDescription("<:Denied:1125943015878443089> There is currently no music playing!")
                    return await interaction.reply({ embeds: [embed] })
                }
                await queue.stop(vc)
                embed.setColor('Orange').setDescription("<:StopIcon:1133941666387087470> Stopped playing music.")

                return await interaction.reply({ embeds: [embed] });

            case 'pause':
                if (!queue) {
                    embed.setColor('Orange').setDescription("<:Denied:1125943015878443089> There is currently no music playing!")
                    return await interaction.reply({ embeds: [embed] })
                }
                await queue.pause(vc)
                embed.setColor('Orange').setDescription("<:PauseIcon:1133941088764305538> Paused the music.")
                
                return await interaction.reply({ embeds: [embed] });
            
            case 'resume':
                if (!queue) {
                    embed.setColor('Orange').setDescription("<:Denied:1125943015878443089> There is currently no music playing!")
                    return await interaction.reply({ embeds: [embed] })
                }
                await queue.resume(vc)
                embed.setColor('Orange').setDescription("<:PlayIcon:1133941021122756658> Resumed the music.")
                    return await interaction.reply({ embeds: [embed] });
                    
            case 'pause':
                if (!queue) {
                    embed.setColor('Orange').setDescription("<:Denied:1125943015878443089> There is currently no music playing!")
                    return await interaction.reply({ embeds: [embed] })
                }
                if (queue.paused) {
                    embed.setColor('Orange').setDescription('<:PauseIcon:1133941088764305538> The queue is already paused!')
                    return await interaction.reply({ embeds: [embed] })
                }
                await queue.pause(vc)
                embed.setColor('Orange').setDescription(`${queue.songs.map(
                    (song, id) => `\n**${id + 1}.** "${song.name}" - \`${song.formattedDuration}\``
                )}`)
                return await interaction.reply({ embeds: [embed] });

            case 'shuffle':

                const premiumEmbed2 = new EmbedBuilder()
                .setColor(`Orange`)
                .setDescription(`<:Denied:1125943015878443089> This is a premium only command! Subscribe to our patreon to get access to this command and many others!`)
                .setThumbnail(`https://media.discordapp.net/attachments/1115814358803546175/1117459335241531503/RukireePremium.png?width=676&height=676`)
                if (!premiumData) return await interaction.reply({ embeds: [premiumEmbed2], ephemeral: true})

                if (!queue) {
                    embed.setColor('Orange').setDescription("<:Denied:1125943015878443089> There is currently no music playing!")
                    return await interaction.reply({ embeds: [embed] })
                }
                await queue.shuffle(vc);
                embed.setColor('Orange').setDescription('<:ShuffleIcon:1133942801176985714> Shuffled the queue.')
                return await interaction.reply({ embeds: [embed] });

            case 'loop':

                const premiumEmbed3 = new EmbedBuilder()
                .setColor(`Orange`)
                .setDescription(`<:Denied:1125943015878443089> This is a premium only command! Subscribe to our patreon to get access to this command and many others!`)
                .setThumbnail(`https://media.discordapp.net/attachments/1115814358803546175/1117459335241531503/RukireePremium.png?width=676&height=676`)
                if (!premiumData) return await interaction.reply({ embeds: [premiumEmbed3], ephemeral: true})

                if (!queue) {
                    embed.setColor('Orange').setDescription("<:Denied:1125943015878443089> There is currently no music playing!")
                    return await interaction.reply({ embeds: [embed] })
                }
                let modeToSet;
                if (mode === '0') {
                    modeToSet = 0;
                    embed.setColor('Orange').setDescription('<:Denied:1125943015878443089> Disabled looping')
                } else if (mode === '1') {
                    modeToSet = 1;
                    embed.setColor('Orange').setDescription('<:LoopIcon:1133946058976808960> Enabled song looping')
                } else if (mode === '2') {
                    modeToSet = 2;
                    embed.setColor('Orange').setDescription('<:LoopIcon:1133946058976808960> Enabled queue looping')
                }
                await queue.setRepeatMode(modeToSet)
                return await interaction.reply({ embeds: [embed] });
        }
    } catch (err) {
        console.log(err)
    }
}   
}