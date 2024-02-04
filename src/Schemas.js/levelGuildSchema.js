const { model, Schema } = require(`mongoose`);

let levelGuildSchema = new Schema({
    Guild: String,
    AnnouncementChannelId: String,
})

module.exports = model(`levelGuildSchema_x`, levelGuildSchema);