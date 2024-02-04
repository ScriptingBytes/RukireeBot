const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const axios = require(`axios`)
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('Generate a meme every time you use this command'),
    async execute(interaction) {
 
        async function meme() {
            await axios.get(`https://www.reddit.com/r/memes/random/.json`)
            .then(async r => {
 
                let meme = await r.json();
 
                let title = meme[0].data.children[0].data.title;
                let image = meme[0].data.children[0].data.url;
                let author = meme[0].data.children[0].data.author;
 
                const embed = new EmbedBuilder()
                .setColor("Orange")
                .setTitle(`${title}`)
                .setImage(`${image}`)
                .setURL(`${image}`)
                .setFooter({ text: author})
 
                await interaction.reply({ embeds: [embed] });
            })
        }
 
        meme();
    }
}