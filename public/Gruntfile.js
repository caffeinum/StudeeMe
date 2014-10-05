module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                // define a string to put between each file in the concatenated output
                separator: ';'
            },
            dist: {
                // the files to concatenate
                src: ['js/*.js'],
                // the location of the resulting JS file
                dest: 'script.js'
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'script.js',
                dest: 'script.min.js'
            }
        },
		less: {
			development: {
				options: {
					paths: ["less"]
				},
				files: {
					"style.css": "less/style.less"
				}
			},
			production: {
				options: {
					paths: ["less"]
				},
				files: {
					"style.css": "less/style.less"
				}
			}
		},
        watch: {
			scripts: {
				files: ['js/*.js'],
				tasks: ['concat', 'uglify']
			},
			css: {
				files: 'less/style.less',
				tasks: ['less']
			}
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    
    // Default task(s).
    grunt.registerTask('default', ['uglify', 'concat', 'less']);

};