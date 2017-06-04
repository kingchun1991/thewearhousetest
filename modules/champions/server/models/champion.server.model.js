'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Champion Schema
 */
var ChampionSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Champion name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Champion', ChampionSchema);
