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