const mongoose = require(`mongoose`)
const mongodbURL = process.env.MONGODBURL;

const { ActivityType } = require(`discord.js`)

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {

      console.log('// Ready! //');

      if (!mongodbURL) return;
      await mongoose.connect(mongodbURL || ``,{
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      })

      if (mongoose.connect) {
        console.log(`// Database Connected //`)
      }
      
      console.log(`// Enabling Status //`);
      setInterval(() => {

        const totalMembers = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
        let status = [
          {
            name: `irrelavent`,
            state: `Listening to staff teams!`,
            type: ActivityType.Custom
          },
          {
            name: `irrelavent`,
            state: `👀 Looking out for commands!`,
            type: ActivityType.Custom
          },
          {
            name: `irrelavent`,
            state: `👀 Looking over ${totalMembers} users!`,
            type: ActivityType.Custom
          },
          {
            name: `irrelavent`,
            state: `❔ Need help? Run /help!`,
            type: ActivityType.Custom
          }
        ];

        let random = Math.floor(Math.random() * status.length);
        client.user.setActivity(status[random]);
      }, `25000`);
      
      console.log("// Successfully Enabled Status //");  
      console.log(`// Anti-Crash Enabled //`)
    },
};