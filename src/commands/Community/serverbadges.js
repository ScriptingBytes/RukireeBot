const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('server-badges')
    .setDescription('Find the total number of users with each profile badge')
    .setDMPermission(false),
  async execute(interaction, client) {

    let counts = {};

    const guild = interaction.guild;
    await guild.members.fetch();

    for (const member of guild.members.cache.values()) {
      const userFlags = member.user.flags?.toArray() || [];
      for (const flag of userFlags) {
        if (counts[flag]) {
          counts[flag]++;
        } else {
          counts[flag] = 1;
        }
      }
    }

    const staff = '<:DiscordStaff:1125953482000703528> '
    const partner = '<:Partner:1125953490649354312>'
    const moderator = '<:CertifiedModerator:1125953480239087657>'
    const hypesquad = '<:Hypesquad:1125953486765428766>'
    const bravery = '<:Bravery:1125953474044104714> '
    const brilliance = '<:Brilliance:1125953476720074762>'
    const balance = '<:Balance:1125953472689348669> '
    const bughunter1 = '<:BugHunter1:1125953478305525882> '
    const bughunter2 = '<:BugHunter2:1125953488346693743>'
    const activedeveloper = '<:ActiveDeveloper:1125953470046937109>'
    const verifieddeveloper = '<:VerifiedBotDeveloper:1125953495061757963> '
    const earlysupporter = '<:EarlySupporter:1125953484362108958>'
    const verifiedbot = '<:VerifiedBot:1125953492746514502>'

    const embed = new EmbedBuilder()
      .setColor('Orange')
      .setTitle('Server Badges')
      .setDescription(`
        ${staff} **${counts['Staff'] || 0}**
        ${moderator} **${counts['CertifiedModerator'] || 0}**
        ${partner} **${counts['Partner'] || 0}**
        ${earlysupporter} **${counts['PremiumEarlySupporter'] || 0}**
        ${bughunter1} **${counts['BugHunterLevel1'] || 0}**
        ${bughunter2} **${counts['BugHunterLevel2'] || 0}**
        ${activedeveloper} **${counts['ActiveDeveloper'] || 0}**
        ${verifieddeveloper} **${counts['VerifiedDeveloper'] || 0}**
        ${verifiedbot} **${counts['VerifiedBot'] || 0}**
        ${hypesquad} **${counts['Hypesquad'] || 0}**
        ${bravery} **${counts['HypeSquadOnlineHouse1'] || 0}**
        ${brilliance} **${counts['HypeSquadOnlineHouse2'] || 0}**
        ${balance} **${counts['HypeSquadOnlineHouse3'] || 0}**\n
    `)

    await interaction.reply({ embeds: [embed] });
  },
};