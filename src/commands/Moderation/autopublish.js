const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField, ChannelType } = require(`discord.js`);
const autopublishSchema = require(`../../Schemas.js/autopublish`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`auto-publish`)
    .setDescription(`Setup/Disable a auto-publish for an annoucements channel`)
    .addSubcommand(command => command.setName(`add`).setDescription(`Adds a channel to the auto publisher list`).addChannelOption(option => option.setName(`channel`).setDescription(`The channel you want to auto publish`).addChannelTypes(ChannelType.GuildAnnouncement).setRequired(true)))
    .addSubcommand(command => command.setName(`remove`).setDescription(`Removes a channel from the auto publisher list`).addChannelOption(option => option.setName(`channel`).setDescription(`The channel you want to remove from the auto publish list`).addChannelTypes(ChannelType.GuildAnnouncement).setRequired(true))),
    async execute (interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have permission to use that command.`, ephemeral: true})
        
        const sub = interaction.options.getSubcommand();
        const channel = await interaction.options.getChannel(`channel`);

        switch (sub) {
            case `add`:

            const data = await autopublishSchema.findOne({ Guild: interaction.guild.id })
            const embed = new EmbedBuilder()
            .setTitle(`Auto-Publish Manager`)
            .setColor(`Orange`)
            .setDescription(`<:Checkmark:1125943017434525776> All messages sent in ${channel} will be automatically published!`)

            if (!data) {
                await interaction.reply({ embeds: [embed], ephemeral: true})

                await autopublishSchema.create({
                    Guild: interaction.guild.id,
                    Channel: [ ]
                })

                await autopublishSchema.updateOne({ Guild: interaction.guild.id}, { $push: { Channel: channel.id}})
            } else {

                if (data.Channel.includes(channel.id)) return await interaction.reply({ content: `<:Denied:1125943015878443089> The channel you selected has already been setup for auto publishing`, ephemeral: true})
            
                await autopublishSchema.updateOne({ Guild: interaction.guild.id}, { $push: { Channel: channel.id}})
                await interaction.reply({ embeds: [embed], ephemeral: true})
            }

            break;
            case `remove`:

            const data1 = await autopublishSchema.findOne({ Guild: interaction.guild.id })

            if (!data1) {
                return await interaction.reply({ content: `<:Denied:1125943015878443089> You have not setup any channels to be auto published`, ephemeral: true})
            } else {
                if (!data1.Channel.includes(channel.id)) return await interaction.reply({ content: `<:Denied:1125943015878443089> The channel you selected has not already been setup for auto publishing`, ephemeral: true})
                else {
                    const embed2 = new EmbedBuilder()
                    .setTitle(`Auto-Publish Manager`)
                    .setColor(`Orange`)
                    .setDescription(`<:Checkmark:1125943017434525776> ${channel} has been removed off of your auto publish list`)

                    await interaction.reply({ embeds: [embed2], ephemeral: true});
                    await autopublishSchema.updateOne({ Guild: interaction.guild.id}, { $pull: { Channel: channel.id}})
                }
            }

        }
        
   
    }


}