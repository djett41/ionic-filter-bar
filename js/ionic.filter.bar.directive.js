(function (angular, document) {
  'use strict';

  angular.module('jett.ionic.filter.bar')
    .directive('ionFilterBar', [
      '$timeout',
      '$ionicGesture',
      '$ionicPlatform',
      function ($timeout, $ionicGesture, $ionicPlatform) {
        var filterBarTemplate;

        //create platform specific filterBar template using filterConfig items
        if ($ionicPlatform.is('android')) {
          filterBarTemplate =
            '<div class="filter-bar-wrapper filter-bar-{{::config.theme}} filter-bar-transition-{{::config.transition}}">' +
              '<div class="bar bar-header bar-{{::config.theme}} item-input-inset">' +
                '<button class="filter-bar-cancel button button-icon icon {{::config.back}}"></button>' +
                '<label class="item-input-wrapper">' +
                  '<input type="search" class="filter-bar-search" ng-model="data.filterText" placeholder="{{::config.placeholder}}" />' +
                  '<button class="filter-bar-clear button button-icon icon" ng-class="getClearButtonClass()"></button>' +
                '</label>' +
              '</div>' +
            '</div>';
        } else {
          filterBarTemplate =
            '<div class="filter-bar-wrapper filter-bar-{{::config.theme}} filter-bar-transition-{{::config.transition}}">' +
              '<div class="bar bar-header bar-{{::config.theme}} item-input-inset">' +
                '<label class="item-input-wrapper">' +
                  '<i class="icon {{::config.search}} placeholder-icon"></i>' +
                  '<input type="search" class="filter-bar-search" ng-model="data.filterText" placeholder="{{::config.placeholder}}"/>' +
                  '<button class="filter-bar-clear button button-icon icon" ng-class="getClearButtonClass()"></button>' +
                '</label>' +
                '<button class="filter-bar-cancel button button-clear" ng-bind-html="::cancelText"></button>' +
              '</div>' +
            '</div>';
        }

        return {
          restrict: 'E',
          scope: true,
          link: function ($scope, $element) {
            var el = $element[0];
            var clearEl = el.querySelector('.filter-bar-clear');
            var cancelEl = el.querySelector('.filter-bar-cancel');
            var inputEl = el.querySelector('.filter-bar-search');
            var filterTextTimeout;
            var swipeGesture;
            var backdrop;
            var backdropClick;
            var filterWatch;

            // Action when filter bar is cancelled via backdrop click/swipe or cancel/back buton click.
            // Invokes cancel function defined in filterBar service
            var cancelFilterBar = function () {
              $scope.cancelFilterBar();
            };

            // If backdrop is enabled, create and append it to filter, then add click/swipe listeners to cancel filter
            if ($scope.config.backdrop) {
              backdrop = angular.element('<div class="filter-bar-backdrop"></div>');
              $element.append(backdrop);

              backdropClick = function(e) {
                if (e.target == backdrop[0]) {
                  cancelFilterBar();
                }
              };

              backdrop.bind('click', backdropClick);
              swipeGesture = $ionicGesture.on('swipe', backdropClick, backdrop);
            }

            //Sure we could have had 1 function that also checked for favoritesEnabled.. but no need to keep checking a var that wont change
            if ($scope.favoritesEnabled) {
              $scope.getClearButtonClass = function () {
                return $scope.data.filterText.length ? $scope.config.clear : $scope.config.favorite;
              }
            } else {
              $scope.getClearButtonClass = function () {
                return $scope.data.filterText.length ? $scope.config.clear : 'filter-bar-element-hide';
              }
            }

            // When clear button is clicked, clear filterText, hide clear button, show backdrop, and focus the input
            var clearClick = function () {
              if (clearEl.classList.contains($scope.config.favorite)) {
                $scope.showModal();
              } else {
                $timeout(function () {
                  $scope.data.filterText = '';
                  ionic.requestAnimationFrame(function () {
                    $scope.showBackdrop();
                    $scope.scrollItemsTop();
                    $scope.focusInput();
                  });
                });
              }
            };

            // Bind touchstart so we can regain focus of input even while scrolling
            var inputClick = function () {
              $scope.scrollItemsTop();
              $scope.focusInput();
            };

            // When a non escape key is pressed, show/hide backdrop/clear button based on filterText length
            var keyUp = function(e) {
              if (e.which == 27) {
                cancelFilterBar();
              } else if ($scope.data.filterText && $scope.data.filterText.length) {
                $scope.hideBackdrop();
              } else {
                $scope.showBackdrop();
              }
            };

            //Event Listeners
            cancelEl.addEventListener('click', cancelFilterBar);
            // Since we are wrapping with label, need to bind touchstart rather than click.
            // Even if we use div instead of label need to bind touchstart.  Click isn't allowing input to regain focus quickly
            clearEl.addEventListener('touchstart', clearClick);
            clearEl.addEventListener('mousedown', clearClick);

            inputEl.addEventListener('touchstart', inputClick);
            inputEl.addEventListener('mousedown', inputClick);

            document.addEventListener('keyup', keyUp);

            // Calls the services filterItems function with the filterText to filter items
            var filterItems = function () {
              $scope.filterItems($scope.data.filterText);
            };

            // Clean up when scope is destroyed
            $scope.$on('$destroy', function() {
              $element.remove();
              document.removeEventListener('keyup', keyUp);
              if (backdrop) {
                $ionicGesture.off(swipeGesture, 'swipe', backdropClick);
              }
              filterWatch();
            });

            // Watch for changes on filterText and call filterItems when filterText has changed.
            // If debounce is enabled, filter items by the specified or default delay.
            // Prefer timeout debounce over ng-model-options so if filterText is cleared, initial items show up right away with no delay
            filterWatch = $scope.$watch('data.filterText', function (newFilterText, oldFilterText) {
              var delay;

              if (filterTextTimeout) {
                $timeout.cancel(filterTextTimeout);
              }

              if (newFilterText !== oldFilterText) {
                delay = (newFilterText.length && $scope.debounce) ? $scope.delay : 0;
                filterTextTimeout = $timeout(filterItems, delay, false);
              }
            });
          },
          template: filterBarTemplate
        };
      }]);

})(angular, document);
