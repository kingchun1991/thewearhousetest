'use strict';

/**
 * Module dependencies
 */
var championsPolicy = require('../policies/champions.server.policy'),
  champions = require('../controllers/champions.server.controller');

module.exports = function(app) {
  // Champions Routes
  app.route('/api/champions').all(championsPolicy.isAllowed)
    .get(champions.list)
    .post(champions.create);

  app.route('/api/champions/:championId').all(championsPolicy.isAllowed)
    .get(champions.read)
    .put(champions.update)
    .delete(champions.delete);

  // Finish by binding the Champion middleware
  app.param('championId', champions.championByID);
};
