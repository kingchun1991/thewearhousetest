(function () {
  'use strict';

  angular
    .module('champions')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('champions', {
        abstract: true,
        url: '/champions',
        template: '<ui-view/>'
      })
      .state('champions.list', {
        url: '',
        templateUrl: 'modules/champions/client/views/list-champions.client.view.html',
        controller: 'ChampionsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Champions List'
        }
      })
      .state('champions.create', {
        url: '/create',
        templateUrl: 'modules/champions/client/views/form-champion.client.view.html',
        controller: 'ChampionsController',
        controllerAs: 'vm',
        resolve: {
          championResolve: newChampion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Champions Create'
        }
      })
      .state('champions.edit', {
        url: '/:championId/edit',
        templateUrl: 'modules/champions/client/views/form-champion.client.view.html',
        controller: 'ChampionsController',
        controllerAs: 'vm',
        resolve: {
          championResolve: getChampion
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Champion {{ championResolve.name }}'
        }
      })
      .state('champions.view', {
        url: '/:championId',
        templateUrl: 'modules/champions/client/views/view-champion.client.view.html',
        controller: 'ChampionsController',
        controllerAs: 'vm',
        resolve: {
          championResolve: getChampion
        },
        data: {
          pageTitle: 'Champion {{ championResolve.name }}'
        }
      });
  }

  getChampion.$inject = ['$stateParams', 'ChampionsService'];

  function getChampion($stateParams, ChampionsService) {
    return ChampionsService.get({
      championId: $stateParams.championId
    }).$promise;
  }

  newChampion.$inject = ['ChampionsService'];

  function newChampion(ChampionsService) {
    return new ChampionsService();
  }
}());
