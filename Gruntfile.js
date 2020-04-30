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
        }
    });

    grunt.loadNpmTasks('grunt-babel');
    grunt.registerTask('build', ['babel']);
};