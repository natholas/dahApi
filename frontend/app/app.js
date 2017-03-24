angular.module('templates', []);
var app = angular.module('app', ['ngRoute', 'templates'])

.config(function($routeProvider, $locationProvider, $httpProvider) {
  $locationProvider.html5Mode(true);

  var originalWhen = $routeProvider.when;
    $routeProvider.when = function(path, route) {
      route.resolve || (route.resolve = {});
      angular.extend(route.resolve, {
          bootloader: function(Bootloader) {
            return Bootloader.init().then(function(response) {
              return response;
            });
          }
      });
      return originalWhen.call($routeProvider, path, route);
    };
})

.run(function($rootScope, $templateCache, Storage, $location) {

  $rootScope.$on('$viewContentLoaded', function() {
    var old_version = Storage.get("version");
    if (!old_version) Storage.set("version", version_number);
    else if (old_version != version_number) {
      $templateCache.removeAll();
      Storage.clear();
      window.location.reload(true);
    }
    $rootScope.loaded = true;
  });

});
