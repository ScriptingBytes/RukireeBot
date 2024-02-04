const {SlashCommandBuilder, EmbedBuilder} = require('discord.js')
const afkSchema = require(`../../Schemas.js/afkSchema`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`afk`)
    .setDescription(`An AFK system to not be disturbed while AFK`)
    .addSubcommand(command => command.setName(`set`).setDescription(`Sets up your AFK status`).addStringOption(option => option.setName(`message`).setDescription(`The reason of why you are AFK`).setRequired(false)))
    .addSubcommand(command => command.setName(`remove`).setDescription(`Removes your AFK status`)),
    async execute (interaction) {
        const {options} = interaction;
        const sub = options.getSubcommand();

        const Data = await afkSchema.findOne({ Guild: interaction.guild.id, User: interaction.user.id});

        switch (sub) {
            case `set`:

            if (Data) return await interaction.reply({ content: `<:Denied:1125943015878443089> You are already afk within in the server.`, ephemeral: true});
            else {
                const message = options.getString(`message`);
                const nickname = interaction.member.nickname || interaction.user.username;

                await afkSchema.create({
                    Guild: interaction.guild.id,
                    User: interaction.user.id,
                    Message: message,
                    Nickname: nickname
                })

                const name = `[AFK] ${nickname}`;
                await interaction.member.setNickname(`${name}`).catch(err => {
                    return;
                })

                const embed = new EmbedBuilder()
                .setTitle(`AFK Manager`)
                .setColor(`Orange`)
                .setDescription(`<:Checkmark:1125943017434525776> You are now AFK within this server. Send a message or do /afk remove to remove your AFK status.`)

                await interaction.reply({ embeds: [embed], ephemeral: true});
            }

            break;

            case `remove`:

            if (!Data) return await interaction.reply({ content: `<:Denied:1125943015878443089> You are not afk within in the server.`, ephemeral: true});
            else {
                const nick = Data.Nickname;
                await afkSchema.deleteMany({ Guild: interaction.guild.id, User: interaction.user.id});

                await interaction.member.setNickname(`${nick}`).catch(err => {
                    return;
                })

                const embed = new EmbedBuilder()
                .setTitle(`AFK Manager`)
                .setColor(`Orange`)
                .setDescription(`<:Checkmark:1125943017434525776> You are no longer AFK within this server.`)

                await interaction.reply({ embeds: [embed], ephemeral: true});
            }
        }


    }
}
