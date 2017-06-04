(function () {
  'use strict';

  angular
    .module('champions')
    .controller('ChampionsListController', ChampionsListController);

  ChampionsListController.$inject = ['ChampionsService'];

  function ChampionsListController(ChampionsService) {
    var vm = this;

    vm.champions = ChampionsService.query();
  }
}());
