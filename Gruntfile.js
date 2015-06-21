var config = require("grunt-settings");

module.exports = function (grunt) {
  config.init(grunt);

  config.set("pkg", grunt.file.readJSON("package.json"));

  config.set("mocha", {
    all: {
      src: ["spec/index.html"]
    },

    options: {
      run: true
    }
  });

  config.set("meta.banner",
    '/*! <%= pkg.name %> v<%= pkg.version %> | ' +
    '(c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> |' +
    ' <%= pkg.author.url %> */'
  );

  config.set("clean.dist.src", ["dist"]);

  config.set("concat.dist", {
    src: ["src/fluxo_react_connect_stores.js"],
    dest: "dist/fluxo_react_connect_stores.js",
    options: {
      banner: "<%= meta.banner %>\n",
    }
  });

  config.set("uglify.dist", {
    options: {
      banner: "<%= meta.banner %>",
      sourceMap: true,
      sourceMapName: "dist/fluxo_react_connect_stores.map"
    },

    files: {
      "dist/fluxo_react_connect_stores.min.js": "src/fluxo_react_connect_stores.js"
    }
  });

  grunt.loadNpmTasks("grunt-contrib-clean");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-mocha");

  config.registerTask("build", [
    "clean:dist",
    "concat:dist",
    "uglify:dist"
  ]);

  grunt.registerTask("test", ["build", "mocha"]);
};
