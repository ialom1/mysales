var mongoose = require('mongoose');

var Todo = mongoose.model('Todo', {
  pId: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  pName: {
    type: String,
    default: false
  },
  pQty: {
    type: Number,
    default: null
  },
  pPrice: {
    type: Number,
    default: null
  },
  _creator: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

module.exports = {Todo};