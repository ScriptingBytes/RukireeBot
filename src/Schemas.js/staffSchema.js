const { model, Schema } = require(`mongoose`);

let staffSchema = new Schema({
    UserID: String,
    Position: String
})

module.exports = model(`staffSchema_x`, staffSchema)