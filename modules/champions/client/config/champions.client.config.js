'use strict';

angular.module('champions').run(['Menus', function (menu) {
  // Set top bar menu items
  menu.addMenuItem('topbar', {
    title: 'Brands',
    state: 'champions',
    type: 'dropdown',
    roles: ['*']
  });

  // Add the dropdown list item
  menu.addSubMenuItem('topbar', 'champions', {
    title: 'Champion',
    state: 'champions.list'
  });

  // Add the dropdown create item
  menu.addSubMenuItem('topbar', 'champions', {
    title: 'Create Champion',
    state: 'champions.create',
    roles: ['user']
  });
}]);
