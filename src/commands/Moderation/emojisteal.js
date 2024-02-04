const { SlashCommandBuilder } = require('@discordjs/builders');
const { default: axios } = require('axios');
const { EmbedBuilder, PermissionsBitField } = require('discord.js')
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('emoji-steal')
    .setDescription('Add a given emoji to the server')
    .addStringOption(option => option.setName('emoji').setDescription('The emoji you want to add to the server').setRequired(true))
    .addStringOption(option => option.setName('name').setDescription('The name for your emoji').setRequired(true)),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuildExpressions)) return await interaction.reply({ content: '<:Denied:1125943015878443089> You do not have the permission to use this command.', ephemeral: true});

        let emoji = interaction.options.getString('emoji')?.trim();
        const name = interaction.options.getString('name');
 
        if (emoji.startsWith("<") && emoji.endsWith(">")) {
        const id = emoji.match(/\d{15,}/g)[0];
 
        const type = await axios.get(`https://cdn.discordapp.com/emojis/${id}.gif`)
        .then(image => {
            if (image) return "gif"
            else return "png"
        }).catch(err => {
            return "png"
        })
 
            emoji = `https://cdn.discordapp.com/emojis/${id}.${type}?quality=lossless`
        }
 
        if (!emoji.startsWith("http")) {
            return await interaction.reply({ content: "<:Denied:1125943015878443089> You cannot steal default emojis!", ephemeral: true})
        }
 
        if (!emoji.startsWith("https")) {
            return await interaction.reply({ content: "<:Denied:1125943015878443089> You cannot steal default emojis!", ephemeral: true})
        }
 
        interaction.guild.emojis.create({ attachment: `${emoji}`, name: `${name}`})
        .then(emoji => {
            const embed = new EmbedBuilder()
            .setColor("Orange")
            .setDescription(`<:Checkmark:1125943017434525776> Added ${emoji}, with the name ${name}`)
 
            return interaction.reply({ embeds: [embed] });
        }).catch(err => {
            interaction.reply({ content: "<:Denied:1125943015878443089> You cannot add this emoji because you have reached your server emoji limit", ephemeral: true})
        })
    }
 
}