'use strict';

module.exports = function (grunt) {

    var path = require('path');

    require('load-grunt-tasks')(grunt);

    require('time-grunt')(grunt);

    require('load-grunt-config')(grunt, {
        configPath: path.join(process.cwd(), 'grunt'),
        init: true,
        config: {},
        loadGruntTasks: false
    });

    grunt.registerTask('build', [
        'clean:dist',
        'coffee',
        'concat',
        'ngAnnotate',
        'copy'
    ]);

    grunt.registerTask('build_lib',['build']);
    grunt.registerTask('default', ['build_lib']);

    grunt.registerTask("release", "Release a new version - bumps bower.json, git tags, commits and pushes it", function (target) {
        if (!target) {
          target = "patch";
        }
        grunt.task.run(["build_lib", "bump-only:" + target, "bump-commit"]);
    });
};
