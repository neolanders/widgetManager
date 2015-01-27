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
