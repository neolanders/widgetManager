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