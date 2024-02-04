const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const roleschema = require('../../Schemas.js/autorole');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('auto-role')
    .setDMPermission(false)
    .setDescription('Configure an automatic role that is given to your Members when joining.')
    .addSubcommand(command => command.setName('set').setDescription('Set your auto-role.').addRoleOption(option => option.setName('role').setDescription('Specified role will be your auto-role.').setRequired(true)))
    .addSubcommand(command => command.setName('remove').setDescription('Removes your auto-role.')),
    async execute(interaction) {
 
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return await interaction.reply({ content: '<:Denied:1125943015878443089> You do not have permission to use that command.', ephemeral: true});
        const sub = interaction.options.getSubcommand();
 
        switch (sub) {
            case 'set':
 
            const role = interaction.options.getRole('role');
 
            const roledata = await roleschema.findOne({ Guild: interaction.guild.id });
            if (roledata) return await interaction.reply({ content: `<:Denied:1125943015878443089> You already have an auto-role set up! (<@&${roledata.Role}>) Do /auto-role disable to change your auto-role system.`, ephemeral: true})
            else {
 
            await roleschema.create({
                Guild: interaction.guild.id,
                Role: role.id
            })
 
            const embed = new EmbedBuilder()
            .setColor("Orange")
            .setTitle('Auto Role Manager')
            .setAuthor({ name: `Auto-Role tool`})
            .setFooter({ text: `<:SettingsIcon:1128106239520415744> Do /auto-role remove to undo`})
            .addFields({ name: `<:Checkmark:1125943017434525776> Auto Role was set`, value: `<:ReplyIcon:1134120277157089301> New Auto-Role is ${role}`})
 
            await interaction.reply({ embeds: [embed], ephemeral: true});
        }
 
        break;
            case 'remove':
 
            const removedata = await roleschema.findOne({ Guild: interaction.guild.id });
            if (!removedata) return await interaction.reply({ content: `<:Denied:1125943015878443089> You do not have the auto-role system set up! Do /auto-role set to setup the system.`, ephemeral: true})
            else {
 
                await roleschema.deleteMany({
                    Guild: interaction.guild.id
                })
 
                const embed = new EmbedBuilder()
                .setColor("Orange")
                .setTitle('Auto Role Manager')
                .setAuthor({ name: `Auto-Role tool`})
                .setFooter({ text: `<:SettingsIcon:1128106239520415744> Do /auto-role set to undo`})
                .addFields({ name: `<:Checkmark:1125943017434525776> Auto Role was disabled`, value: `<:ReplyIcon:1134120277157089301> Your members will no longer automatically recieve any role.`})
 
                await interaction.reply({ embeds: [embed], ephemeral: true});
            }
        }
    }
}