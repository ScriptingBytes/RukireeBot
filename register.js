const { REST } = require("@discordjs/rest");
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const client = require('./src/index')

const clientId = process.env.clientId; 

const commandFolders = fs.readdirSync('./src/commands')
const path = './src/commands';

        client.commandArray = [];

        for (folder of commandFolders) {
            if (!fs.lstatSync(`${path}/${folder}`).isDirectory()) continue;
            const commandFiles = fs.readdirSync(`${path}/${folder}`).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                console.log(`\x1b[34mReading ${file} ...\x1b[0m`)
                const command = require(`./src/commands/${folder}/${file}`);
                client.commandArray.push(command.data.toJSON());
                console.log(`\x1b[32mSuccessfully read ${file}\x1b[0m`)
            }
        }

        const rest = new REST({
            version: '9'
        }).setToken(process.env.token);

        (async () => {
            try {
                await rest.put(
                    Routes.applicationCommands(clientId), {
                        body: client.commandArray
                    },
                );

                console.log('Successfully reloaded application (/) commands.');
            } catch (error) {
                console.error(error);
            }
            
        })();