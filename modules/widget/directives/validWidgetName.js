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