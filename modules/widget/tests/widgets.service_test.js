'use strict';

describe('WidgetManager', function () {
    var Widgets,
        widgetsMock,
        $rootScope,
        $httpBackend,
        $angularCacheFactory,
        dataCache,
        widgetData;

    // load the service's module
    beforeEach(module('wmApp.widget.services','jmdobry.angular-cache'));

    beforeEach(inject(function (_Widgets_, _$httpBackend_, _$rootScope_, $http, $q, _$angularCacheFactory_) {

        //_fields = ['name','id','properties'];
        $angularCacheFactory = _$angularCacheFactory_;
        $angularCacheFactory('dataCache'); //setup dataCache
        dataCache = $angularCacheFactory.get('dataCache');
        Widgets = _Widgets_;
        $rootScope = _$rootScope_;
        $httpBackend = _$httpBackend_;
        widgetsMock = {
            "widgets": [
                {
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
                }
            ]
        };
        widgetData = {
            "name": "Widget_Test",
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
                }
            ]
        };
        $httpBackend.whenGET('/assets/widgets.json').respond(widgetsMock.widgets);
        jasmine.getJSONFixtures().fixturesPath='/assets/';
    }));

    it('Widgets Service should be instanciate', function () {
        expect(!!Widgets).toBe(true);
    });

    it('#init - Test cache before', function () {
        //expect(dataCache.get('dataCache')).toBe(dataCache);
        dataCache.put('widgetsDataCache', widgetsMock); //should put data mock in cache
        expect(dataCache.get('widgetsDataCache')).toBe(widgetsMock); //mock data should exist in widgetsDataCache key
    });

    it('#getData', inject(function($rootScope) {
        var response;
        //dataCache.removeAll();
        dataCache.put('widgetsDataCache', widgetsMock); //should put data mock in cache
        Widgets.getData().then(function (result) {
            response = result;
            expect(result).toBe(widgetsMock); //should return data from cache
        });
        $rootScope.$digest();
        //$httpBackend.flush();
        expect(response.widgets.length).toBe(1);
    }));

    it('#checkAvailability - Widget_Test should is not exist in list',inject(function($rootScope) {
        var response;
        dataCache.put('widgetsDataCache', widgetsMock);
        Widgets.checkAvailability(widgetData.name).then(function(isAvaillable) {
            expect(isAvaillable).toEqual(true); //widgetData.name 'Widget_Test' should be availlable
        });
        $rootScope.$digest();
    }));

    it('#saveData', inject(function($rootScope) {
        var response;
        dataCache.removeAll();
        //dataCache.put('widgetsDataCache', widgetsMock); //should put data mock in cache
        Widgets.saveData(widgetData).then(function(result) {
            response = result;
        });
        $rootScope.$digest();
        //expect(response.widgets.length).toBe(3);
    }));

    it('#checkAvailability - Widget_Test should exist in list',inject(function($rootScope) {
        var response;
        widgetsMock.widgets.push(widgetData); //push widgetData in list
        //dataCache.put('widgetsDataCache', widgetsMock);
        //dataCache.removeAll();
        Widgets.checkAvailability(widgetData.name).then(function(isAvaillable) {
            expect(isAvaillable).toEqual(false); //widgetData.name 'Widget_Test' should not be availlable
        });
        $rootScope.$digest();
    }));
});
