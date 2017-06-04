(function () {
  'use strict';

  describe('Champions Controller Tests', function () {
    // Initialize global variables
    var ChampionsController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      ChampionsService,
      mockChampion;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _ChampionsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      ChampionsService = _ChampionsService_;

      // create mock Champion
      mockChampion = new ChampionsService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Champion Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Champions controller.
      ChampionsController = $controller('ChampionsController as vm', {
        $scope: $scope,
        championResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleChampionPostData;

      beforeEach(function () {
        // Create a sample Champion object
        sampleChampionPostData = new ChampionsService({
          name: 'Champion Name'
        });

        $scope.vm.champion = sampleChampionPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ChampionsService) {
        // Set POST response
        $httpBackend.expectPOST('api/champions', sampleChampionPostData).respond(mockChampion);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Champion was created
        expect($state.go).toHaveBeenCalledWith('champions.view', {
          championId: mockChampion._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/champions', sampleChampionPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Champion in $scope
        $scope.vm.champion = mockChampion;
      });

      it('should update a valid Champion', inject(function (ChampionsService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/champions\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('champions.view', {
          championId: mockChampion._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (ChampionsService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/champions\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Champions
        $scope.vm.champion = mockChampion;
      });

      it('should delete the Champion and redirect to Champions', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/champions\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('champions.list');
      });

      it('should should not delete the Champion and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
