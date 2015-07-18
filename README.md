<img src="demo/resources/icon.png" align="left" height="72" width="72" >
Ionic Filter Bar
===================

A platform specific search filter plugin for the Ionic Framework

[Watch Demo](http://makeagif.com/i/EZ-klS)  |  Download from [Ionic View](http://view.ionic.io/), appId: ab56e8bd

===================
#### NOTE
On the Ionic View app, `KeyboardDisplayRequiresUserAction` is not being respected, therefore the autofocus
that brings the keyboard up right away does not work.  This will work however on a real device
or emulator as long as the proper configuration has been setup (see Config section)

## Suported Platforms

### iOS
<a href="url"><img src="demo/resources/screenshots/ios1.png" align="left" height="500" width="281" ></a>
<a href="url"><img src="demo/resources/screenshots/ios2.png" align="left" height="500" width="281" ></a>
<a href="url"><img src="demo/resources/screenshots/ios3.png" align="left" height="500" width="281" ></a>


### Android
<a href="url"><img src="demo/resources/screenshots/android1.png" align="left" height="500" width="281" ></a>
<a href="url"><img src="demo/resources/screenshots/android2.png" align="left" height="500" width="281" ></a>
<a href="url"><img src="demo/resources/screenshots/android3.png" align="left" height="500" width="281" ></a>

## Install

`bower install ionic-filter-bar`

## Usage

### Config

In order for Ionic Filter Bar to autofocus for iOS and bring the keyboard up when the filter bar animates in,
you will need to add the following to your config.xml

    <platform name="ios">
        <preference name="KeyboardDisplayRequiresUserAction" value="false"/>
    </platform>

I also recommend using the [ionic-plugin-keyboard](https://github.com/driftyco/ionic-plugin-keyboard) and
disabling scroll for the keyboard as well.  See the app.js in the Demo for an example on how to configure the Ionic
Keyboard in your module's run section.

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

## Configuration / API

  You can override the default look and feel by injecting `$ionicFilterBarConfigProvider` into your modules config.
  (See demo for example).

#### $ionicFilterBarConfigProvider.theme

  Allows you to override the ionic theme and color options used to style the filter bar.

  @param {string} value Ionic color option.

  By default the theme inherits the theme and color options of the ion-nav-bar (defaults to light theme).  For example,
  if you define a `bar-positive` class on you ion-nav-bar (see demo for example) then the filter bar will automatically
  have the filter-bar-positive styles.  If you would like to override this behavior and have a different theme for the
  filter bar, you can override the this by setting the theme to one of the following listed below.

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


#### $ionicFilterBarConfigProvider.clear

  filterBar Clear button icon used to clear filter input

  @param {string} value Android defaults to `ion-android-close` and iOS defaults to `ion-ios-close`.

  @returns {string}


#### $ionicFilterBarConfigProvider.search

  filterBar Search placeholder icon shown inside input only for iOS

  @param {string} value iOS defaults to `ion-ios-search-strong`.  Android doesn't show placeholder icons

  @returns {string}


#### $ionicFilterBarConfigProvider.backdrop

  filterBar backdrop which is shown when filter text is empty

  @param {boolean} value Android defaults to `false` and iOS defaults to `true`.

  @returns {boolean}


#### $ionicFilterBarConfigProvider.transition

  transition used when filterBar is shown over the header bar

  @param {string} value Android defaults to `horizontal` and iOS defaults to `vertical`.

  `platform`: Dynamically choose the correct transition depending on the platform the app is running from.
  If the platform is `ios`, it will default to `vertical`.  If the platform is `android`, it will default
  to `horizontal`. If the platform is not `ios` or `android`, it will default to `vertical`.

  @returns {string}


#### $ionicFilterBar.show

  Load and return a new filter bar.  A new isolated scope will be created for the filter bar and the new filter bar
  will be appended to the body, covering the header bar.

  @returns {function} `hideFilterBar` A function which, when called, hides & cancels the filter bar.

  @param {object} options The options for the filterBar. Properties:

         
  - `[Object]` `items`

    The array of items to filter.  When the filterBar is cancelled or removed, the original list of items will
    be passed to the update callback.


  - `{function=}` `update`

    Called after the items are filtered.  The new filtered items will be passed to this function which can be used
    to update the items on your controller's scope.


  - `{function=}` `cancel`

    Called after the filterBar is removed.  This can happen when the cancel button is pressed, the backdrop is
    tapped or swiped, or the back button is pressed.


  - `{function=}` `done`

    Called after the filterBar is shown.


  - `{object=}` `scrollDelegate`

    An $ionicScrollDelegate instance for controlling the items scrollView.  The default value is $ionicScrollDelegate,
    however you can pass in a more specific scroll delegate, for example
    $ionicScrollDelegate.$getByHandle('myScrollDelegate').


  - `{object=}` `filter`

    The filter object used to filter the items array.  The default value is $filter('filter'), however you can also
    pass in a custom filter.


  - `[String]` `filterProperties`

    A string or string array of object properties that will be used to create a filter expression object for
    filtering items in the array.  All properties will be matched against the input filter text.  The default value
    is null, which will create a string filter expression.  The default string expression will be equal to the input
    filter text and will be matched against all properties including nested properties of the arrays items.


  - `{boolean=}` `debounce`

     Used to debounce input so that the filter function gets called at a specified delay, which can help boost
     performance while filtering.  Default value is false

  - `{number=}` `delay`

    Number of milliseconds to delay filtering.  Default value is 300ms.  The debounce option must be set to true
    for this to take effect.


  - `{string=}` `cancelText`

    The text for the iOS only 'Cancel' button.  Default value is 'Cancel'.


  - `{boolean=}` `cancelOnStateChange`

    Whether to cancel the filterBar when navigating to a new state.  Default value is true.




