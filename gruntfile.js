module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        appName: 'HotrodDash',
        srcDir: 'src',
        webAppDir: '<%= srcDir %>/webApp',
        apiDir: '<%= srcDir %>/api',
        cssDir: '<%= webAppDir %>/styling/css',
        sassDir: '<%= webAppDir %>/styling/scss',
        appScss: '<%= sassDir %>/styles.scss',
        appCss: '<%= cssDir %>/styles.css',

        sass: {
            dev: {
                files: {
                    '<%= appCss %>': '<%= appScss %>',
                    '<%= cssDir %>/bootstrap-custom.css': '<%= sassDir %>/bootstrap-custom.scss'
                }
            },
            dist: {
                files: {
                    '<%= appCss %>': '<%= appScss %>',
                    '<%= cssDir %>/bootstrap-custom.css': '<%= sassDir %>/bootstrap-custom.scss'
                }
            }
        },

        jshint: {
            options: {
                reporter: require('jshint-stylish'),
                laxbreak: true,
                strict: true
            },
            webApp: {
                src: [
                    '!.*/**',
                    '<%= webAppDir %>/**/*.js',
                    '!<%= webAppDir %>/bower_components/**'
                ],
                options: {
                    globals: {
                        jQuery: true
                    }
                }
            },
            node: {
                src: [
                    '!.*/**',
                    '<%= srcDir %>/**/*.js',
                    '!<%= webAppDir %>/**'
                ],
                options: {
                    node: true,
                    globals: {
                        describe: true,
                        xdescribe: true,
                        beforeEach: true,
                        afterEach: true,
                        it: true,
                        xit: true
                    }
                }
            }
        },

        watch: {
            sass: {
                files: ['<%= webAppDir %>/**/*.scss', '!<%= webAppDir %>/bower_components/**'],
                tasks: ['sass:dev'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
            jshint: {
                files: ['<%= srcDir %>/**/*.js', '!<%= webAppDir %>/bower_components/**'],
                tasks: ['jshint']
            },
            other: {
                files: ['<%= webAppDir %>/**/*.html', '<%= webAppDir %>/**/*.js'],
                options: {
                    livereload: true
                }
            }
        }
    });

    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['jshint', 'sass:dist']);
};