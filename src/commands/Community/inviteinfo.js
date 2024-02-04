const { SlashCommandBuilder, EmbedBuilder } = require(`discord.js`);

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`invite-info`)
    .setDescription(`Get information based off an invite link`)
    .addStringOption(option => option.setName(`invite-link`).setDescription(`The invite link you want to scope out`).setRequired(true)),
    async execute(interaction, client) {
        await interaction.deferReply({ ephemeral: true });

        const { options } = interaction;
        let input = options.getString(`invite-link`);

        input.replace(`discord.gg/`, ``);
        input.replace(`https://discord.gg/`, ``);
        input.replace(`http://discord.gg/`, ``);

        let invite;
        try {
            invite = await client.fetchInvite(input, { withCounts: true });
        
        } catch (err) {
            await interaction.editReply({ content: `<:Denied:1125943015878443089> I couldn't find any invite matching \`${input}\``}); 
        }

        if (!invite) return;
        let me = client.guilds.cache.get(invite.guild.id);
        if (!me) me = false;
        else me = true;

        const embed = new EmbedBuilder()
        .setColor(`Orange`)
        .setTitle(invite.guild.name)
        .setThumbnail(invite.guild.iconURL())
        .addFields({ name: `Server Features`, value: `> ⤷ *${invite.guild.features.join(`\n> ⤷ `)}*`})
        .addFields({ name: `Server Description`, value: `⤷ \`${invite.guild.description??`Description not set/found`}\``})
        .addFields({ name: `⤷ Boosts: \`${invite.guild.premiumSubscriptionCount}\``, value: ` `})
        .addFields({ name: `⤷ Member Count: \`${invite.memberCount}\``, value: ` `})
        .addFields({ name: `⤷ Server ID: \`${invite.guild.id}\``, value: ` `})
        .addFields({ name: `⤷ Vanity Invite Code: \`${invite.guild.vanityURLCode??`Vanity Invite Code not set/found`}\``, value: `  `})
        .addFields({ name: `⤷ Includes Rukiree: \`${me}\``, value: ` `})
        .setImage(invite.guild.bannerURL({ size: 2048}))
        .setTimestamp()
        .setFooter({ text: `Invite Information`})

        await interaction.editReply({ embeds: [embed], ephemeral: true});
    }
}
