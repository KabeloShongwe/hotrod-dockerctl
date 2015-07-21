module.exports = function(config) {
    config.set({
        basePath: './',

        files : [
            'src/webApp/bower_components/angular/angular.js',
            'src/webApp/bower_components/angular-ui-router/release/angular-ui-router.js',
            'src/webApp/bower_components/angular-mocks/angular-mocks.js',
            'src/webApp/bower_components/angular-animate/angular-animate.js',
            'src/webApp/bower_components/lodash/lodash.min.js',
            'src/webApp/bower_components/jquery/dist/jquery.min.js',
            'src/webApp/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
            'src/webApp/bower_components/moment/min/moment.min.js',
            'src/webApp/bower_components/hotrod-charts/lib/index.js',
            'src/webApp/bower_components/hotrod-components/src/messages/messages.js',
            'src/webApp/bower_components/hotrod-components/src/filters.js',
            'src/webApp/bower_components/d3/d3.js',
            'src/webApp/bower_components/nvd3/nv.d3.js',
            'src/webApp/bower_components/angular-nvd3/dist/angular-nvd3.js',
            'src/webApp/bower_components/angular-sanitize/angular-sanitize.min.js',
            'src/webApp/bower_components/angular-ui-select/dist/select.min.js',

            'src/webApp/components/**/*.js',
            'src/webApp/components/**/*.html',
            'src/webApp/data.js',

            'tests/client/**/*.js',
            'node_modules/chai-shallow-deep-equal/chai-shallow-deep-equal.js'
        ],

        frameworks: ['jasmine', 'chai'],

        browsers : [
            'Chrome',
            'Firefox'
        ],

        plugins : [
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-chai'
        ],

        junitReporter : {
            outputFile: 'test_out/unit.xml',
            suite: 'unit'
        }
    });
};