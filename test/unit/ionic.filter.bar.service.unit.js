describe('Ionic FilterBar Service', function() {

  var items = [
    {id: 1, name: 'carrots', description: 'hate carrots'},
    {id: 2, name: 'fries', description: 'gotta love fries'},
    {id: 3, name: 'squirrel sauce', description: 'yummm'},
    {id: 4, name: 'honey dew melon', description: 'tasty fruit'},
    {id: 5, name: 'people', description: 'wierd..'}
  ];

  beforeEach(module('ionic', 'jett.ionic.filter.bar', function($provide) {
    ionic.requestAnimationFrame = function(cb) { cb(); };

    // For the sake of this test, we don't want ionFilterBar to
    // actually compile as a directive.
    // We are only testing the service.
    $provide.value('ionFilterBarDirective', []);
  }));

  function setup(options) {
    var scope;
    inject(function($ionicFilterBar, $ionicPlatform, $timeout) {
      var hide = $ionicFilterBar.show(options || {});
      $timeout.flush();
      scope = hide.$scope;
    });
    return scope;
  }

  it('show set default options on scope', inject(function() {
    var scope = setup();
    var templateConfig = scope.config;

    expect(templateConfig.theme).toBeUndefined();
    expect(templateConfig.transition).toBe('vertical');
    expect(templateConfig.back).toBe('ion-ios-arrow-back');
    expect(templateConfig.clear).toBe('ion-ios-close');
    expect(templateConfig.search).toBe('ion-ios-search-strong');
    expect(templateConfig.backdrop).toBe(true);
    expect(scope.config.placeholder).toBe('Search');

    expect(scope.update).toEqual(angular.noop);
    expect(scope.cancel).toEqual(angular.noop);
    expect(scope.done).toEqual(angular.noop);
    expect(scope.filterProperties).toBeNull();
    expect(scope.debounce).toBe(true);
    expect(scope.delay).toBe(300);
    expect(scope.cancelText).toBe('Cancel');
    expect(scope.cancelOnStateChange).toBe(true);
    expect(scope.container[0].nodeName).toBe('BODY');
  }));

  it('show should add class on showing', inject(function($document) {
    setup();
    expect($document[0].body.classList.contains('filter-bar-open')).toBe(true);
  }));

  it('removeFilterBar should remove classes, remove element and destroy scope', inject(function($document, $timeout) {
    var scope = setup();
    spyOn(scope, '$destroy');
    spyOn(scope.element, 'remove');
    scope.removeFilterBar();
    $timeout.flush();
    expect($document[0].body.classList.contains('filter-bar-open')).toBe(false);
    expect(scope.$destroy).toHaveBeenCalled();
    expect(scope.element.remove).toHaveBeenCalled();
  }));

  it('filterItems should filter items using default filterExpression and call update', inject(function($timeout) {
    var scope = setup({
      items: items,
      update: function (filteredItems, filterText) {}
    });
    spyOn(scope, 'update');
    scope.filterItems('squirrel');
    $timeout.flush();
    expect(scope.update).toHaveBeenCalled();
    expect(scope.update.calls[0].args[0].length).toEqual(1);
    expect(scope.update.calls[0].args[1]).toEqual('squirrel');
  }));

  it('filterItems should filter items based on filterExpression and call scope.update', inject(function($timeout) {
    var updateSpy = jasmine.createSpy('scope.update');
    var scope = setup({
      items: items,
      expression: function (value, index, array) {
        return value.name.length >= 8;
      },
      update: updateSpy
    });

    scope.filterItems('sauce');
    $timeout.flush();
    expect(updateSpy).toHaveBeenCalled();
    expect(scope.update.calls[0].args[0].length).toEqual(2);
    expect(scope.update.calls[0].args[1]).toEqual('sauce');
  }));

  it('filterItems should filter items based on filterProperties and call scope.update', inject(function($timeout) {
    var updateSpy = jasmine.createSpy('scope.update');
    var scope = setup({
      items: items,
      filterProperties : 'description',
      update: updateSpy
    });

    scope.filterItems('squirrel');
    $timeout.flush();
    expect(updateSpy).toHaveBeenCalled();
    expect(scope.update.calls[0].args[0].length).toEqual(0);
    expect(scope.update.calls[0].args[1]).toEqual('squirrel');
  }));

  it('show should showFilterBar and call scope.done', inject(function() {
    var doneSpy = jasmine.createSpy('scope.done');

    var scope = setup({
      done: doneSpy
    });

    scope.showFilterBar();
    expect(doneSpy).toHaveBeenCalled();
  }));

  it('cancelFilterBar should removeFilterBar and call scope.cancel', inject(function($timeout) {
    var cancelSpy = jasmine.createSpy('scope.cancel');

    var scope = setup({
      cancel: cancelSpy
    });

    spyOn(scope, 'removeFilterBar').andCallThrough();
    scope.cancelFilterBar();
    $timeout.flush();
    expect(scope.removeFilterBar).toHaveBeenCalled();
    expect(cancelSpy).toHaveBeenCalled();
  }));

  it('should cancelOnStateChange by default', inject(function($rootScope) {
    var scope = setup();
    spyOn(scope, 'cancelFilterBar');
    $rootScope.$broadcast('$stateChangeSuccess');
    expect(scope.cancelFilterBar).toHaveBeenCalled();
  }));

  it('should not cancelOnStateChange with option as false', inject(function($rootScope) {
    var scope = setup({
      cancelOnStateChange: false
    });
    spyOn(scope, 'cancelFilterBar');
    $rootScope.$broadcast('$stateChangeSuccess');
    expect(scope.cancelFilterBar).not.toHaveBeenCalled();
  }));

  describe('Custom Options', function() {
    beforeEach(module('jett.ionic.filter.bar', function ($ionicFilterBarConfigProvider) {
      $ionicFilterBarConfigProvider.theme('calm');
      $ionicFilterBarConfigProvider.clear('ion-close');
      $ionicFilterBarConfigProvider.search('ion-search');
      $ionicFilterBarConfigProvider.backdrop(false);
      $ionicFilterBarConfigProvider.transition('horizontal');
      $ionicFilterBarConfigProvider.placeholder('Filter');
    }));

    it('show set custom options on scope', inject(function() {
      var update = function () {};
      var cancel = function () {};
      var done = function () {};

      var scope = setup({
        update: update,
        cancel: cancel,
        done: done,
        filterProperties: ['propA', 'propB'],
        debounce: false,
        delay: 0,
        cancelText: 'Done'
      });

      expect(scope.config.theme).toBe('calm');
      expect(scope.config.transition).toBe('horizontal');
      expect(scope.config.clear).toBe('ion-close');
      expect(scope.config.search).toBe('ion-search');
      expect(scope.config.backdrop).toBe(false);
      expect(scope.config.placeholder).toBe('Filter');
      expect(scope.update).toEqual(update);
      expect(scope.cancel).toEqual(cancel);
      expect(scope.done).toEqual(done);
      expect(scope.filterProperties).toEqual(['propA', 'propB']);
      expect(scope.debounce).toBe(false);
      expect(scope.delay).toBe(0);
      expect(scope.cancelText).toBe('Done');
    }));
  });

});
