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