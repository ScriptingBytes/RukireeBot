const { Wordle } = require('discord-gamecord');
const { SlashCommandBuilder } = require('discord.js');
 
module.exports = {
    data: new SlashCommandBuilder()
    .setName('wordle')
    .setDescription(`Play the wordle game!`),
    async execute (interaction) {
 
        const Game = new Wordle({
            message: interaction,
            isSlashGame: false,
            embed: {
                title: `Wordle`,
                color: '#F58216'
            },
            customWord: null,
            timeoutTime: 60000,
            winMessage: 'You won! The word was **{word}**',
            loseMessage: 'You lost! The word was **{word}**',
            playerOnlyMessage: 'Only {player} can use these buttons'
        });
 
        Game.startGame();
        Game.on('gameOver', result => {
            return;
        })
    }
}