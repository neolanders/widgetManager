'use strict';

(function(){
    describe('WidgetManager', function() {
        var $httpBackend;
        var $rootScope;
        var scope;

        beforeEach(module('wmApp.widget.directives','modules/widget/directives/templates/widgetProperties.html'));

        //Variable Globals
        beforeEach(inject(function(_$httpBackend_, _$rootScope_) {
            $httpBackend = _$httpBackend_;
            $rootScope = _$rootScope_;
            jasmine.getJSONFixtures().fixturesPath='/assets/';
        }));

        //Test Controller
        describe('widgetProperties Controller', function() {
            beforeEach(
                inject(function ($injector, $rootScope, $controller) {
                    var scope = $rootScope.$new();
                    scope.widget = {
                        "name": "Widget4488",
                        "id": 1419117190781,
                        "properties": [
                            {
                                "name": "property2",
                                "id": 1419117171048
                            },
                            {
                                "id": 1419117180137,
                                "name": "property1"
                            },
                            {
                                "id": 1419117184965,
                                "name": "property4"
                            },
                            {
                                "id": 1419117190043,
                                "name": ""
                            }
                        ]
                    };
                    //var data = getJSONFixture('widget.json');
                    scope.widgetData = scope.widget;
                    $controller('widgetProperties', {$scope: scope});
                })
            );
            it('should load the page', function () {


                //console.log('__scope',BaseTestController.scope);
                //expect("").toEqual('hello');
            });
        });

        //Test Directive
        describe('widgetProperties Directive', function(){
            var $scope, $compile, element;
            beforeEach(inject(function(_$compile_,$rootScope){
                var scope = $rootScope.$new();
                scope.widget = {
                    "name": "Widget4488",
                    "id": 1419117190781,
                    "properties": [
                        {
                            "name": "property2",
                            "id": 1419117171048
                        },
                        {
                            "id": 1419117180137,
                            "name": "property1"
                        },
                        {
                            "id": 1419117184965,
                            "name": "property4"
                        },
                        {
                            "id": 1419117190043,
                            "name": ""
                        }
                    ]
                };
                $compile = _$compile_;
                element = $compile('<widget-properties widget-data="widget"></widget-properties>')(scope);
                $rootScope.$digest();
                $scope = element.isolateScope();
            }));
        });

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });
    });
})();