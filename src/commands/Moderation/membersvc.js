const { SlashCommandBuilder, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js');
const voiceschema = require('../../Schemas.js/membervcSchema');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('members-vc')
    .setDescription('Configure your members voice channel.')
    .addSubcommand(command => command.setName('set').setDescription('Sets your total members voice channel.').addChannelOption(option => option.setName('voice-channel').setDescription('Specified voice channel wll be your total members voice channel.').setRequired(true).addChannelTypes(ChannelType.GuildVoice)))
    .addSubcommand(command => command.setName('remove').setDescription('Removes your total members VC.')),
    async execute(interaction, err) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return await interaction.reply({ content: '<:Denied:1125943015878443089> You do not have permission to use that command.', ephemeral: true});
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
            case 'set':
 
            const voicedata = await voiceschema.findOne({ Guild: interaction.guild.id });
            const voicechannel = interaction.options.getChannel('voice-channel');
            const voicetotalchannel = await interaction.guild.channels.cache.get(voicechannel.id);
 
            if (!voicedata) {
 
                await voiceschema.create({
                    Guild: interaction.guild.id,
                    TotalChannel: voicechannel.id
                })
 
                voicetotalchannel.setName(`• Total Members: ${interaction.guild.memberCount}`).catch(err);
 
                const voiceembed = new EmbedBuilder()
                .setColor('Orange')
                .setTimestamp()
                .setTitle('<:VoiceChannelIcon:1128109774731477174> Member Voice Channel Manager')
                .setDescription(`<:Checkmark:1125943017434525776> Your Member Voice Channel was setup\nYou can view it under ${voicechannel}`)
                .setFooter({ text: `Member Voice Channel Manager`})
 
                await interaction.reply({ embeds: [voiceembed], ephemeral: true})   
 
            } else {
                await interaction.reply({ content: `<:Denied:1125943015878443089> You already have the Member Voice Channel system setup. Do /members-vc remove to disable the system.`, ephemeral: true})
            }
 
            break;
            case 'remove':
 
            const totalremovedata = await voiceschema.findOne({ Guild: interaction.guild.id });

            const voiceembed2 = new EmbedBuilder()
                .setColor('Orange')
                .setTimestamp()
                .setTitle('<:VoiceChannelIcon:1128109774731477174> Member Voice Channel Manager')
                .setDescription(`<:Checkmark:1125943017434525776> Your Member Voice Channel has been disabled`)
                .setFooter({ text: `Member Voice Channel Manager`})
 
            if (!totalremovedata) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have the Member Voice Channel system setup. Do /members-vc set to setup the system.`, ephemeral: true});
            else {
 
                const removechannel = await interaction.guild.channels.cache.get(totalremovedata.TotalChannel);
 
                if (!removechannel) {
 
                    await voiceschema.deleteMany({ Guild: interaction.guild.id });
                    await interaction.reply({ content: `<:Warning:1125948329101103114> Your Member Voice Channel VC seems to be corrupt or non-existant. It is now disabled either way.`, ephemeral: true});
 
                } else {
 
                    await removechannel.delete().catch(err => {
                        voiceschema.deleteMany({ Guild: interaction.guild.id });
                        return interaction.reply({ content: `<:Warning:1125948329101103114> Your Member Voice Channel VC couldn't be deleted. It is now disabled either way.`, ephemeral: true})
                    });
 
                    await voiceschema.deleteMany({ Guild: interaction.guild.id });
                    await interaction.reply({ embeds: [voiceembed2], ephemeral: true});
                }
 
            }
        }
 
    }
 
}