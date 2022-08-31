var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportlocalMongoose = require('passport-local-mongoose')

var User = new Schema({
      firstname: {
            type: String,
            default: ''
      },
      lastname: {
            type: String,
            default: ''
      },
      admin: {
            type: Boolean,
            default: false,
      }
});

User.plugin(passportlocalMongoose);

module.exports = mongoose.model("User", User);