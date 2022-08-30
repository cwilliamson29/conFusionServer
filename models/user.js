var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportlocalMongoose = require('passport-local-mongoose')

var User = new Schema({
      admin: {
            type: Boolean,
            default: false,
      },
});

User.plugin(passportlocalMongoose);

module.exports = mongoose.model("user", User);