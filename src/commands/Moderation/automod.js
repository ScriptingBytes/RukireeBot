const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require(`discord.js`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`automod`)
    .setDescription(`Setup an automod system for your server.`)
    .addSubcommand(command => command.setName(`flagged-words`).setDescription(`Block profanity, sexual content, and slurs.`))
    .addSubcommand(command => command.setName(`spam-messages`).setDescription(`Block messages suspected of spam.`))
    .addSubcommand(command => command.setName(`mention-spam`).setDescription(`Block messages containing a certain amount of mentions.`).addIntegerOption(option => option.setName(`number`).setDescription(`The number of mentions required to trigger the automod`).setRequired(true)))
    .addSubcommand(command => command.setName(`keyword`).setDescription(`Block a given keyword in the server.`).addStringOption(option => option.setName(`word`).setDescription(`The word you want to block`).setRequired(true))),
    async execute (interaction) {
        const { guild, options } = interaction;
        const sub = options.getSubcommand()

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have permission to setup automod within this server.`, ephemeral: true})

        switch (sub) {
            case "flagged-words":

            await interaction.reply({ content: `<a:Loading:1125940314914426880> Loading your automod rule...`});

            const rule = await guild.autoModerationRules.create({
                name: `Block profanity, sexual content, and slurs by Rukiree Automod`,
                creatorId: `1115811892607340668`,
                enabled: true,
                eventType: 1,
                triggerType: 4,
                triggerMetadata:
                    {
                        presets: [1, 2, 3]
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: `This message was prevented by Rukiree Automod`
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    console.log(err);
                    await interaction.editReply({ content: `${err}`, ephemeral: true});
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule) return;

                const embed = new EmbedBuilder()
                .setTitle(`Automoderation Manager`)
                .setColor(`Orange`)
                .setDescription(`<:Checkmark:1125943017434525776>  Your automod rule has been created. All profanity, sexual content and slurs will be blocked by Rukiree`)

                await interaction.editReply({ content: ``, embeds: [embed], ephemeral: true});
            }, 3000)

            break;

            case `keyword`:

            await interaction.reply({ content: `<a:Loading:1125940314914426880> Loading your automod rule...`});

            const word = options.getString(`word`);
            const rule2 = await guild.autoModerationRules.create({
                name: `Prevent the word ${word} from being used by Rukiree Automod`,
                creatorId: `1115811892607340668`,
                enabled: true,
                eventType: 1,
                triggerType: 1,
                triggerMetadata:
                    {
                        keywordFilter: [`${word}`]
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: `This message was prevented by Rukiree Automod`
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    console.log(err);
                    await interaction.editReply({ content: `${err}`, ephemeral: true});
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule2) return;

                const embed2 = new EmbedBuilder()
                .setTitle(`Automoderation Manager`)
                .setColor(`Orange`)
                .setDescription(`<:Checkmark:1125943017434525776>  Your automod rule has been created. The word: ${word} will be blocked by Rukiree`)

                await interaction.editReply({ content: ``, embeds: [embed2], ephemeral: true});
            }, 3000)

            break;

            case `spam-messages`:

            await interaction.reply({ content: `<a:Loading:1125940314914426880> Loading your automod rule...`});

            
            const rule3 = await guild.autoModerationRules.create({
                name: `Prevent spam messages by Rukiree Automod`,
                creatorId: `1115811892607340668`,
                enabled: true,
                eventType: 1,
                triggerType: 3,
                triggerMetadata:
                    {
                        //mentionTotalLimit: number
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: `This message was prevented by Rukiree Automod`
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    console.log(err);
                    await interaction.editReply({ content: `${err}`, ephemeral: true});
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule3) return;

                const embed3 = new EmbedBuilder()
                .setTitle(`Automoderation Manager`)
                .setColor(`Orange`)
                .setDescription(`<:Checkmark:1125943017434525776>  Your automod rule has been created. All suspected messages of spam will be blocked by Rukiree`)

                await interaction.editReply({ content: ``, embeds: [embed3], ephemeral: true});
            }, 3000)

            break;

            case `mention-spam`:

            await interaction.reply({ content: `<a:Loading:1125940314914426880> Loading your automod rule...`});

            const number = options.getInteger(`number`)
            const rule4 = await guild.autoModerationRules.create({
                name: `Prevent spam mentions by Rukiree Automod`,
                creatorId: `1115811892607340668`,
                enabled: true,
                eventType: 1,
                triggerType: 5,
                triggerMetadata:
                    {
                        mentionTotalLimit: number
                    },
                actions: [
                    {
                        type: 1,
                        metadata: {
                            channel: interaction.channel,
                            durationSeconds: 10,
                            customMessage: `This message was prevented by Rukiree Automod`
                        }
                    }
                ]
            }).catch(async err => {
                setTimeout(async () => {
                    console.log(err);
                    await interaction.editReply({ content: `${err}`, ephemeral: true});
                }, 2000)
            })

            setTimeout(async () => {
                if (!rule4) return;

                const embed4 = new EmbedBuilder()
                .setTitle(`Automoderation Manager`)
                .setColor(`Orange`)
                .setDescription(`<:Checkmark:1125943017434525776>  Your automod rule has been created. All messages with ${number} or more mentions will be blocked by Rukiree`)

                await interaction.editReply({ content: ``, embeds: [embed4], ephemeral: true});
            }, 3000)

            break;
        }
    }
}