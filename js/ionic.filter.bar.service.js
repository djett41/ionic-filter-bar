/**
 * @ngdoc service
 * @name $ionicFilterBar
 * @module ionic
 * @description
 * The Filter Bar is an animated bar that allows a user to search or filter an array of items.
 *
 *
 * There are multiple ways to cancel the filter bar, such as tapping or swiping the backdrop, clicking the back or cancel
 * button, or even hitting escape on the keyboard for desktop testing.
 *
 * ![Filter Bar](http://ionicframework.com.s3.amazonaws.com/docs/controllers/actionSheet.gif)
 *
 * @usage
 * To trigger the filterBar, use the $ionicFilterBar service in your angular controllers:
 *
 * ```js
 * angular.module('myApp', ['ionic'])
 * .controller(function($scope, $ionicFilterBar, $timeout, $filter, $ionicScrollDelegate) {
 *
 *  var scrollDelegate = $ionicScrollDelegate.$getByHandle('myScrollDelegate');
 *  var hideFilterBar;
 *
 *   $scope.items = [
 *       {id: 1, displayName: 'First Item', rickets: 344},
 *       {id: 2, displayName: 'Second Item', rickets: 233},
 *       {id: 3, displayName: 'Third Item', rickets: 122},
 *       {id: 4, displayName: 'Fourth Item', rickets: 763},
 *       {id: 5, displayName: 'Fifth Item', rickets: 233},
 *       {id: 6, displayName: 'Sixth Item', rickets: 122},
 *       {id: 7, displayName: 'Seventh Item', rickets: 763}
 *   ];
 *
 *  // Triggered on a button click, or some other target
 *  $scope.show = function() {
 *
 *    // Show the filter bar
 *    hideFilterBar = $ionicFilterBar.show({
 *      items: $scope.items,
 *      update: function(filteredItems) {
 *          // update your list with the filteredItems
 *          $scope.items = filteredItems;
 *      },
 *      cancel: function() {
 *          // add cancel callback code..
 *      },
 *      done: function() {
 *          // add done callback code..
 *      },
 *      scrollDelegate: scrollDelegate,
 *      filter: $filter('myCustomFilter'),
 *      filterProperties: 'displayName',
 *      debounce: true,
 *      delay: 400
 *    });
 *  };
 *
 *  // If you ever need to cancel the filterBar manually, invoke the return function
 *  $scope.cancelFilterBar = function () {
 *    hideFilterBar();
 *  }
 * });
 * ```
 *
 */
(function (angular) {
  'use strict';

  angular.module('jett.ionic.filter.bar')
    .factory('$ionicFilterBar', [
      '$rootScope',
      '$compile',
      '$timeout',
      '$filter',
      '$ionicPlatform',
      '$ionicFilterBarConfig',
      '$ionicConfig',
      '$ionicBody',
      '$ionicScrollDelegate',
      function ($rootScope, $compile, $timeout, $filter, $ionicPlatform, $ionicFilterBarConfig, $ionicConfig, $ionicBody, $ionicScrollDelegate) {
        var isShown = false;

        var templateConfig = {
          theme: $ionicFilterBarConfig.theme(),
          transition: $ionicFilterBarConfig.transition(),
          back: $ionicConfig.backButton.icon(),
          clear: $ionicFilterBarConfig.clear(),
          search: $ionicFilterBarConfig.search(),
          backdrop: $ionicFilterBarConfig.backdrop()
        };

        return {
          show: filterBar
        };

        /**
         * @ngdoc method
         * @name $ionicFilterBar#show
         * @description
         * Load and return a new filter bar.
         *
         * A new isolated scope will be created for the
         * filter bar and the new filter bar will be appended to the body, covering the header bar.
         *
         * @param {object} options The options for the filterBar. Properties:
         *
         *  - `[Object]` `items` The array of items to filter.  When the filterBar is cancelled or removed, the original
         *     list of items will be passed to the update callback.
         *  - `{function=}` `update` Called after the items are filtered.  The new filtered items will be passed
         *     to this function which can be used to update the items on your controller's scope.
         *  - `{function=}` `cancel` Called after the filterBar is removed.  This can happen when the cancel
         *     button is pressed, the backdrop is tapped or swiped, or the back button is pressed.
         *  - `{function=}` `done` Called after the filterBar is shown.
         *  - `{object=}` `scrollDelegate` An $ionicScrollDelegate instance for controlling the items scrollView.
         *     The default value is $ionicScrollDelegate, however you can pass in a more specific scroll delegate,
         *     for example $ionicScrollDelegate.$getByHandle('myScrollDelegate').
         *  - `{object=}` `filter` The filter object used to filter the items array.  The default value is
         *     $filter('filter'), however you can also pass in a custom filter.
         *  - `[String]` `filterProperties` A string or string array of object properties that will be used to create a
         *     filter expression object for filtering items in the array.  All properties will be matched against the
         *     input filter text.  The default value is null, which will create a string filter expression.  The default
         *     string expression will be equal to the input filter text and will be matched against all properties
         *     including nested properties of the arrays items.
         *  - `{boolean=}` `debounce` Used to debounce input so that the filter function gets called at a specified delay,
         *     which can help boost performance while filtering.  Default value is false
         *    `{number=}` `delay` Number of milliseconds to delay filtering.  Default value is 300ms.  The debounce
         *     option must be set to true for this to take effect.
         *  - `{string=}` `cancelText` the text for the iOS only 'Cancel' button.  Default value is 'Cancel'.
         *  - `{boolean=}` `cancelOnStateChange` Whether to cancel the filterBar when navigating
         *     to a new state.  Default value is true.
         *
         * @returns {function} `hideFilterBar` A function which, when called, hides & cancels the filter bar.
         */
        function filterBar (opts) {
          //if filterBar is already shown return
          if (isShown) {
            return;
          }

          isShown = true;
          opts = opts || {};

          var scope = $rootScope.$new(true);
          var backdropShown = false;
          var isKeyboardShown = false;

          //extend scope defaults with supplied options
          angular.extend(scope, {
            config: templateConfig,
            $deregisterBackButton: angular.noop,
            update: angular.noop,
            cancel: angular.noop,
            done: angular.noop,
            scrollDelegate: $ionicScrollDelegate,
            filter: $filter('filter'),
            filterProperties: null,
            debounce: true,
            delay: 300,
            cancelText: 'Cancel',
            cancelOnStateChange: true
          }, opts);

          // Compile the template
          var element = scope.element = $compile('<ion-filter-bar class="filter-bar"></ion-filter-bar>')(scope);

          // Grab required jQLite elements
          var filterWrapperEl = element.children().eq(0);
          var input = filterWrapperEl.find('input')[0];
          var backdropEl = element.children().eq(1);

          //get scrollView
          var scrollView = scope.scrollDelegate.getScrollView();
          var canScroll = !!scrollView;

          //get the scroll container if scrolling is available
          var $scrollContainer;
          if (canScroll) {
            $scrollContainer = angular.element(scrollView.__container);
          }

          var stateChangeListenDone = scope.cancelOnStateChange ?
            $rootScope.$on('$stateChangeSuccess', function() { scope.cancelFilterBar(); }) :
            angular.noop;

          // Focus the input which will show the keyboard.
          var showKeyboard = function () {
            if (!isKeyboardShown) {
              isKeyboardShown = true;
              input && input.focus();
            }
          };

          // Blur the input which will hide the keyboard.
          // Even if we need to bring in ionic.keyboard in the future, blur is preferred for iOS so keyboard animates out.
          var hideKeyboard = function () {
            if (isKeyboardShown) {
              isKeyboardShown = false;
              input && input.blur();
            }
          };

          // When the filtered list is scrolled, we want to hide the keyboard as long as it's not already hidden
          var handleScroll = function () {
            if (scrollView.__scrollTop > 0) {
              hideKeyboard();
            }
          };

          // Scrolls the list of items to the top via the scroll delegate
          scope.scrollItemsTop = function () {
            canScroll && scope.scrollDelegate.scrollTop && scope.scrollDelegate.scrollTop();
          };

          // Set isKeyboardShown to force showing keyboard on search focus.
          scope.focusInput = function () {
            isKeyboardShown = false;
            showKeyboard();
          };

          // Hide the filterBar backdrop if in the DOM and not already hidden.
          scope.hideBackdrop = function () {
            if (backdropEl.length && backdropShown) {
              backdropShown = false;
              backdropEl.removeClass('active');
            }
          };

          // Show the filterBar backdrop if in the DOM and not already shown.
          scope.showBackdrop = function () {
            if (backdropEl.length && !backdropShown) {
              backdropShown = true;
              backdropEl.addClass('active');
            }
          };

          // Filters the supplied list of items via the supplied filterText.
          // How items are filtered depends on the supplied filter object, and expression
          // Filtered items will be sent to update
          scope.filterItems = function(filterText) {
            var filterExp, filteredItems;

            // pass back original list if filterText is empty.  Otherwise filter by supplied properties, or filterText
            if (!filterText.length) {
              filteredItems = scope.items;
            } else {
              if (angular.isArray(scope.filterProperties)) {
                filterExp = {};
                angular.forEach(scope.filterProperties, function (property) {
                  filterExp[property] = filterText;
                });
              } else if (scope.filterProperties) {
                filterExp = {};
                filterExp[scope.filterProperties] = filterText;
              } else {
                filterExp = filterText;
              }

              filteredItems = scope.filter(scope.items, filterExp);
            }

            $timeout(function() {
              scope.update(filteredItems);
              scope.scrollItemsTop();
            });
          };

          // registerBackButtonAction returns a callback to deregister the action
          scope.$deregisterBackButton = $ionicPlatform.registerBackButtonAction(
            function() {
              $timeout(scope.cancelFilterBar);
            }, 300
          );

          // Removes the filterBar from the body and cleans up vars/events.  Once the backdrop is hidden we can invoke done
          scope.removeFilterBar = function(done) {
            if (scope.removed) return;

            scope.removed = true;

            //animate the filterBar out, hide keyboard and backdrop
            ionic.requestAnimationFrame(function () {
              filterWrapperEl.removeClass('filter-bar-in');
              hideKeyboard();
              scope.hideBackdrop();

              //Wait before cleaning up so element isn't removed before filter bar animates out
              $timeout(function () {
                scope.scrollItemsTop();
                scope.update(scope.items);

                scope.$destroy();
                element.remove();
                scope.cancelFilterBar.$scope = $scrollContainer = scrollView = filterWrapperEl = backdropEl = input = null;
                isShown = false;
                (done || angular.noop)();
              }, 350);
            });

            $timeout(function () {
              // wait to remove this due to a 300ms delay native
              // click which would trigging whatever was underneath this
              $ionicBody.removeClass('filter-bar-open');
            }, 400);

            scope.$deregisterBackButton();
            stateChangeListenDone();

            //unbind scroll event
            if (canScroll) {
              $scrollContainer.off('scroll', handleScroll);
            }
          };

          // Appends the filterBar to the body.  Once the backdrop is hidden we can invoke done
          scope.showFilterBar = function(done) {
            if (scope.removed) return;

            $ionicBody.append(element).addClass('filter-bar-open');

            //scroll items to the top before starting the animation
            scope.scrollItemsTop();

            //start filterBar animation, show backrop and focus the input
            ionic.requestAnimationFrame(function () {
              if (scope.removed) return;

              $timeout(function () {
                filterWrapperEl.addClass('filter-bar-in');
                scope.focusInput();
                scope.showBackdrop();
                (done || angular.noop)();
              }, 20, false);
            });

            if (canScroll) {
              $scrollContainer.on('scroll', handleScroll);
            }
          };

          // called when the user presses the backdrop, cancel/back button, changes state
          scope.cancelFilterBar = function() {
            // after the animation is out, call the cancel callback
            scope.removeFilterBar(scope.cancel);
          };

          scope.showFilterBar(scope.done);

          // Expose the scope on $ionFilterBar's return value for the sake of testing it.
          scope.cancelFilterBar.$scope = scope;

          return scope.cancelFilterBar;
        }
      }]);


})(angular);
