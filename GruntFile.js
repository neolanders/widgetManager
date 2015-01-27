module.exports = function(grunt){

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.registerTask('default', ['clean','less','concat','cssmin']); //,'watch'
  grunt.registerTask('prod', ['clean','less','concat','uglify','cssmin']);
  grunt.registerTask('validate',['jshint']);

  grunt.initConfig({
    distdir: 'dist',
    pkg : grunt.file.readJSON("package.json"),
    src: {
      jsCore: ['modules/core/**/!(*_test).js'],
      jsProject: ['modules/widget/**/!(*_test).js'],
      css: ['styles/css/*.css']
    },
    clean: ['<%=distdir%>/*'],
    concat: {
      dist:{
        src:['<%=src.jsCore%>','<%=src.jsProject%>'],
        dest:'<%=distdir%>/main.js'
      },
      css : {
        src:['<%=src.css%>'],
        dest:'<%=distdir%>/widget.css'
      }
    },
    uglify: {
      dist:{
        src:['<%=src.jsCore%>','<%=src.jsProject%>'],
        dest:'<%=distdir%>/main.js'
      }
    },
    cssmin : {
      target : {
        files : {
          '<%=distdir%>/widget.min.css':['<%=distdir%>/widget.css']
        }
      }
    },
    less: {
      development: {
        options: {
          paths: ["styles/css"]
        },
        files: {
          'styles/css/layout.css':'styles/less/layout.less'
        }
      }
    },
    watch: {
      scripts: {
        files: ['**/*.js'],
        tasks: ['default'],
        options: {
          spawn: false
        }
      }
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        }
      },
      uses_defaults: ['<%=src.jsProject%>']
    }
  });
};