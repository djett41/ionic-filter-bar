'use strict';

/**
 * @ngdoc overview
 * @name Demo
 * @description
 * # Initializes main application and routing
 *
 * Main module of the application.
 */


angular.module('Demo', ['ionic', 'jett.ionic.filter.bar'])

  .config(function($httpProvider, $stateProvider, $urlRouterProvider, $ionicFilterBarConfigProvider) {
    $stateProvider
      .state('app', {
        url: '/app',
        templateUrl: 'templates/main.html',
        controller: 'MainController'
      });
    $urlRouterProvider.otherwise('/app');

    //You can override the config such as the following

    $ionicFilterBarConfigProvider.theme('positive');
    /*
    $ionicFilterBarConfigProvider.clear('ion-close');
    $ionicFilterBarConfigProvider.search('ion-search');
    $ionicFilterBarConfigProvider.backdrop(false);
    $ionicFilterBarConfigProvider.transition('vertical');
    */
  })

  .controller('MainController', function($scope, $timeout, $ionicFilterBar) {

    var filterBarInstance;

    function getItems () {
      var items = [];
      for (var x = 1; x < 2000; x++) {
        items.push({text: 'This is item number ' + x + ' which is an ' + (x % 2 === 0 ? 'EVEN' : 'ODD') + ' number.'});
      }
      $scope.items = items;
    }

    getItems();

    $scope.showFilterBar = function () {
      filterBarInstance = $ionicFilterBar.show({
        items: $scope.items,
        update: function (filteredItems) {
          $scope.items = filteredItems;
        },
        filterProperties: 'text'
      });
    };

    $scope.refreshItems = function () {
      if (filterBarInstance) {
        filterBarInstance();
        filterBarInstance = null;
      }

      $timeout(function () {
        getItems();
        $scope.$broadcast('scroll.refreshComplete');
      }, 1000);
    };
  });


