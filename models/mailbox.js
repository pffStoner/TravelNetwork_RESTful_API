const mongoose = require("mongoose");

const mailboxSchema = mongoose.Schema({
 
    title: { type: String, require: false },
    date: { type: String, require: false },
    content: { type: String, require: false },
    username: { type: String, require: false }

});

module.exports = mongoose.model("MailBox", mailboxSchema);