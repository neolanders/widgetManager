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