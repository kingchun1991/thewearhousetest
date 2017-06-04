(function () {
  'use strict';

  // Champions controller
  angular
    .module('champions')
    .controller('ChampionsController', ChampionsController);

  ChampionsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'championResolve'];

  function ChampionsController ($scope, $state, $window, Authentication, champion) {
    var vm = this;

    vm.authentication = Authentication;
    vm.champion = champion;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Champion
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.champion.$remove($state.go('champions.list'));
      }
    }

    // Save Champion
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.championForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.champion._id) {
        vm.champion.$update(successCallback, errorCallback);
      } else {
        vm.champion.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('champions.view', {
          championId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
