'use strict';

// Declare app level module which depends on views, and components
angular.module('wmApp', [
    'jmdobry.angular-cache',
    'ui.router',
    'ui.router.stateHelper',
    'ui.bootstrap',
    'ui.bootstrap.tpls',
    'pascalprecht.translate',
    'wmApp.core.filters',
    'wmApp.core.services',
    'wmApp.widget.services',
    'wmApp.widget.directives',
    'wmApp.widget.controllers',
    'wmApp.widget.routes'
])
.constant('DEBUG_MODE',true)
.config([ "$angularCacheFactoryProvider", "$provide", "$translateProvider",
    function( $angularCacheFactoryProvider, $provide, $translateProvider ){
        $translateProvider.useStaticFilesLoader({
            prefix: '/i18n/lang-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en_En');

        /*********************************
         *   ANGULAR CACHE CONFIG
         *********************************/
        $angularCacheFactoryProvider.setCacheDefaults({

            // This cache can hold 1000 items
            capacity: 1000,

            // Items added to this cache expire after 1hour
            maxAge: 3600000,

            // Items will be actively deleted when they expire
            deleteOnExpire: 'aggressive',

            // This cache will check for expired items every minute
            recycleFreq: 60000,

            // This cache will clear itself every hour
            cacheFlushInterval: 3600000,

            // This cache will sync itself with localStorage
            storageMode: 'localStorage',

            // Custom implementation of localStorage
            //storageImpl: myLocalStoragePolyfill,

            // Full synchronization with localStorage on every operation
            verifyIntegrity: true,

            // This callback is executed when the item specified by "key" expires.
            // At this point you could retrieve a fresh value for "key"
            // from the server and re-insert it into the cache.
            onExpire: function (key, value) {

            }
        });
}])
.run(['$rootScope','$state','$stateParams', '$angularCacheFactory', 'DEBUG_MODE',
    function ($rootScope, $state, $stateParams, $angularCacheFactory, DEBUG_MODE) {

        $rootScope.debugMode = DEBUG_MODE;

        var info = $angularCacheFactory('dataCache').info();
        //console.log('__info',info)

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$on('$stateChangeStart', function(event, toState){
            $rootScope.title = toState.data.title || '';
        });
    }
]);

