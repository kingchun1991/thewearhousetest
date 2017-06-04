(function () {
  'use strict';

  describe('Champions Route Tests', function () {
    // Initialize global variables
    var $scope,
      ChampionsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ChampionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ChampionsService = _ChampionsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('champions');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/champions');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          ChampionsController,
          mockChampion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('champions.view');
          $templateCache.put('modules/champions/client/views/view-champion.client.view.html', '');

          // create mock Champion
          mockChampion = new ChampionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Champion Name'
          });

          // Initialize Controller
          ChampionsController = $controller('ChampionsController as vm', {
            $scope: $scope,
            championResolve: mockChampion
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:championId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.championResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            championId: 1
          })).toEqual('/champions/1');
        }));

        it('should attach an Champion to the controller scope', function () {
          expect($scope.vm.champion._id).toBe(mockChampion._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/champions/client/views/view-champion.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ChampionsController,
          mockChampion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('champions.create');
          $templateCache.put('modules/champions/client/views/form-champion.client.view.html', '');

          // create mock Champion
          mockChampion = new ChampionsService();

          // Initialize Controller
          ChampionsController = $controller('ChampionsController as vm', {
            $scope: $scope,
            championResolve: mockChampion
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.championResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/champions/create');
        }));

        it('should attach an Champion to the controller scope', function () {
          expect($scope.vm.champion._id).toBe(mockChampion._id);
          expect($scope.vm.champion._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/champions/client/views/form-champion.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ChampionsController,
          mockChampion;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('champions.edit');
          $templateCache.put('modules/champions/client/views/form-champion.client.view.html', '');

          // create mock Champion
          mockChampion = new ChampionsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Champion Name'
          });

          // Initialize Controller
          ChampionsController = $controller('ChampionsController as vm', {
            $scope: $scope,
            championResolve: mockChampion
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:championId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.championResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            championId: 1
          })).toEqual('/champions/1/edit');
        }));

        it('should attach an Champion to the controller scope', function () {
          expect($scope.vm.champion._id).toBe(mockChampion._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/champions/client/views/form-champion.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
