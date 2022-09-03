var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var passportlocalMongoose = require('passport-local-mongoose');

var favDishId = new Schema({
      dish: { type: mongoose.Schema.Types.ObjectId, ref: 'Dishes' }
})



var Favorites = new Schema({
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dishes' }]
}, {
      timestamps: true
})

module.exports = mongoose.model("Favorites", Favorites)