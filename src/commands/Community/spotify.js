const { SlashCommandBuilder, EmbedBuilder, AttachmentBuilder } = require('discord.js');
const canvacord = require('canvacord');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('spotify')
    .setDMPermission(false)
    .setDescription(`Displays specified user's spotify status.`)
    .addUserOption(option => option.setName('user').setDescription(`Specified user's status will be displayed.`).setRequired(true)),
    async execute(interaction) {

        let user = interaction.options.getMember('user');
        const username = interaction.options.getUser('user');

        if (user.bot) return await interaction.reply({ content: `<:Denied:1125943015878443089> You cannot get the bots status. Re-run this command but specify a user.`, ephemeral: true});

        let status;
        if (user.presence.activities.length === 1) status = user.presence.activities[0];
        else if (user.presence.activities.length > 1) status = user.presence.activities[1];

        if (user.presence.activities.length === 0 || status.name !== 'Spotify' && status.type !== 'LISTENING') {
            return await interaction.reply({ content: `<:Denied:1125943015878443089> ${user} is currently not listening to Spotify. Specify another user who is listening to Spotify.`, ephemeral: true});
        }

        if (status !== null && status.name === 'Spotify' && status.assets !== null) {

            let image = `https://i.scdn.co/image/${status.assets.largeImage.slice(8)}`,
            name = status.details,
            artist = status.state,
            album = status.assets.largeText;

            const card = new canvacord.Spotify()
            .setAuthor(artist)
            .setAlbum(album)
            .setStartTimestamp(status.timestamps.start)
            .setEndTimestamp(status.timestamps.end)
            .setImage(image)
            .setTitle(name)

            const Card = await card.build();
            const attachments = new AttachmentBuilder(Card, { name: "spotify.png" });

            const embed = new EmbedBuilder()
            .setColor("Orange")
            .setTimestamp()
            .setImage(`attachment://spotify.png`)
            .setTitle(`${username.username}'s Spotify Status`)
            .addFields({ name: `User's Current Song`, value: `<:ReplyContinuedIcon:1134120279346520195> Song Name: ${name}\n<:ReplyContinuedIcon:1134120279346520195> Artist: ${artist}\n<:ReplyIcon:1134120277157089301> Album: ${album}`})

            await interaction.reply({ embeds: [embed], files: [attachments] })
        }
    }
}