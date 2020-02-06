module.exports = function(grunt) {
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: false,
                comments: false,
                sourceType: "unambiguous",
                presets: ['@babel/preset-env', 'minify']
            },
            dist: {
                files: {
                    'dist/Notifier.min.js': 'src/Notifier.js'
                }
            }
        },
        cssmin: {
            options: {
                mergeIntoShorthands: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/Notifier.min.css': ['src/*.css']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('build', ['babel', 'cssmin']);
};