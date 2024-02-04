const { Interaction, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, } = require("discord.js");
const blacklistSchema = require(`../Schemas.js/blacklistSchema`)

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        // Command
        if (interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            if (!command) return

            const blacklistEmbed = new EmbedBuilder()
            .setTitle(`You cannot use any commands!`)
            .setColor(`Orange`)
            .setDescription(`<:Denied:1125943015878443089> You have been blacklisted from using Rukiree application commands.\n\nYou can appeal at our Suppport server`)
            const button = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                .setLabel(`Support Server`)
                .setURL(`https://discord.gg/cjjqD8HqMB`)
                .setStyle(ButtonStyle.Link)
            );

            const blacklistData = await blacklistSchema.findOne({ UserID: interaction.user.id})
            if (blacklistData) return await interaction.reply({ embeds: [blacklistEmbed], components: [button], ephemeral: true})

            try{
                await command.execute(interaction, client);

                let subcommand = interaction.options._subcommand || "";
                let subcommandGroup = interaction.options._subcommandGroup || "";
                let commandArgs = interaction.options._hoistedOptions || [];
                let args = `${subcommandGroup} ${subcommand} ${commandArgs.map(arg => arg.value).join(" ")}`.trim();
                const rukireeGuild = client.guilds.cache.get(`1115814357226491924`)
                const rukireeChannel = rukireeGuild.channels.cache.get(`1122645510801596609`)
                const commandEmbed = new EmbedBuilder()
                .setTitle(`New Command Ran`)
                .setColor(`Orange`)
                .addFields({name: `User:`, value: interaction.user.tag})
                .addFields({name: `ID:`, value: interaction.user.id})
                .addFields({name: `Guild:`, value: interaction.guild.name || `none`})
                .addFields({name: `ID:`, value: interaction.guild.id})
                .addFields({name: `Command:`, value: `/${interaction.commandName} ${args}`})
                .setTimestamp()
                await rukireeChannel.send({embeds: [commandEmbed]});
            } catch (error) {
                console.log(error);
                await interaction.reply({
                    content: 'There was an error while executing this command! This error has already been reported to the developers.', 
                    ephemeral: true
                });

                const channel = client.channels.cache.get(`1134137357822599238`);
                const embed =  new EmbedBuilder()
                .setTitle("Someone had an error!")
                .addFields(
                    {name: "User:", value: `<@${interaction.user.id}>`, inline: false}
                )
                .setDescription(`_An error has occured_.\n\n**Error Code:** \`${error.name}\`\n**Error Message:** \`${error.message}\`\n**Stack:** \`\`\`yml\n${error.stack}\`\`\``)
                .setColor("Orange")

                channel.send({ content: `<@541389323384258591>`, embeds: [embed]}).catch(err => {
                    return;
                });
            } 

        }

    },
};