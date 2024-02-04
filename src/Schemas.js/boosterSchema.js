const { model, Schema } = require('mongoose');

let boosterSchema = new Schema ({
  Guild : String,
  Channel1 : String,
  Channel2 : String,

});

module.exports = model('boosterSchema_x', boosterSchema);
