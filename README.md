Ionic Filter Bar
===================

Filter Bar plugin for the Ionic Framework.  MORE COMPLETE DOCS SOON :-/

## Install

`bower install ionic-filter-bar`

## Usage

### JavaScript

Include `dist/ionic.filter.bar.js` in your index.html or grunt/gulp or usemin configuration.
Add `jett.ionic.filter.bar` as a module dependency of your app module.


### CSS

Include `dist/ionic.filter.bar.css` in your index.html or grunt/gulp or usemin configuration.


### SASS Overrides

Include `scss/ionic.filter.bar.scss` in your main scss file above any custom filter bar scss styles.  You will also
need to import the ionic scss before including `ionic.filter.bar.scss`

### Controller and Configuration Usage

View The controller/configuration Demo at demo/ for an example of configuring and using the filterBar.  To run the demo
clone the ionic-filter-bar repo, then navigate to the demo/ directory and run the following

    npm install
    bower install
    gulp

## Configuration

  You can override the default look and feel by injecting `$ionicFilterBarConfigProvider` into your modules config.
  (See demo for example).

  $ionicFilterBarConfigProvider#filterBar.theme -  Which ionic theme or color options to use. Default `stable`.

  @param {string} value Ionic color option.

  `platform`: Dynamically choose the correct theme depending on the platform the app is running from. If the
  platform is `ios`, it will default to `stable`.  If the platform is `android`, it will default to `light`.
  If the platform is not `ios` or `android`, it will default to `stable`.

  - `light`: Style the filterBar with the light theme
  - `stable`: Style the filterBar with the stable theme
  - `positive`: Style the filterBar with the positive theme
  - `calm`: Style the filterBar with the calm theme
  - `balanced`: Style the filterBar with the balanced theme
  - `energized`: Style the filterBar with the energized theme
  - `assertive`: Style the filterBar with the assertive theme
  - `royal`: Style the filterBar with the royal theme
  - `dark`: Style the filterBar with the dark theme

  @returns {string} value


  $ionicFilterBarConfigProvider#filterBar.clear - filterBar Clear button icon used to clear filter input

  @param {string} value Android defaults to `ion-android-close` and iOS defaults to `ion-ios-close`.

  @returns {string}


  $ionicFilterBarConfigProvider#filterBar.search -  filterBar Search placeholder icon shown inside input only
  for iOS

  @param {string} value iOS defaults to `ion-ios-search-strong`.  Android doesn't show placeholder icons

  @returns {string}


  $ionicFilterBarConfigProvider#filterBar.backdrop - filterBar backdrop which is shown when filter text is empty

  @param {boolean} value Android defaults to `false` and iOS defaults to `true`.

  @returns {boolean}


  $ionicFilterBarConfigProvider#filterBar.transition - transition used when filterBar is shown over the header bar

  @param {string} value Android defaults to `horizontal` and iOS defaults to `vertical`.

  `platform`: Dynamically choose the correct transition depending on the platform the app is running from.
  If the platform is `ios`, it will default to `vertical`.  If the platform is `android`, it will default
  to `horizontal`. If the platform is not `ios` or `android`, it will default to `vertical`.

  @returns {string}


## API Docs

  $ionicFilterBar#show

  Load and return a new filter bar.  A new isolated scope will be created for the filter bar and the new filter bar
  will be appended to the body, covering the header bar.
         
  @param {object} options The options for the filterBar. Properties:
         
  - `[Object]` `items` The array of items to filter.  When the filterBar is cancelled or removed, the original
              list of items will be passed to the update callback.
  - `{function=}` `update` Called after the items are filtered.  The new filtered items will be passed
              to this function which can be used to update the items on your controller's scope.
  - `{function=}` `cancel` Called after the filterBar is removed.  This can happen when the cancel
              button is pressed, the backdrop is tapped or swiped, or the back button is pressed.
  - `{function=}` `done` Called after the filterBar is shown.
  - `{object=}` `scrollDelegate` An $ionicScrollDelegate instance for controlling the items scrollView.
              The default value is $ionicScrollDelegate, however you can pass in a more specific scroll delegate,
              for example $ionicScrollDelegate.$getByHandle('myScrollDelegate').
  - `{object=}` `filter` The filter object used to filter the items array.  The default value is
              $filter('filter'), however you can also pass in a custom filter.
  - `[String]` `filterProperties` A string or string array of object properties that will be used to create a
              filter expression object for filtering items in the array.  All properties will be matched against the
              input filter text.  The default value is null, which will create a string filter expression.  The default
              string expression will be equal to the input filter text and will be matched against all properties
              including nested properties of the arrays items.
  - `{boolean=}` `debounce` Used to debounce input so that the filter function gets called at a specified delay,
              which can help boost performance while filtering.  Default value is false
              `{number=}` `delay` Number of milliseconds to delay filtering.  Default value is 300ms.  The debounce
              option must be set to true for this to take effect.
  - `{string=}` `cancelText` the text for the iOS only 'Cancel' button.  Default value is 'Cancel'.
  - `{boolean=}` `cancelOnStateChange` Whether to cancel the filterBar when navigating
              to a new state.  Default value is true.

  @returns {function} `hideFilterBar` A function which, when called, hides & cancels the filter bar.


