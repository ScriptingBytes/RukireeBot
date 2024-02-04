const { model, Schema } = require("mongoose");
 
let membervcSchema = new Schema({
    Guild: String,
    TotalChannel: String
})
 
module.exports = model("membervcSchema_x", membervcSchema);