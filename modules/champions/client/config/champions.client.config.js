(function () {
  'use strict';

  angular
    .module('champions')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Champions',
      state: 'champions',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'champions', {
      title: 'List Champions',
      state: 'champions.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'champions', {
      title: 'Create Champion',
      state: 'champions.create',
      roles: ['user']
    });
  }
}());
