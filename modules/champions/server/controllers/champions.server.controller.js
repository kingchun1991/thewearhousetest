'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Champion = mongoose.model('Champion'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Champion
 */
exports.create = function(req, res) {
  var champion = new Champion(req.body);
  champion.user = req.user;

  champion.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(champion);
    }
  });
};

/**
 * Show the current Champion
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var champion = req.champion ? req.champion.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  champion.isCurrentUserOwner = req.user && champion.user && champion.user._id.toString() === req.user._id.toString();

  res.jsonp(champion);
};

/**
 * Update a Champion
 */
exports.update = function(req, res) {
  var champion = req.champion;

  champion = _.extend(champion, req.body);

  champion.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(champion);
    }
  });
};

/**
 * Delete an Champion
 */
exports.delete = function(req, res) {
  var champion = req.champion;

  champion.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(champion);
    }
  });
};

/**
 * List of Champions
 */
exports.list = function(req, res) {
  Champion.find().sort('-created').populate('user', 'displayName').exec(function(err, champions) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(champions);
    }
  });
};

/**
 * Champion middleware
 */
exports.championByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Champion is invalid'
    });
  }

  Champion.findById(id).populate('user', 'displayName').exec(function (err, champion) {
    if (err) {
      return next(err);
    } else if (!champion) {
      return res.status(404).send({
        message: 'No Champion with that identifier has been found'
      });
    }
    req.champion = champion;
    next();
  });
};
