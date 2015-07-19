(function (angular) {
  'use strict';

  angular.module('jett.ionic.filter.bar')
    .directive('ionFilterBar', [
      '$document',
      '$timeout',
      '$ionicGesture',
      '$ionicPlatform',
      function ($document, $timeout, $ionicGesture, $ionicPlatform) {
        var filterBarTemplate;

        //create platform specific filterBar template using filterConfig items
        if ($ionicPlatform.is('android')) {
          filterBarTemplate =
            '<div class="filter-bar-wrapper filter-bar-{{::config.theme}} filter-bar-transition-{{::config.transition}}">' +
              '<div class="bar bar-header bar-{{::config.theme}} item-input-inset">' +
                '<button class="filter-bar-cancel button button-icon icon {{::config.back}}"></button>' +
                '<label class="item-input-wrapper">' +
                  '<input type="search" class="filter-bar-search" ng-model="filterText" placeholder="{{::config.placeholder}}" />' +
                  '<button style="display:none;" class="filter-bar-clear button button-icon icon {{::config.clear}}"></button>' +
                '</label>' +
              '</div>' +
            '</div>';
        } else {
          filterBarTemplate =
            '<div class="filter-bar-wrapper filter-bar-{{::config.theme}} filter-bar-transition-{{::config.transition}}">' +
              '<div class="bar bar-header bar-{{::config.theme}} item-input-inset">' +
                '<label class="item-input-wrapper">' +
                  '<i class="icon {{::config.search}} placeholder-icon"></i>' +
                  '<input type="search" class="filter-bar-search" ng-model="filterText" placeholder="{{::config.placeholder}}"/>' +
                  '<button style="display:none;" class="filter-bar-clear button button-icon icon {{::config.clear}}"></button>' +
                '</label>' +
                '<button class="filter-bar-cancel button button-clear" ng-bind-html="::cancelText"></button>' +
              '</div>' +
            '</div>';
        }

        return {
          restrict: 'E',
          scope: true,
          link: function ($scope, $element) {
            var clearEl = angular.element($element[0].querySelector('.filter-bar-clear'));
            var cancelEl = angular.element($element[0].querySelector('.filter-bar-cancel'));
            var inputEl = $element.find('input');
            var filterTextTimeout;
            var swipeGesture;
            var backdrop;
            var backdropClick;
            var filterWatch;

            $scope.filterText = '';

            // Action when filter bar is cancelled via backdrop click/swipe or cancel/back buton click.
            // Invokes cancel function defined in filterBar service
            var cancelFilterBar = function () {
              $scope.cancelFilterBar();
            };

            cancelEl.bind('click', cancelFilterBar);

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

            // No need to hide/show clear button via ng-show since we can easily do this with jqLite.  inline is fastest
            var showClearButton = function () {
              if(clearEl.css('display') === 'none') {
                clearEl.css('display', 'block');
              }
            };
            var hideClearButton = function () {
              if(clearEl.css('display') === 'block') {
                clearEl.css('display', 'none');
              }
            };

            // When clear button is clicked, clear filterText, hide clear button, show backdrop, and focus the input
            var clearClick = function () {
              $timeout(function () {
                $scope.filterText = '';
                hideClearButton();
                ionic.requestAnimationFrame(function () {
                  $scope.showBackdrop();
                  $scope.scrollItemsTop();
                  $scope.focusInput();
                });
              });
            };

            // Since we are wrapping with label, need to bind touchstart rather than click.
            // Even if we use div instead of label need to bind touchstart.  Click isn't allowing input to regain focus quickly
            clearEl.bind('touchstart mousedown', clearClick);

            // Bind touchstart so we can regain focus of input even while scrolling
            inputEl.bind('touchstart mousedown', function () {
              $scope.scrollItemsTop();
              $scope.focusInput();
            });

            // When a non escape key is pressed, show/hide backdrop/clear button based on filterText length
            var keyUp = function(e) {
              if (e.which == 27) {
                cancelFilterBar();
              } else if ($scope.filterText && $scope.filterText.length) {
                showClearButton();
                $scope.hideBackdrop();
              } else {
                hideClearButton();
                $scope.showBackdrop();
              }
            };

            $document.bind('keyup', keyUp);

            // Calls the services filterItems function with the filterText to filter items
            var filterItems = function () {
              $scope.filterItems($scope.filterText);
            };

            // Clean up when scope is destroyed
            $scope.$on('$destroy', function() {
              $element.remove();
              $document.unbind('keyup', keyUp);
              if (backdrop) {
                $ionicGesture.off(swipeGesture, 'swipe', backdropClick);
              }
              filterWatch();
            });

            // Watch for changes on filterText and call filterItems when filterText has changed.
            // If debounce is enabled, filter items by the specified or default delay.
            // Prefer timeout debounce over ng-model-options so if filterText is cleared, initial items show up right away with no delay
            filterWatch = $scope.$watch('filterText', function (newFilterText, oldFilterText) {
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

})(angular);
