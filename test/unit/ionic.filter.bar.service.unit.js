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

  it('show should add class on showing', inject(function($document) {
    var scope = setup();
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

  it('filterItems should filter items using default filterExpression and call update', inject(function() {
    var scope = setup({
      items: items,
      update: function (filteredItems) {}
    });
    spyOn(scope, 'update');
    scope.filterItems('squirrel');
    expect(scope.update).toHaveBeenCalled();
    expect(scope.update.calls[0].args[0].length).toEqual(1);
  }));

  it('filterItems should filter items based on filterProperties and call scope.update', inject(function() {
    var updateSpy = jasmine.createSpy('scope.update');
    var scope = setup({
      items: items,
      filterProperties : 'description',
      update: updateSpy
    });

    scope.filterItems('squirrel');
    expect(updateSpy).toHaveBeenCalled();
    expect(scope.update.calls[0].args[0].length).toEqual(0);
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

});