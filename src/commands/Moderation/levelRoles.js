const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require(`discord.js`);
const levelRoleSchema = require('../../Schemas.js/levelRolesSchema');
const levelGuildSchema = require(`../../Schemas.js/levelGuildSchema`);
const premiumSchema = require('../../Schemas.js/premiumSchema');

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`level-roles`)
    .setDescription(`Give roles to people after reaching a certain level`)
    .addSubcommand(command => command.setName(`set`).setDescription(`Setup the level role system`).addRoleOption(option => option.setName(`role1`).setDescription(`The first milestone role to give`).setRequired(true)).addNumberOption(option => option.setName('level1').setDescription("The level to reach to get the reward for role1").setRequired(true)).addRoleOption(option => option.setName(`role2`).setDescription(`The 2nd milestone role to give`).setRequired(false)).addNumberOption(option => option.setName('level2').setDescription("The level to reach to get the reward for role2").setRequired(false)).addRoleOption(option => option.setName(`role3`).setDescription(`The 3rd milestone role to give`).setRequired(false)).addNumberOption(option => option.setName('level3').setDescription("The level to reach to get the reward for role3").setRequired(false)).addRoleOption(option => option.setName(`role4`).setDescription(`The 4th milestone role to give`).setRequired(false)).addNumberOption(option => option.setName('level4').setDescription("The level to reach to get the reward for role4").setRequired(false)).addRoleOption(option => option.setName(`role5`).setDescription(`The 5th milestone role to give`).setRequired(false)).addNumberOption(option => option.setName('level5').setDescription("The level to reach to get the reward for role5").setRequired(false)))
    .addSubcommand(command => command.setName(`remove`).setDescription(`Remove the level role system`))
    .addSubcommand(command => command.setName(`view`).setDescription(`View the server's level role(s)`)),
    async execute (interaction, client) {

        await interaction.deferReply();

        const { options } = interaction;

        const levelGuildData = await levelGuildSchema.findOne({ Guild: interaction.guild.id })
        if (!levelGuildData) return await interaction.editReply({ content: `<:Denied:1125943015878443089> Your server does not currently have the leveling system setup! Do /level-system setup to setup the leveling system!`, ephemeral: true})

        const sub = options.getSubcommand()


        switch (sub) {
            case `set`:

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.editReply({ content: "<:Denied:1125943015878443089> You do not have permission to use this command!", ephemeral: true });
            const premiumData = await premiumSchema.findOne({ UserID: interaction.user.id})
            const role = interaction.options.getRole('role1');
            const role2 = interaction.options.getRole('role2')|| null;
            const role3 = interaction.options.getRole('role3')|| null;
            const role4 = interaction.options.getRole('role4')|| null;
            const role5 = interaction.options.getRole('role5')|| null;
    
            if (role.position >= interaction.guild.members.resolve(client.user).roles.highest.position) return await interaction.editReply({ content: "<:Warning:1125948329101103114> The role you mentioned is too high! Place the bot's role above that role.", ephemeral: true })
            if (role2&&role2.position >= interaction.guild.members.resolve(client.user).roles.highest.position) return await interaction.editReply({ content: "<:Warning:1125948329101103114> The role you mentioned is too high! Place the bot's role above that role.", ephemeral: true })
            if (role3&&role3.position >= interaction.guild.members.resolve(client.user).roles.highest.position) return await interaction.editReply({ content: "<:Warning:1125948329101103114> The role you mentioned is too high! Place the bot's role above that role.", ephemeral: true })
            if (role4&&role4.position >= interaction.guild.members.resolve(client.user).roles.highest.position) return await interaction.editReply({ content: "<:Warning:1125948329101103114> The role you mentioned is too high! Place the bot's role above that role.", ephemeral: true })
            if (role5&&role5.position >= interaction.guild.members.resolve(client.user).roles.highest.position) return await interaction.editReply({ content: "<:Warning:1125948329101103114> The role you mentioned is too high! Place the bot's role above that role.", ephemeral: true })
    
            const level = interaction.options.getNumber('level1') ;
            const level2 = interaction.options.getNumber('level2')|| null;
            const level3 = interaction.options.getNumber('level3')|| null;
            const level4 = interaction.options.getNumber('level4')|| null;
            const level5 = interaction.options.getNumber('level5')|| null;
    
            if (role2 !== null && level2 === null) return await interaction.editReply({ content: "<:Warning:1125948329101103114> Both fields must be filled out (role & level)", ephemeral: true })
            if (role3 !== null && level3 === null) return await interaction.editReply({ content: "<:Warning:1125948329101103114> Both fields must be filled out (role & level)", ephemeral: true })
            if (role4 !== null && level4 === null) return await interaction.editReply({ content: "<:Warning:1125948329101103114> Both fields must be filled out (role & level)", ephemeral: true })
            if (role5 !== null && level5 === null) return await interaction.editReply({ content: "<:Warning:1125948329101103114> Both fields must be filled out (role & level)", ephemeral: true })
    
            if (level2 !== null && role2 === null) return await interaction.editReply({ content: "<:Warning:1125948329101103114> Both fields must be filled out (role & level)", ephemeral: true })
            if (level3 !== null && role3 === null) return await interaction.editReply({ content: "<:Warning:1125948329101103114> Both fields must be filled out (role & level)", ephemeral: true })
            if (level4 !== null && role4 === null) return await interaction.editReply({ content: "<:Warning:1125948329101103114> Both fields must be filled out (role & level)", ephemeral: true })
            if (level5 !== null && role5 === null) return await interaction.editReply({ content: "<:Warning:1125948329101103114> Both fields must be filled out (role & level)", ephemeral: true })
    
            let roles = [];
            roles.push({
                level: level,
                roleId: role.id
            })
            if (role2 && level2) {
                roles.push({
                    level: level2,
                    roleId: role2.id
                })
            }
            if (role3 && level3) {
                roles.push({
                    level: level3,
                    roleId: role3.id
                })
            }
            if (role4 && level4) {
                roles.push({
                    level: level4,
                    roleId: role4.id
                })
            }
            if (role5 && level5) {
                roles.push({
                    level: level5,
                    roleId: role5.id
                })
            }
    
            if (roles.length > 3 && !premiumData) return await interaction.editReply({ content: "You need premium to add more than 3 level roles.", ephemeral: true })
    
            const guildid = interaction.guild.id;
            
            const levelRole = await levelRoleSchema.findOne({ GuildID: guildid })
            if (!levelRole) {
                await levelRoleSchema.create({
                    GuildID: guildid,
                    LevelRoleData: roles
                })
                const embed = new EmbedBuilder()
                .setColor("Orange")
                .setTitle(`Level Role Manager`)
                .setDescription("<:Checkmark:1125943017434525776> Added Level Role(s)")

                for (const item of roles) {
                    const roleId = item.roleId
                    const level = item.level
                    const i = roles.indexOf(item)
                    embed.addFields(
                        { name: `- Role ${i + 1}:`, value: `<:ReplyContinuedIcon:1134120279346520195> **Role Reward:** <@&${roleId}>\n<:ReplyIcon:1134120277157089301> **Level:** ${level}`, inline: true}
                    )
                }
    
                await interaction.editReply({ embeds: [embed], ephemeral: true })
            } else {
                if (levelRole.LevelRoleData.length > 3 && !premiumData) return await interaction.editReply({ content: "<:Warning:1125948329101103114> You cannot add more than 3 roles without premium. You can access premium by subscribing to our patreon! Do /premium-faq to learn more about premium.", ephemeral: true })
                if (levelRole.LevelRoleData.length >= 5) return await interaction.editReply({ content: "<:Denied:1125943015878443089> You have the maximum amount of level roles! (5)", ephemeral: true })
    
    
                const filter = { "guildId" : interaction.guild.id }
                for (const item of roles) {
                    const Roleid = item.roleId;
                    const Level = item.level;
                    await levelRoleSchema.findOneAndUpdate(filter, { $push: { Data: 
                    {
                        level: Level,
                        roleId: Roleid
                    }
                }})
                }
    
                const embed = new EmbedBuilder()
                .setColor("Orange")
                .setTitle(`Level Role Manager`)
                .setDescription("<:Checkmark:1125943017434525776> Added Level Role(s)")
    
                for (const item of roles) {
                    const roleId = item.roleId
                    const level = item.level
                    const i = roles.indexOf(item)
                    embed.addFields(
                        { name: `- Role ${i + 1}:`, value: `<:ReplyContinuedIcon:1134120279346520195> **Role Reward:** <@&${roleId}>\n<:ReplyIcon:1134120277157089301> **Level:** ${level}`, inline: true}
                    )
                }
    
    
                await interaction.editReply({ embeds: [embed], ephemeral: true })
            }

            break;

            case `remove`:

            if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.editReply({ content: "<:Denied:1125943015878443089> You do not have permission to use this command!", ephemeral: true });
            const levelRole2 = await levelRoleSchema.findOne({ GuildID: interaction.guild.id})
            if (!levelRole2) return await interaction.editReply({ content: `<:Denied:1125943015878443089> You currently do not have any level role system data setup! Do /level-roles set to include some data.`, ephemeral: true})
            else {

                const embed2 = new EmbedBuilder()
                .setColor(`Orange`)
                .setTitle(`Level Role Manager`)
                .setDescription(`<:Checkmark:1125943017434525776> Level Role System has been removed successfully.`)

                levelRole2.deleteOne({ GuildID: interaction.guild.id})
                await interaction.editReply({ embeds: [embed2], ephemeral: true})

            }

            break;

            case 'view':

            const levelRole3 = await levelRoleSchema.findOne({ GuildID: interaction.guild.id})
            if (!levelRole3) return await interaction.editReply({ content: `<:Denied:1125943015878443089> You currently do not have any level role system data setup! Do /level-roles set to include some data.`, ephemeral: true})
            else {
                const embed = new EmbedBuilder()
                .setColor('Orange')
                .setTitle(`Level Role Manager`)
                .setDescription("Level Role(s) List:")

                for (const item of levelRole3.LevelRoleData) {
                const roleid = item.roleId;
                const level = item.level;
                    const i = levelRole3.LevelRoleData.indexOf(item);

                    embed.addFields(
                        { name: `- Role ${i + 1}`, value: `<:ReplyContinuedIcon:1134120279346520195> **Role Reward:** <@&${roleid}>\n<:ReplyIcon:1134120277157089301> **Level:** **\`${level}\`**`}
                    )
                }

                await interaction.editReply({ embeds: [embed] })

            }
        }
    }
}