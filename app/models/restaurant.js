'use strict'

const mongoose = require('mongoose')

const restuarantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  pic_url: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  comments: {
    type: Array,
    default: []
  },
  _owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret, options) {
      const userId = (options.user && options.user._id) || false
      ret.editable = userId && userId.equals(doc._owner)
      return ret
    }
  }
})

const Restuarant = mongoose.model('Restuarant', restuarantSchema)

module.exports = Restuarant
