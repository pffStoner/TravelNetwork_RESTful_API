const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const mailboxSchema = mongoose.Schema({
 
  title: { type: String, require: false },
  date: { type: String, require: false },
  content: { type: String, require: false },
  username: { type: String, require: false }

});
const userSchema = mongoose.Schema({
  username: { type: String, require: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  taskList: [{
    name: { type: String, require: false },
    description: { type: String, require: false },
    eventId: { type: String, require: false }
  }]
});


userSchema.plugin(uniqueValidator);




module.exports = mongoose.model("MailBox", mailboxSchema);
module.exports = mongoose.model("User", userSchema);
