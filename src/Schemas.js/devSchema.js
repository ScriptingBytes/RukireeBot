const { model, Schema } = require(`mongoose`)

let devSchema = new Schema({
    UserID: String
})

module.exports = model("devSchema_x", devSchema);