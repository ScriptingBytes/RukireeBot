const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require(`discord.js`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`moderate-nickname`)
    .setDescription(`Moderate a users nickname`)
    .addUserOption(option => option.setName(`user`).setDescription(`The user of whom to censor their nickname`).setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have permission to use that command.`, ephemeral: true})

        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        const user = options.getUser(`user`);

        const member = await interaction.guild.members.fetch(user.id).catch(err => {});
        const tagline = Math.floor(Math.random() * 10000) + 1;

        const embed = new EmbedBuilder()
        .setColor(`Orange`)
        .setTitle(`Nickname Manager`);

        try {
            embed.setDescription(`<:Checkmark:1125943017434525776>\n<:ReplyIcon:1134120277157089301> Successfully set ${user.username}'s nickname to: **Moderated Nickname ${tagline}**`);
            await member.setNickname(`Moderated Nickname ${tagline}`);
        } catch (e) {
            embed.setDescription(`<:Warning:1125948329101103114>\n<:ReplyIcon:1134120277157089301> Could not successfully set ${user.username}'s nickname to: **Moderated Nickname ${tagline}**`);
            await interaction.editReply({ embeds: [embed] });
        }

        await interaction.editReply({ embeds: [embed] });
    }

}