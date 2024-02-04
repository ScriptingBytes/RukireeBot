const { model, Schema} = require('mongoose')
 
let modlogSchema = new Schema({
    Guild: String,
    Channel: String,
})
 
module.exports = model("modLog_x", modlogSchema)