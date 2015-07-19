/* global angular */
/**
 * This copies the functionality of the ionicConfig provider to allow for platform specific configuration
 */
(function (angular) {
  'use strict';

  angular.module('jett.ionic.filter.bar')
    .provider('$ionicFilterBarConfig', function () {

      var provider = this;
      provider.platform = {};
      var PLATFORM = 'platform';

      var configProperties = {
        theme: PLATFORM,
        clear: PLATFORM,
        search: PLATFORM,
        backdrop: PLATFORM,
        transition: PLATFORM,
        platform: {},
        placeholder: PLATFORM
      };

      createConfig(configProperties, provider, '');

      // Default
      // -------------------------
      setPlatformConfig('default', {
        clear: 'ion-ios-close',
        search: 'ion-ios-search-strong',
        backdrop: true,
        transition: 'vertical',
        placeholder: 'Search'
      });

      // iOS (it is the default already)
      // -------------------------
      setPlatformConfig('ios', {});

      // Android
      // -------------------------
      setPlatformConfig('android', {
        clear: 'ion-android-close',
        search: false,
        backdrop: false,
        transition: 'horizontal'
      });

      provider.setPlatformConfig = setPlatformConfig;

      // private: used to set platform configs
      function setPlatformConfig(platformName, platformConfigs) {
        configProperties.platform[platformName] = platformConfigs;
        provider.platform[platformName] = {};

        addConfig(configProperties, configProperties.platform[platformName]);

        createConfig(configProperties.platform[platformName], provider.platform[platformName], '');
      }

      // private: used to recursively add new platform configs
      function addConfig(configObj, platformObj) {
        for (var n in configObj) {
          if (n != PLATFORM && configObj.hasOwnProperty(n)) {
            if (angular.isObject(configObj[n])) {
              if (!angular.isDefined(platformObj[n])) {
                platformObj[n] = {};
              }
              addConfig(configObj[n], platformObj[n]);

            } else if (!angular.isDefined(platformObj[n])) {
              platformObj[n] = null;
            }
          }
        }
      }

      // private: create methods for each config to get/set
      function createConfig(configObj, providerObj, platformPath) {
        angular.forEach(configObj, function(value, namespace) {

          if (angular.isObject(configObj[namespace])) {
            // recursively drill down the config object so we can create a method for each one
            providerObj[namespace] = {};
            createConfig(configObj[namespace], providerObj[namespace], platformPath + '.' + namespace);

          } else {
            // create a method for the provider/config methods that will be exposed
            providerObj[namespace] = function(newValue) {
              if (arguments.length) {
                configObj[namespace] = newValue;
                return providerObj;
              }
              if (configObj[namespace] == PLATFORM) {
                // if the config is set to 'platform', then get this config's platform value
                var platformConfig = stringObj(configProperties.platform, ionic.Platform.platform() + platformPath + '.' + namespace);
                if (platformConfig || platformConfig === false) {
                  return platformConfig;
                }
                // didnt find a specific platform config, now try the default
                return stringObj(configProperties.platform, 'default' + platformPath + '.' + namespace);
              }
              return configObj[namespace];
            };
          }

        });
      }

      //splits a string by dot operator and accesses the end var.  For example in a.b.c,
      function stringObj(obj, str) {
        str = str.split(".");
        for (var i = 0; i < str.length; i++) {
          if (obj && angular.isDefined(obj[str[i]])) {
            obj = obj[str[i]];
          } else {
            return null;
          }
        }
        return obj;
      }

      provider.$get = function() {
        return provider;
      };

    });

})(angular);
