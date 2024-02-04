const { model, Schema } = require(`mongoose`)

let leave = new Schema({
    Guild: String,
    Channel: String,
    Message: String,
    Reaction: String
})

module.exports = model(`leaveSchema`, leave);