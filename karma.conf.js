module.exports = function(config){
  config.set({
    //basePath : './',
    frameworks: ['jasmine'],
    files : [
      'libs/jquery/dist/jquery.js',
      'libs/jasmine-jquery/lib/jasmine-jquery.js',
      'libs/angular/angular.js',
      'libs/angular-mocks/angular-mocks.js',
      'libs/underscore/underscore.js',
      'libs/angular-cache/dist/angular-cache.js',
      'libs/ui-router/release/angular-ui-router.js',
      'libs/angular-ui-router.stateHelper/statehelper.min.js',
      'libs/angular-bootstrap/ui-bootstrap-tpls.js',
      'libs/angular-translate/angular-translate.min.js',
      'libs/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
      'modules/widget/directives/templates/*.html',
      'modules/widget/views/partials/*.html',
      'modules/core/**/*.js',
      'modules/widget/**/*.js',
      {pattern: '/assets/*.json', watched: true, served: true, included: false}// fixtures
    ],
    autoWatch : true,
    browsers : ['Chrome'],
    preprocessors: {
      'modules/**/directives/templates/*.html': 'ng-html2js',
      'modules/**/views/partials/*.html': 'ng-html2js'
      //'assets/*.json': 'ng-html2js'
    },
    ngHtml2JsPreprocessor: {
      stripPrefix: '/'
    }
  });
};
