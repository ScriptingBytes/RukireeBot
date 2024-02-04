const { model, Schema } = require(`mongoose`);

let autoreact = new Schema({
    Guild: String,
    Channel: String,
    Emoji: String
})

module.exports = model(`autoreactionSchema_x`, autoreact)