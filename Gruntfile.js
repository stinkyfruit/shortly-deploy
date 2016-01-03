module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      // app: {
      //   src: ['app/*.js', 'app/*/*.js'],
      //   dest: 'dist/app-concat.js'
      // },
      // lib: {
      //   src: ['lib/*.js'],
      //   dest: 'dist/lib-concat.js'
      // },
      pubClient: {
        src: 'public/client/*.js',
        dest: 'public/dist/client-concat.js'
      }
      // server: {
      //   src: ['index.js', 'server.js'],
      //   dest: 'dist/server-concat.js'
      // }
    },

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    uglify: {
      dist: {
        options: {
          mangle: false
        },
        files: {
          // './dist/app-concat.min.js': ['./dist/app-concat.js'],
          // './dist/lib-concat.min.js': ['./dist/lib-concat.js'],
          // './dist/server-concat.min.js': ['./dist/server-concat.js'],
          './public/dist/client-concat.min.js': ['./public/dist/client-concat.js']
        }
      }
    },

    jshint: {
      files: [
        // Add filespec list here
        'app/*/*.js',
        'app/*.js',
        'lib/*.js',
        'public/client/*.js',
        'index.js',
        'server.js'
      ],
      options: {
        force: false,
        jshintrc: '.jshintrc',
        ignores: [
          'public/lib/**/*.js',
          'public/dist/**/*.js',
          'dist/*.js'
        ]
      }
    },

    cssmin: {
      dist: {
        files: {
          './public/dist/style.min.css': ['./public/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
        command: [
          'git push heroku master'
        ],
        options: {
          stdout: true,
          stderr: true,
          failOnError: true
        }
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
         cmd: 'grunt',
         grunt: true,
         args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [
    'jshint',
    // 'test',
    'concat',
    'uglify',
    'cssmin'
  ]);

  grunt.registerTask('upload', function(n) {
    if(grunt.option('prod')) {
      // add your production server task here
      grunt.task.run(['shell:prodServer']);
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    // add your deploy tasks here
    'build',
    'upload'
  ]);


};
