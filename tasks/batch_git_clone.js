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

    // todo - this should probably just delete the appropriate folders, not the whole thing.
    // delete the git clones folder before repopulating it
    var deleteOldFiles = function(){

      var deferred = Q.defer();

      rimraf(options.rootFolder,  function(err){
        if(err) {
          //console.log('Error deleting stuff : ');
          //console.log(err);
          deferred.reject(err);
        }else{
          //console.log('No error deleting stuff');
          deferred.resolve();
        }
      });

      return deferred.promise;

    }


    function cloneRepo(item){

      var deferred = Q.defer();

      var repoURL = item.repo;
      var path = options.rootFolder+'/'+item.location+'/'+item.repoName;
      var args = ['clone', repoURL, path];
      grunt.log.writeln('Cloning "'+repoURL+'" ==> '+path);
      grunt.log.writeln('');
      var process = spawn('git', args);

      process.stdout.on('data', function(data) {
        //console.log('stdout: ' + data);
      });

      process.stderr.on('data', function(data) {
        //console.log('stderr: ' + data);
      });

      process.on('close', function(code) {
        //console.log('child process exited with code ' + code);
        deferred.resolve();
      });

      return deferred.promise;

    }

    function map (arr, iterator) {
      // execute the func for each element in the array and collect the results
      var promises = arr.map(function (el) { return iterator(el) })
      return Q.all(promises) // return the group promise
    }


    // start the process
    deleteOldFiles().then(function(){

      // read in the config file.
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

      map(items, cloneRepo).then(function(){
        grunt.log.writeln('All repos cloned successfully');
        done();
      },function(err){
        grunt.log.warn('An error has occured.');
      });

    },function(err){
      grunt.log.warn('There was an error deleting the existing repo folder : '+err);
    });


  });

};


