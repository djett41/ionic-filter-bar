/* global angular */
(function (angular) {
  'use strict';

  angular.module('jett.ionic.filter.bar')
    .controller('$ionicFilterBarModalCtrl', [
      '$window',
      '$scope',
      '$timeout',
      '$ionicListDelegate',
      function ($window, $scope, $timeout, $ionicListDelegate) {
        var searchesKey = $scope.$parent.favoritesKey;

        $scope.displayData = {showReorder: false};
        $scope.searches = angular.fromJson($window.localStorage.getItem(searchesKey)) || [];
        $scope.newItem = {text: ''};

        $scope.moveItem = function(item, fromIndex, toIndex) {
          item.reordered = true;
          $scope.searches.splice(fromIndex, 1);
          $scope.searches.splice(toIndex, 0, item);

          $timeout(function () {
            delete item.reordered;
          }, 500);
        };

        $scope.deleteItem = function(item) {
          var index = $scope.searches.indexOf(item);
          $scope.searches.splice(index, 1);
        };

        $scope.addItem = function () {
          if ($scope.newItem.text) {
            $scope.searches.push({
              text: $scope.newItem.text
            });
            $scope.newItem.text = '';
          }
        };

        $scope.closeModal = function () {
          $window.localStorage.setItem(searchesKey, angular.toJson($scope.searches));
          $scope.$parent.modal.remove();
        };

        $scope.itemClicked = function (filterText, $event) {
          var isOptionButtonsClosed = !!$event.currentTarget.querySelector('.item-options.invisible');

          if (isOptionButtonsClosed) {
            $scope.closeModal();
            $scope.$parent.hideBackdrop();
            $scope.$parent.data.filterText = filterText;
            $scope.$parent.filterItems(filterText);
          } else {
            $ionicListDelegate.$getByHandle('searches-list').closeOptionButtons();
          }
        };

      }]);

})(angular);
