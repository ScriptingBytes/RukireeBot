const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The title of the poll')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('options')
                .setDescription('The options for the poll separated by "|"')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
                .setDescription('The channel to send the poll to')
                .setRequired(true))
        .addRoleOption(option => option.setName(`role`).setDescription(`The roll you want to mention.`).setRequired(true)),

    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels))
        return await interaction.reply({ content: "<:Denied:1125943015878443089> You do not have permission to use that command.", ephemeral: true });
    
        const title = interaction.options.getString('title');
        const options = interaction.options.getString('options').split('|').map(option => option.trim());
        const channel = interaction.options.getChannel('channel');
        const role = interaction.options.getRole(`role`)

        const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
        const pollOptions = options.slice(0, emojis.length);

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor(`Orange`)
            .setTimestamp();
            for (let i = 0; i < pollOptions.length; i++) {
              embed.addFields({ name: `Option ${i + 1}`, value: pollOptions[i], inline: true });
            }
            await interaction.reply({content: `<:Checkmark:1125943017434525776> The poll has been sent to <#${channel.id}>`, ephemeral: true})
        const pollMessage = await channel.send({ embeds: [embed], content: `${role}` });

        for (let i = 0; i < pollOptions.length; i++) {
            await pollMessage.react(emojis[i]);
        }
    
  }
};