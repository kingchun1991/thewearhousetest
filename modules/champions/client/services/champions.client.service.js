// Champions service used to communicate Champions REST endpoints
(function () {
  'use strict';

  angular
    .module('champions')
    .factory('ChampionsService', ChampionsService);

  ChampionsService.$inject = ['$resource'];

  function ChampionsService($resource) {
    return $resource('api/champions/:championId', {
      championId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
