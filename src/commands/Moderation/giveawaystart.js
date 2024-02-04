const { SlashCommandBuilder } = require(`@discordjs/builders`);
const { PermissionsBitField } = require('discord.js')
const { mongoose } = require(`mongoose`)

module.exports = {
    data:new SlashCommandBuilder()
    .setName(`gwstart`)
    .setDescription(`Starts A Giveaway`)
    .addStringOption(option => option.setName('duration').setDescription('The duration of the giveaway In Milliseconds').setRequired(true)
    .addChoices(
        { name: '15 Minutes', value: '900'},
        { name: '30 Minutes', value: '1800'},
        { name: '1 Hour', value: '3600'},
        { name: '2 Hours', value: '7200'},
        { name: '3 Hours', value: '10800'},
        { name: '5 Hours', value: '18000'},
        { name: '10 Hours', value: '36000'},
        { name: '1 Day', value: '86400'},
        { name: '2 Days', value: '172800'},
        { name: '3 Days', value: '259200'},
        { name: '5 Days', value: '432000'},
        { name: 'One Week', value: '604800'}
    ))
    .addIntegerOption(option => option.setName('winners').setDescription('The amount of winners').setRequired(true))
    .addStringOption(option =>option.setName('prize').setDescription('The prize for the giveaway').setRequired(true))
    .addChannelOption(option => option.setName('channel').setDescription('The channel for the giveaway'))
    .addStringOption(option => option.setName('content').setDescription('The content of the giveaway')),



                    async execute(interaction, client) {

                        if(!mongoose.connect) await interaction.reply(`no Mongodb Url Provided`)
                        if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageEvents)) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have permission to use that command.`, ephemeral: true});

                        await interaction.reply({ content: `Starting Giveaway`, ephemeral: true })
                        
                        const { GiveawaysManager } = require("discord-giveaways");

                        
                        const duration = interaction.options.getString("duration") * 1000;
        const winnerCount = interaction.options.getInteger('winners');
        const prize = interaction.options.getString('prize');
        const contentmain = interaction.options.getString(`content`);
        const channel = interaction.options.getChannel("channel");
        const giveawayreaction = `<a:PartyPopper:1125906182079533107>`
        
        if (!channel && !contentmain)
        client.giveawayManager.start(interaction.channel, {
            prize,
            winnerCount,
            duration,
            hostedBy: interaction.user,
            reaction: giveawayreaction,
            lastChance: {
                enabled: false,
                content: contentmain,
                threshold: 60000000000_000,
                embedColor: '#FF0000'
            }
        });

        else if (!channel)
        client.giveawayManager.start(interaction.channel, {
            prize,
            winnerCount,
            duration,
            hostedBy: interaction.user,
            reaction: giveawayreaction,
            lastChance: {
                enabled: true,
                content: contentmain,
                threshold: 60000000000_000,
                embedColor: '#FF0000'
            }
        });
        else if (!contentmain)
        client.giveawayManager.start(channel, {
            prize,
            winnerCount,
            duration,
            hostedBy: interaction.user,
            reaction: giveawayreaction,
            lastChance: {
                enabled: false,
                content: contentmain,
                threshold: 60000000000_000,
                embedColor: '#FF0000'
            }
        });
        else 
        client.giveawayManager.start(channel, {
            prize,
            winnerCount,
            duration,
            hostedBy: interaction.user,
            reaction: giveawayreaction,
            lastChance: {
                enabled: true,
                content: contentmain,
                threshold: 60000000000_000,
                embedColor: '#FF0000'
            }
        });

        interaction.editReply({ content:`<:Checkmark:1125943017434525776> Giveaway Started`, ephemeral: true })
                    }

}