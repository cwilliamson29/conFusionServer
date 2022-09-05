const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchem = new Schema({
      rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
      },
      comment: {
            type: String,
            required: true,
      },
      author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
      },
      dish {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dishes'
      }
}, {
      timestamps: true
});

var Comments = mongoose.model('Comments', commentSchem);

module.exports = Comments;