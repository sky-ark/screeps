module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-screeps');

    // Get the branch name from the command line, or default to 'default'
    const targetBranch = grunt.option('branch') || 'default';

    grunt.initConfig({
        screeps: {
            options: {
                email: 'bast.frederic@gmail.com',
                token: 'add136a3-9f30-4be6-8279-2638b2b18fa0',
                branch: targetBranch,
                //server: 'season'
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['screeps']);
}