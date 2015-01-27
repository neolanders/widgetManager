angular.module('wmApp.core.filters',[]);
angular.module('wmApp.core.services',[]);

/**
 * @ngdoc filter
 * @name pascalprecht.translate.filter:translate
 * @requires $parse
 * @requires pascalprecht.translate.$translate
 * @function
 *
 * @description
 * Uses "$translate" service to translate contents. Accepts interpolate parameters
 * to pass dynamized values though translation.
 *
 * @param {string} translationId A translation id to be translated.
 * @param {*=} interpolateParams Optional object literal (as hash or string) to pass values into translation.
 *
 * @returns {string} Translated text.
 *
 * @example
 <example module="ngView">
 <file name="index.html">
     <div ng-controller="TranslateCtrl">
         <pre>{{ 'TRANSLATION_ID' | trans }}</pre>
         <pre>{{ translationId | trans }}</pre>
         <pre>{{ 'WITH_VALUES' | trans:'{value: 5}' }}</pre>
         <pre>{{ 'WITH_VALUES' | trans:values }}</pre>
     </div>
 </file>
 <file name="script.js">
     angular.module('ngView', ['pascalprecht.translate'])
     .config(function ($translateProvider) {
        $translateProvider.translations('en', {
          'TRANSLATION_ID': 'Hello there!',
          'WITH_VALUES': 'The following value is dynamic: {{value}}'
        });
        $translateProvider.preferredLanguage('en');
     });
     angular.module('ngView').controller('TranslateCtrl', function ($scope) {
        $scope.translationId = 'TRANSLATION_ID';
        $scope.values = {
          value: 78
        };
     });
   </file>
 </example>
 */
angular.module('wmApp.core.filters').filter('trans', ['$parse', '$translate', function ($parse, $translate) {
    var translateFilter = function (translationId, interpolateParams, interpolation) {
        if (!angular.isObject(interpolateParams)) {
            interpolateParams = $parse(interpolateParams)(this);
        }
        return $translate.instant(translationId, interpolateParams, interpolation);
    };

    // Since AngularJS 1.3, filters which are not stateless (depending at the scope)
    // have to explicit define this behavior.
    translateFilter.$stateful = true;
    return translateFilter;
}]);
angular.module('wmApp.widget.controllers',[]);
angular.module('wmApp.widget.directives',[]);
angular.module('wmApp.widget.services',[]);
angular.module('wmApp.widget.routes',[]);
angular.module('wmApp.widget.routes').config(['stateHelperProvider','$urlRouterProvider', function(stateHelperProvider, $urlRouterProvider) {

    /////////////////////////////
    // Redirects and Otherwise //
    /////////////////////////////

    // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
    $urlRouterProvider
        .when('#/widgetId?id', '/widgetId/:id')
        .otherwise('/');

    //////////////////////////
    // State Configurations //
    //////////////////////////

    stateHelperProvider.state({
        url: '/',
        name: 'summary',
        templateUrl: 'modules/widget/views/partials/widget-summary.html',
        controller: 'widgetSummary',
        data: {
            title: ""
        },
        children: [{
                url: ":widgetId",
                name: 'detail', //summary.detail
                templateUrl: 'modules/widget/views/partials/widget-detail.html',
                controller: 'widgetDetail',
                data: {
                    title: "DETAIL_LABEL"
                }
            },{
                // Absolutely targets the 'edit' view in this state, 'summary.detail'.
                // <div ui-view='edit'/> within summary.detail.html
                url:"edit/:widgetId",
                name: 'edit', //edit@summary
                templateUrl: 'modules/widget/views/partials/widget-edit.html',
                controller:'widgetEdit',
                data:{
                    title:  "EDIT_LABEL"
                }
            },{
                url: "edit/",
                name: 'add',
                templateUrl: 'modules/widget/views/partials/widget-edit.html',
                controller:'widgetEdit',
                data: {
                    title: "ADD_NEW_LABEL"
                }
            }
        ]
    });
}]);

'use strict';

angular.module('wmApp.widget.controllers').controller('widgetDetail',
    ['$scope','$log','$state','$stateParams','Widgets',function($scope,$log,$state,$stateParams,Widgets) {

        // Number of properties that should be
        // visible in the current state of the interface.
        var propertyCapacity = 5;

        $scope.enableShowMore = false;
        $scope.widget = {};

        // Collection of visible properties, based on
        // the properties collection and the capacity of the
        // current interface.
        $scope.visibleProperties = [];

        // Collection of hidden properties, not shown
        // because they exceed the capacity of the current
        // interface.
        $scope.hiddenProperties = [];

        // --
        // PRIVATE METHODS.
        // --

        // Apply the current capacity to the properties to
        // update the visible/hidden breakdown.
        var applyPropertiesCapacity = function(widget) {
            if ( propertyCapacity >= widget.properties.length ) {
                $scope.visibleProperties = widget.properties;
                $scope.hiddenProperties = [];

                // If we have more properties that the interface can
                // hold, funnel the overflow into the hidden
                // properties collection.
            } else {
                $scope.visibleProperties = widget.properties.slice( 0, propertyCapacity );
                $scope.hiddenProperties = widget.properties.slice( propertyCapacity );
            }
        }

        var getWidget = function() {
            var promise = Widgets.getDataById($stateParams.widgetId);
            promise.then(function (widget) {
                $scope.widget = widget;

                // Divide the properties up into the hidden / visible
                // breakdown based on the currently-hard-coded
                // render capacity.
                if(widget.properties) {
                    applyPropertiesCapacity(widget);
                }
            });
        };

        if($stateParams.widgetId) {
            getWidget();
        }

        // --
        // PUBLIC METHODS.
        // --

        $scope.refresh = function(){
            $state.go('summary');
        };

        $scope.showMore = function(){
          $scope.enableShowMore = true;
        };
}]);
'use strict';

angular.module('wmApp.widget.controllers').controller('widgetEdit',
    ['$scope','$log','$stateParams','Widgets','$rootScope','$state','$filter',
        function($scope,$log,$stateParams,Widgets,$rootScope,$state,$filter) {

            var _PUBSUB_WIDGET_DATA_ = '_PUBSUB_WIDGET_DATA_';
            var alerts = {
                'danger': {type: 'danger', message: $filter('trans')('MESSAGE_EDIT_ERROR')},
                'success': {type: 'success', message: $filter('trans')('MESSAGE_EDIT_SUCCESS')}
            };

            //init scope variables
            $scope.alert = {};
            $scope.widget = {};
            $scope.widget.properties = [{
                name: '',
                id: ( new Date() ).getTime()
            }];

            // --
            // PRIVATE METHODS.
            // --

            var updateWidget = function(widget){
                if ( ! $scope.widget) { //check first if model exist
                    return;
                }
                Widgets.updateData($scope.widget).then(function(id){
                    if(!id) {
                        $scope.alert = alerts['danger'];
                        return;
                    }
                    Widgets.getData().then(function(widgets){
                        $rootScope.$broadcast(_PUBSUB_WIDGET_DATA_, {items: widgets});
                        $scope.alert = alerts['success'];
                    });
                });
            };

            var getWidget = function() {
                var promise = Widgets.getDataById($stateParams.widgetId);
                promise.then(function (widget) {
                    $scope.widget = widget;
                });
            };
            if($stateParams.widgetId) {
                getWidget();
            }

            // --
            // PUBLIC METHODS.
            // --

            $scope.saveWidget = function (widget) {
                if ( ! $scope.widget ) { //check first if model exist
                    return;
                }
                if( widget && widget.id ){ //process update if widget have id
                    updateWidget(widget); return;
                }
                Widgets.saveData($scope.widget).then(function(res){
                    if(res.success){
                        Widgets.getData().then(function(data){
                            $rootScope.$broadcast(_PUBSUB_WIDGET_DATA_, {items: data});
                            $scope.alert = alerts['success'];
                        });
                    }else{
                        alerts['danger'].message = res.message;
                        $scope.alert = alerts['danger'];
                    }
                });
            };

            $scope.onAlertClose = function(){
                $scope.alert = {};
            };

            $scope.refresh = function(){
                $state.go('summary');
            };
}]);
'use strict';

angular.module('wmApp.widget.controllers').controller('widgetSummary',
    ['$scope','$log','Widgets','$state','$modal','$filter',
        function($scope,$log,Widgets,$state,$modal,$filter) {

            var _PUBSUB_WIDGET_DATA_ = '_PUBSUB_WIDGET_DATA_';
            var modals = {
                'delete': {title: $filter('trans')('REMOVE_MODAL_CONFIRMATION_TITLE'),
                           message: $filter('trans')('REMOVE_MODAL_CONFIRMATION_MESSAGE')}
            };

            $scope.widgets = {};

            // --
            // PRIVATE METHODS.
            // --

            var getWidgetsList = function() {
                Widgets.getData().then(function (widgets) {
                    $scope.widgets = widgets;
                });
            };
            getWidgetsList();

            // --
            // PUBLIC METHODS.
            // --

            $scope.removeAll = function(){
                Widgets.removeAll();
                $state.go('summary');
                getWidgetsList();
            };

            $scope.deleteWidget = function(widget){
                $modal.open({
                    scope: $scope,
                    templateUrl: 'summaryModal.html',
                    controller: function ($scope, $modalInstance) {
                        $scope.modal = modals['delete'];
                        $scope.onModalCancel = function () {
                            $modalInstance.dismiss('cancel');
                        };
                        $scope.onModalConfirm = function(){
                            Widgets.removeData(widget).then(function(id){
                                if(!id){
                                    //Display error alert
                                    return;
                                }
                                var index = $scope.widgets.indexOf( widget );
                                if ( index === -1 ) {
                                    return;
                                }
                                $scope.widgets.splice( index, 1 );
                                $modalInstance.dismiss('cancel');
                            });
                        };
                    }
                });
            };

            $scope.$on(_PUBSUB_WIDGET_DATA_, function(event, args) {
                $scope.widgets = args.items;
            });
}]);
'use strict';

angular.module('wmApp.widget.directives').directive('validWidgetName', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue) {
                var isBlank = viewValue === ''
                var invalidLen = !isBlank && (viewValue.length < 8 || viewValue.length > 20)
                var isWeak = !isBlank && !invalidLen && !/(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z])/.test(viewValue)
                ctrl.$setValidity('isBlank', !isBlank)
                ctrl.$setValidity('isWeak', !isWeak)
                ctrl.$setValidity('invalidLen', !invalidLen)
                scope.passwordGood = !isBlank && !isWeak && !invalidLen

            })
        }
    }
})
'use strict';

angular.module('wmApp.widget.directives').directive('widgetProperties', function () {
    return {
        restrict: 'E',
        templateUrl: 'modules/widget/directives/templates/widgetProperties.html',
        controller: 'widgetProperties',
        scope: {
            widgetData: '='
        }
    }
}).controller('widgetProperties',function($scope){

    $scope.properties = $scope.widgetData.properties;

    // --
    // PUBLIC METHODS.
    // --

    $scope.addProperty = function(property) {
        if ( ! property.name ) {
            return;
        }
        $scope.properties.push({
            id: ( new Date() ).getTime(),
            name: '' //init next property
        });
    };

    $scope.removeProperty = function( property ) {
        var index = $scope.properties.indexOf( property );
        if ( index === -1 ) {
            return;
        }
        $scope.properties.splice( index, 1 );
    };

    $scope.widgetData.properties = $scope.properties; //inject properties to widget
});
/**
 * @desc: A CRUD (create, read, update, delete) Service factory to handle Widget data objects
 *
 */
angular.module('wmApp.widget.services').factory('Widgets',
    ['$http','$q','$angularCacheFactory','$filter', function ($http,$q,$angularCacheFactory,$filter) {

    var _fields = ['name','id','properties'];

    return {

        getData: function () {
            var deferred = $q.defer(),
                path = '/assets/widgets.json',
                dataCache = $angularCacheFactory.get('dataCache');
            if (dataCache.get('widgetsDataCache')) {
                deferred.resolve(dataCache.get('widgetsDataCache'));
            }else {
                //Mocks Data
                $http.get(path).then(function (resp) {
                    dataCache.put('widgetsDataCache', resp.data.widgets);
                    deferred.resolve(resp.data.widgets);
                });
            }
            return deferred.promise;
        },


        getDataByName: function (name) {
            var deferred = $q.defer();
            this.getData().then(function(widgets){
                var widget = _.find(widgets, function(elem){return elem.name == name});
                deferred.resolve(widget);
            });
            return deferred.promise;
        },


        getDataById: function (id) {
            var deferred = $q.defer(),
                dataCache = $angularCacheFactory.get('dataCache');
            if (dataCache.get('widgetsDataCache_'+id)) {
                deferred.resolve(dataCache.get('widgetsDataCache_'+id));
            } else {
                this.getData().then(function(widgets){
                    var widget = _.find(widgets, function(elem){return elem.id == id});
                    dataCache.put('widgetsDataCache_'+id, widget);
                    deferred.resolve(widget);
                });
            }
            return deferred.promise;
        },

        checkAvailability: function(name){
            var deferred = $q.defer(), isAvailable = false;
            this.getDataByName(name).then(function(widget){
                if(!widget) {
                    isAvailable = true;
                }
                deferred.resolve(isAvailable);
            });
            return deferred.promise;
        },

        /**
         * @desc: Create new widget in cache
         * @param
         * @returns
         */
        saveData: function(widget){
            var self = this,
                deferred = $q.defer(),
                dataCache = $angularCacheFactory.get('dataCache'),
                _widget = this.createValueObject(widget),
                res = {success:false};
            this.checkAvailability(_widget.name).then(function(isAvailable){
                if(!isAvailable) {
                    res.message = $filter('trans')('MESSAGE_AVAILABILITY_ERROR');
                    deferred.resolve(res);
                    return;
                }
                _widget.id = ( new Date() ).getTime();
                _widget.properties = widget.properties;
                self.getData().then(function(data){
                    if(data && typeof(data)=='object') {
                        data.push(_widget); //push new widgetObject in list
                        dataCache.put('widgetsDataCache', data);
                        res.success = true;
                        deferred.resolve(res);
                    }
                });
            });
            return deferred.promise;
        },

        /**
         * @desc: Update widget in cache
         * @param widget, id
         * @returns {int} widget id if success
         */
        updateData: function (widget) {
            var deferred = $q.defer(),
                _id = widget.id || '',
                dataCache = $angularCacheFactory.get('dataCache');
            if (!dataCache.get('widgetsDataCache_'+_id)) {
                deferred.resolve(res); //widget Object doesn't exist in cache
                return;
            }
            this.getData().then(function(widgets){
                var _widgets = _.without(widgets, _.findWhere(widgets, {id:_id})); //get widgets list without widgetObject
                _widgets.push(widget);
                dataCache.put('widgetsDataCache_'+_id,widget); //update cache for specific widget
                dataCache.put('widgetsDataCache', _widgets);  //update cache for widgets list
                deferred.resolve(_id);
            });
            return deferred.promise;
        },

        /**
         * @desc: Clean All Cache
         * @returns
         */
        removeAll: function(){
            var dataCache = $angularCacheFactory.get('dataCache');
            dataCache.removeAll();
        },

        /**
         * @desc: Remove Widget object from Cache
         * @param id
         * @returns {int} widget id if success
         */
        removeData: function(widget){
            var self = this,
                deferred =  $q.defer(),
                dataCache = $angularCacheFactory.get('dataCache'),
                _id = widget.id || '';
            if(this.getDataById('widgetsDataCache_'+_id)) {
                self.getData().then(function(widgets){
                    var _widgets = _.without(widgets, _.findWhere(widgets, {id:_id})); //get widgets list without widgetObject
                    dataCache.remove('widgetsDataCache_'+_id); //remove cache for specific widget id
                    dataCache.remove('widgetsDataCache'); //remove cache for widget list
                    dataCache.put('widgetsDataCache', _widgets);  //update cache widgets list without widget Object
                    deferred.resolve(_id);
                });
            }
            return deferred.promise;
        },



        /**
         * @desc: Get last Id from widget list
         * @param id
         * @returns {int} widget id if success
         */
        getLastId: function() {
            var deferred =  $q.defer();
            this.getData().then(function(items){
                var lastItem = _.max(items, function(item){ return item.id;});
                deferred.resolve(lastItem.id);
            });
            return deferred.promise;
        },

        createValueObject: function(item) {
            var obj = {};
            angular.forEach( _fields, function( field ) {
                obj[field] = item[field] || '';
            });
            return obj;
        }
    };
}]);