const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require(`discord.js`)

module.exports = {
    data: new SlashCommandBuilder()
    .setName(`help`)
    .setDescription(`A help command for your questions!`),
    async execute( interaction, client ) {
        const helpEmbed = new EmbedBuilder()
        .setColor(`Orange`)
        .setTitle(`Help Center`)
        .setDescription(`Help Command Guide:`)
        .addFields({name: `Page 1`, value: `Community Access (Button 1)`})
        .addFields({name: `Page 2`, value: `Moderation commands A-L (Button 2)`})
        .addFields({name: `Page 3`, value: `Moderation commands M-Z (Button 3)`})
        .addFields({name: `Page 4`, value: `All about fun! (Button 4)`})
        .addFields({name: `Page 5`, value: `Premium Only (Button 5)`})

        const embed1 = new EmbedBuilder()
        .setColor(`Orange`)
        .setTitle(`Help Center`)
        .setDescription(`Community Access Section`)
        .addFields({name: `/afk`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /afk, leaving a message is **optional**.\n<:ReplyIcon:1134120277157089301> This command lets you go afk within the stated server you posted the command.`})
        .addFields({name: `/ascii`, value: `<:ReplyIcon:1134120277157089301> While doing /ascii, enter in a message to generate ASCII text art.`})
        .addFields({name: `/birthday-system set`, value: `<:ReplyIcon:1134120277157089301> While doing /birthday-system set, enter in the required information and it'll setup your birthday.`})
        .addFields({name: `/birthday-system reset`, value: `<:ReplyIcon:1134120277157089301> Doing /birthday-system reset, will reset the established data setup for your birthday.`})
        .addFields({name: `/birthday-system display`, value: `<:ReplyIcon:1134120277157089301> While doing /birthday-system display, add a user to see their birthday (Not Required)`})
        .addFields({name: `/dictionary`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /dictionary, enter in a word to see it's definition.\n<:ReplyIcon:1134120277157089301> This command brings up the definitions within the stated word.`})
        .addFields({name: `/faq`, value: `<:ReplyIcon:1134120277157089301> Doing /faq will bring up an embed displaying frequently asked questions about our bot.`})
        .addFields({name: `/help`, value: `<:ReplyContinuedIcon:1134120279346520195> Doing /help will bring up this exact embed.\n<:ReplyIcon:1134120277157089301> It's like you already knew what it did...`})
        .addFields({name: `/invites`, value: `<:ReplyIcon:1134120277157089301> Doing /invites will bring up your invites to the server within the server you posted the command.`})
        .addFields({name: `/invite-info`, value: `<:ReplyIcon:1134120277157089301> While doing /invite-info enter in a invite url to see the details of the server you were invited to`})
        .addFields({name: `/member-count`, value: `<:ReplyIcon:1134120277157089301> Doing /member-count will bring up the servers member count and fits it in a nice little embed.`})
        .addFields({name: `/meme`, value: `<:ReplyIcon:1134120277157089301> Doing /meme will bring up a random post from r/memes on Reddit.`})
        .addFields({name: `/premium-faq`, value: `<:ReplyIcon:1134120277157089301> Doing /premium-faq will bring up an embed displaying frequently asked questions about our premium services.`})
        .addFields({name: `/rank`, value: `<:ReplyIcon:1134120277157089301> Doing /rank will show your XP rank within the server.`})
        .addFields({name: `/report`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /report, enter in the required information about a bug or command abuse.\n<:ReplyIcon:1134120277157089301> Note: **This gets sent to developers, if a multiple false reports are seen, we will blacklist you from using our bot!**`})
        .addFields({name: `/review`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /review, put the amount of stars you want to give as well as a description.\n<:ReplyIcon:1134120277157089301> Note: **THIS COMMAND ONLY WORKS IN THE SUPPORT SERVER!**`})
        .addFields({name: `/server-badges`, value: `<:ReplyIcon:1134120277157089301> Doing /server-badges will bring up an embed of all the badges users have.`})
        .addFields({name: `/snipe`, value: `<:ReplyIcon:1134120277157089301> Doing /snipe will bring up the message that was just recently deleted. [USE FAST]`})
        .addFields({name: `/spotify`, value: `<:ReplyIcon:1134120277157089301> Doing /spotify will bring up a embed with a users current song playing on Spotify.`})
        .addFields({name: `/stats`, value: `<:ReplyIcon:1134120277157089301> Doing /stats will bring up the bots statistics.`})
        .addFields({name: `/uptime`, value: `<:ReplyContinuedIcon:1134120279346520195> Doing /uptime will bring up th bots uptime.\n<:ReplyIcon:1134120277157089301> The uptime is also stated in the bots statistics by doing /stats.`})
        .addFields({name: `/who-is`, value: `<:ReplyIcon:1134120277157089301> While doing /who-is, enter a username and it will bring up a embed displaying statistics of the stated user.`})
        .addFields({name: `/xp-leaderboard`, value: `<:ReplyIcon:1134120277157089301> Doing /xp-leaderboard will pull up the servers rank leaderboard.`})
        .setFooter({text: `Community Access Section`})
        .setTimestamp()

        const modEmbed1 = new EmbedBuilder()
        .setColor(`Orange`)
        .setTitle(`Help Center`)
        .setDescription(`Moderation Section A-L`)
        .addFields({name: `/annouce`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /annouce, enter in the message you want to annouce to the server.\n<:ReplyIcon:1134120277157089301> This command annouces what changes you did... It seems kind've obvious...`})
        .addFields({name: `/automod`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /automod, choose which automod rules you need and enter in the following required information.\n<:ReplyIcon:1134120277157089301> This allows Rukiree to automod your server.`})
        .addFields({name: `/auto-publish add`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /auto-publish add, enter a annoucement channel for it to be added to the auto-publishing list for it to be automatically published.\n<:ReplyIcon:1134120277157089301> Once an annoucement is made, the bot automatically publishes the annoucement for you.`})
        .addFields({name: `/auto-publish remove`, value: `<:ReplyIcon:1134120277157089301> While doing /auto-publish remove, enter a annoucement channel for it to be remove from the auto-publishing list.`})
        .addFields({name: `/auto-reaction setup`, value: `<:ReplyIcon:1134120277157089301> While doing /auto-reaction setup, enter in a emoji and channel (not required) and the bot will automatically react to any messages sent in the channel with the system.`})
        .addFields({name: `/auto-reaction disable-one`, value: `<:ReplyIcon:1134120277157089301> While doing /auto-reaction disable-one, enter in a channel and it'll disable the auto reaction system for that specified channel.`})
        .addFields({name: `/auto-reaction disable-all`, value: `<:ReplyIcon:1134120277157089301> By doing /auto-reaction disable-all, disables all the auto reaction systems for the server in which you ran the command in.`})
        .addFields({name: `/auto-role`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /auto-role, enter a role to be automatically given.\n<:ReplyIcon:1134120277157089301> This command lets your new members be automatically given a role of your choosing`})
        .addFields({name: `/ban`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /ban, enter a member and a reason for their banishment from the server.\n<:ReplyIcon:1134120277157089301> This command bans a member with the reason you inputed.`})
        .addFields({name: `/bump-reminder`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /bump-reminder, choose between the setup, edit or disable options.\n<:ReplyIcon:1134120277157089301> This reminder system currently only supports Disboard.`})
        .addFields({name: `/embedcreator`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /embedcreator fill in all the details needed for the embed.\n<:ReplyIcon:1134120277157089301> This command makes a embed of your creation.`})
        .addFields({name: `/gwstart`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /gwstart, there's a ton to be inputted before you start your giveaway. For instance the prize! You can't forget to leave out the prize right?\n<:ReplyContinuedIcon:1134120279346520195> This command creates a giveaway for members to try and win!\n<:ReplyIcon:1134120277157089301>a Note: Make sure you read before creating a giveaway.`})
        .addFields({name: `/gwend`, value: `<:ReplyIcon:1134120277157089301> While doing /gwend, enter the message id of the existing giveaway and the bot will automatically end the existing giveaway early.`})
        .addFields({name: `/gwreroll`, value: `<:ReplyIcon:1134120277157089301> While doing /gwreroll, enter the same information as /gwend would accept, and the winner will be automatically rerolled.`})
        .addFields({name: `/join-to-create`, value: `<:ReplyIcon:1134120277157089301> While doing /join-to-create, enter in a channel with a category to enable the join to create voice channel system.`})
        .addFields({name: `/leave`, value: `<:ReplyIcon:1134120277157089301> While doing /leave, enter a channel and a message to depart a member with.`})
        .addFields({name: `/level-system setup`, value: `<:ReplyIcon:1134120277157089301> By doing /level-system setup, you enable your server to have access to the leveling system.`})
        .addFields({name: `/level-system remove`, value: `<:ReplyIcon:1134120277157089301> By doing /level-system remove, you remove the leveling system.`})
        .addFields({name: `/level-roles set`, value: `<:ReplyIcon:1134120277157089301> While doing /level-roles set, enter in the information and it'll give out roles based off the level you entered when the user hits that required level.`})
        .addFields({name: `/level-roles remove`, value: `<:ReplyIcon:1134120277157089301> By doing /level-roles remove, you remove the established level roles.`})
        .addFields({name: `/level-roles view`, value: `<:ReplyIcon:1134120277157089301> By doing /level-roles view, you are able to view the roles along with the level required to reach them being established on an embed.`})
        .addFields({name: `/lock`, value: `<:ReplyIcon:1134120277157089301> While doing /lock, enter a channel and it will lock the channel to be read only. No messages can be sent while being locked.`})
        .setFooter({text: `Moderation Section A-L`})
        .setTimestamp()

        const modEmbed2 = new EmbedBuilder()
        .setColor(`Orange`)
        .setTitle(`Help Center`)
        .setDescription(`Moderation Section M-Z`)
        .addFields({name: `/members-vc set`, value: `<:ReplyIcon:1134120277157089301> While doing /members-vc set, enter a voice channel and it will bring up the member count on a existing voice channel.`})
        .addFields({name: `/members-vc remove`, value: `<:ReplyIcon:1134120277157089301> While doing /members-vc remove, enter a voice channel and it will delete the voice channel used to display the member count.`})
        .addFields({name: `/moderate-nickname`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /moderate-nickname, enter a user to censor their username by replacing it with a nickname: 'Moderated Nickname XXXX'\n<:ReplyIcon:1134120277157089301> The randomly generated numbers range from 3 digits to 4 digits.`})
        .addFields({name: `/poll`, value: `<:ReplyIcon:1134120277157089301> While doing /poll, enter the poll title, the poll options seperated by |, and the channel it will be sent to.`})
        .addFields({name: `/purge`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /purge, enter a channel and the amount of messages deleted.\n<:ReplyContinuedIcon:1134120279346520195> This will delete all of the messages that are within the limit.\n<:ReplyIcon:1134120277157089301> Cannot delete messages that are 14 days old and up.`})
        .addFields({name: `/rr-msg-create`, value: `<:ReplyIcon:1134120277157089301> While doing /rr-msg-create, enter in the required information to create a reaction role system.`})
        .addFields({name: `/rr-msg-delete`, value: `<:ReplyIcon:1134120277157089301> While doing /rr-msg-delete, enter in the message ID and it'll delete the reaction role system.`})
        .addFields({name: `/rr-add`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /rr-add, enter in the information and it'll update the reaction role embed to contain the newly added button.\n<:ReplyIcon:1134120277157089301> Note: There is only a max of 10 buttons that you can add.`})
        .addFields({name: `/ticket-setup`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /ticket-set, enter in the required information to establish a ticketing system.\n<:ReplyIcon:1134120277157089301> All made tickets will be stored in the category.`})
        .addFields({name: `/ticket-disable`, value: `<:ReplyIcon:1134120277157089301> While doing /ticket-disable, will disable your current ticketing system.`})
        .addFields({name: `/timeout`, value: `<:ReplyIcon:1134120277157089301> While doing /timeout, enter a username and it will timeout the specified user for how long the duration is.`})
        .addFields({name: `/unban`, value: `<:ReplyIcon:1134120277157089301> While doing /unban, enter a user *ID* and it will unban the specified user for them to rejoin your server.`})
        .addFields({name: `/untimeout`, value: `<:ReplyIcon:1134120277157089301> While doing /untimeout, enter a username and it will relieve their timeout punishment.`})
        .addFields({name: `/welcome`, value: `<:ReplyIcon:1134120277157089301> While doing /welcome, enter a channel and a message to greet a new member with.`})
        .addFields({name: `/xpreset-server`, value: `<:ReplyContinuedIcon:1134120279346520195> Doing /xpreset-server will delete all progress made for your XP system.\n<:ReplyIcon:1134120277157089301> Only the server Owner can use this command.`})
        .addFields({name: `/xpreset-user`, value: `<:ReplyIcon:1134120277157089301> While doing /xpreset-user, enter a user to reset their XP progress.`})
        .setFooter({text: `Moderation Section M-Z`})
        .setTimestamp()

        const embed3 = new EmbedBuilder()
        .setColor(`Orange`)
        .setTitle(`Help Center`)
        .setDescription(`All about fun! Section\n<:ReplyLineIcon:1140041677000691823>\n<:ReplyIcon:1134120277157089301> This section will be updated more frequently in the future as people like to have fun!`)
        .addFields({name: `/8ball`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /8ball, enter a prompt for the 8ball to decide.\n<:ReplyIcon:1134120277157089301> The command outputs are random. There is no rng to 8ball...`})
        .addFields({name: `/globalchat connect`, value: `<:ReplyIcon:1134120277157089301> Doing /globalchat connect will connect you with another user issuing the same command.`})
        .addFields({name: `/globalchat hangup`, value: `<:ReplyIcon:1134120277157089301> Doing /globalchat hangup will disconnect you with another user who used the /globalchat connect command.`})
        .addFields({name: `/music play`, value: `<:ReplyIcon:1134120277157089301> While doing /music play, enter in a URL or keywords to a some music and the bot will play some music for you.`})
        .addFields({name: `/music pause`, value: `<:ReplyIcon:1134120277157089301> Doing /music pause will pause the bot from making anymore music.`})
        .addFields({name: `/music resume`, value: `<:ReplyIcon:1134120277157089301> Doing /music resume will resume the bot to continue making music.`})
        .addFields({name: `/music stop`, value: `<:ReplyIcon:1134120277157089301> Doing /music stop will make the bot leave the voice channel it was playing music in.`})
        .addFields({name: `/music volume`, value: `<:ReplyIcon:1134120277157089301> While doing /music volume, enter in the volume percent`})
        .addFields({name: `/music skip`, value: `<:ReplyIcon:1134120277157089301> Doing /music skip will skip the current song, if there is none in queue, the current song cannot be skipped.`})
        .addFields({name: `/rps`, value: `<:ReplyIcon:1134120277157089301> While doing /rps, choose an opponent to go up against in a game of Rock, Paper, Scissors!`})
        .addFields({name: `/snake`, value: `<:ReplyContinuedIcon:1134120279346520195> Doing /snake, will bring up a snake game.\n<:ReplyIcon:1134120277157089301> This command brings up the snake game for you to play and enjoy.`})
        .addFields({name: `/wordle`, value: `<:ReplyContinuedIcon:1134120279346520195> Doing /wordle will bring up a wordle prompt.\n<:ReplyIcon:1134120277157089301> You are given 6 attempts to try and guess your word.`})
        .addFields({name: `/wouldyourather`, value: `<:ReplyIcon:1134120277157089301> Doing /wouldyourather will bring up a question to which you decide on would you rather.`})
        .setFooter({text: `All about fun! Section`})
        .setTimestamp()

        const embed4 = new EmbedBuilder()
        .setColor(`Orange`)
        .setTitle(`Help Center`)
        .setDescription(`Premium Section\n<:ReplyLineIcon:1140041677000691823>\n<:ReplyContinuedIcon:1134120279346520195> This section is a section for people who own premium.\n<:ReplyIcon:1134120277157089301> Do /premium-faq to learn how to get premium.`)
        .addFields({name: `/booster-annoucement set`, value: `<:ReplyIcon:1134120277157089301> While doing /booster-annoucement set, enter in the public channel for all to see and also set a logs channel for the moderation team to view details of who boosted. `})
        .addFields({name: `/booster-annoucement disable`, value: `<:ReplyIcon:1134120277157089301> Doing /booster-annoucement disable will disable your current booster annoucement system.`})
        .addFields({name: `/give-xp`, value: `<:ReplyContinuedIcon:1134120279346520195> While doing /give-xp, enter in a username and the xp you want to give the user.\n<:ReplyIcon:1134120277157089301> This works if you are an administrator in a server.`})
        .addFields({name: `/music loop`, value: `<:ReplyIcon:1134120277157089301> While doing /music loop, choose if you want to loop the queue, song or disable the loop.`})
        .addFields({name: `/music shuffle`, value: `<:ReplyIcon:1134120277157089301> Doing /music shuffle will shuffle the current queue order.`})
        .setFooter({text: `Premium Section`})
        .setTimestamp()

        const button = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setCustomId(`Page1`)
            .setLabel(`Page 1 | Community Access`)
            .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
            .setCustomId(`Page2`)
            .setLabel(`Page 2 | Moderation A-L`)
            .setStyle(ButtonStyle.Primary),
            
            new ButtonBuilder()
            .setCustomId(`Page3`)
            .setLabel(`Page 3 | Moderation M-Z`)
            .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
            .setCustomId(`Page4`)
            .setLabel(`Page 4 | All about Fun!`)
            .setStyle(ButtonStyle.Primary),

            new ButtonBuilder()
            .setCustomId(`Page5`)
            .setLabel(`Page 5 | Premium Only`)
            .setStyle(ButtonStyle.Primary),

        )

        const message = await interaction.reply({ embeds: [helpEmbed], components: [button]});
        const collector = await message.createMessageComponentCollector();

        collector.on(`collect`, async i => {
            if (i.customId === `Page1`) {
                if (i.user.id !== interaction.user.id) {
                    return await interaction.reply({ content: `You do not own this /help embed. Only ${interaction.user.tag} can use this. Do /help to look through the embed.`, ephemeral: true})
                }

                await i.update({ embeds: [embed1], components: [button]})
            }

            if (i.customId === `Page2`) {
                if (i.user.id !== interaction.user.id) {
                    return await interaction.reply({ content: `You do not own this /help embed. Only ${interaction.user.tag} can use this. Do /help to look through the embed.`, ephemeral: true})
                }

                await i.update({ embeds: [modEmbed1], components: [button]})
            }

            if (i.customId === `Page3`) {
                if (i.user.id !== interaction.user.id) {
                    return await interaction.reply({ content: `You do not own this /help embed. Only ${interaction.user.tag} can use this. Do /help to look through the embed.`, ephemeral: true})
                }

                await i.update({ embeds: [modEmbed2], components: [button]})
            }

            if (i.customId === `Page4`) {
                if (i.user.id !== interaction.user.id) {
                    return await interaction.reply({ content: `You do not own this /help embed. Only ${interaction.user.tag} can use this. Do /help to look through the embed.`, ephemeral: true})
                }

                await i.update({ embeds: [embed3], components: [button]})
            }

            if (i.customId === `Page5`) {
                if (i.user.id !== interaction.user.id) {
                    return await interaction.reply({ content: `You do not own this /help embed. Only ${interaction.user.tag} can use this. Do /help to look through the embed.`, ephemeral: true})
                }

                await i.update({ embeds: [embed4], components: [button]})
            }
        })
    }
}