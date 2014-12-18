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
var Q       = require('q');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('batch_git_clone', 'Clones multiple git repos into specified folders.', function() {

    var done = this.async();

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
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


    // delete the repo folder before repopulating it
    var deleteOldFiles = function(path){

      grunt.log.writeln('Deleting folder ==> '+path);

      var deferred = Q.defer();

      rimraf(path,  function(err){
        if(err) {
          grunt.log.warn('There was an error deleting the existing repo folder : '+path+', error : '+err);
          deferred.reject(err);
        }else{
          deferred.resolve();
        }
      });

      return deferred.promise;

    };

    // creates a spawn process and clones the repos
    function cloneRepo(item){

      var deferred = Q.defer();

      var repoURL = item.repo;
      var path = item.path;
      var args = ['clone', repoURL, path];

      deleteOldFiles(path).then(function(){

        grunt.log.writeln('Cloning "'+repoURL+'" ==> '+path);

        var process = spawn('git', args);
        process.on('close', function(code) {
          //console.log('child process exited with code ' + code);
          deferred.resolve();
        });

      });


      return deferred.promise;

    }

    // creates loopable promises list
    function map (arr, iterator) {
      // execute the func for each element in the array and collect the results
      var promises = arr.map(function (el) { return iterator(el); });
      return Q.all(promises); // return the group promise
    }

    var repoList = [];
    function getItemList(object, path){

      for (var prop in object){

        if(typeof object[prop] === 'object'){
          var newPath = path + (prop+'/');
          getItemList(object[prop], newPath);
        }else{
          var item = {
            path      : path+prop,
            repo      : object[prop]
          };
          repoList.push(item);
        }

      }

    }

    // read in the config file.
    var config = grunt.file.readJSON(options.configFile);

    // create an array of repos which included the path of each repo.
    // works recursively.
    getItemList(config, '');

    // run task
    map(repoList, cloneRepo).then(function(){
      grunt.log.writeln('All repos cloned successfully');
      done();
    },function(err){
      grunt.log.warn('An error has occured.');
    });

  });

};


