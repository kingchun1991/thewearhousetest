'use strict';

angular
  .module('champions')
  .run(['Menus',function (menuService) {
      // Set top bar menu items
      menuService.addMenuItem('topbar', {
        title: 'Brands',
        state: 'champions',
        type: 'dropdown',
        roles: ['*']
      });

      // Add the dropdown list item
      menuService.addSubMenuItem('topbar', 'champions', {
        title: 'Champion',
        state: 'champions.list'
      });

      // Add the dropdown create item
      menuService.addSubMenuItem('topbar', 'champions', {
        title: 'Create Champion',
        state: 'champions.create',
        roles: ['user']
      });
    }
  ]);
