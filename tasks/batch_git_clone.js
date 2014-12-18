/*
 * grunt-batch-git-clone
 * https://github.com/elliot-a/grunt-git-batch-clone
 *
 * Copyright (c) 2014 Elliot Agro
 * Licensed under the MIT license.
 */

'use strict';

var spawn   = require('child_process').spawn;
var rimraf  = require('rimraf');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('batch_git_clone', 'Clones multiple git repos into specified folders.', function() {

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      usePropertyFolders: 'true',
      rootFolder: 'git_clones',
      configFile:'*EMPTY*'
    });

    // check if configFile option has been entered.
    if(options.configFile === '*EMPTY*'){
      grunt.log.warn('Please provide a configFile to batch-git-clone');
      return false;
    }

    // check configFile Exists
    if (!grunt.file.exists(options.configFile)) {
      grunt.log.warn('Source file "' + options.configFile + '" not found.');
      return false;
    }

    // stop users setting the repo folder as root
    if(options.rootFolder === '/' || options.rootFolder === './' || options.rootFolder === ''){
      grunt.log.warn('You have to use a folder for your cloned repos as this folder is deleted each run');
      return false;
    }

    //
    rimraf(options.rootFolder,  function(err){
      if(err) {
        console.log(err);
      }else{
        console.log('no error deleting stuff');
      }
    });



    var config = grunt.file.readJSON(options.configFile);

    // prepare array of items to create
    var items = [];
    for(var loc in config){
      for(var repo in config[loc]){
        var item = {
          location : loc,
          repoName : repo,
          repo     : config[loc][repo]
        };
        items.push(item);
      }
    }


    console.dir(items[0]);
    var args = ['clone', items[0].repo, options.rootFolder+'/'+items[1].location+'/'+items[1].repoName];

    var process = spawn('git', args);
    process.stdout.on('data', stdFn);
    process.stderr.on('data', errFn);
    process.on('close', closeFn);

    function stdFn(data) {
      console.log('stdout: ' + data);
    }

    function errFn(data) {
      console.log('stderr: ' + data);
    }

    function closeFn(code) {
      console.log('child process exited with code ' + code);
    }


    /*

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {

      // Concat specified files.
      var src = f.src.filter(function(filepath) {

        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }

      }).map(function(filepath) {
        // Read file source.
        return grunt.file.read(filepath);
      }).join(grunt.util.normalizelf(options.separator));

      // Handle options.
      src += options.punctuation;

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');

    });

    */


  });

};


