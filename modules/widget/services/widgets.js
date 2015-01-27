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