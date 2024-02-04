const { model, Schema } = require(`mongoose`)

let blacklistSchema = new Schema({
    UserID: String
})

module.exports = model("blacklistSchema_x", blacklistSchema);