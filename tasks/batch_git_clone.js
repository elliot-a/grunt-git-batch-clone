/*
 * grunt-batch-git-clone
 * https://github.com/elliot-a/grunt-git-batch-clone
 *
 * Copyright (c) 2014 Elliot Agro
 * Licensed under the MIT license.
 */

'use strict';

var spawn   = require('child_process').spawn;
var exec    = require('child_process').exec;
var rimraf  = require('rimraf');
var Q       = require('q');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('batch_git_clone', 'Clones multiple git repos into specified folders.', function() {

    var done      = this.async();

    // The processed list of git repos
    var repoList  = [];

    // This is a flag which will stop the process if an error occurs at any stage.
    var errorOccured = false;

    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      configFile:'*EMPTY*',
      postClone:'',
      overWrite: false
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

      var deferred = Q.defer();

      // Don't delete existing files & folders if overwrite is off
      if(options.overWrite !== false){

        grunt.log.writeln('---> Deleting folder ==> '+path);

        rimraf(path,  function(err){
          if(err) {
            grunt.log.warn('---> There was an error deleting the existing repo folder : '+path+', error : '+err);
            deferred.reject(err);
          }else{
            deferred.resolve();
          }
        });

      }else{

        if(grunt.file.isDir(path)){
          grunt.log.writeln('---> Folder exists so plugin will not overwrite ==> '+path);
        }


        deferred.resolve();
      }


      return deferred.promise;

    };


    // creates a spawn process and clones the repos
    function cloneRepo(item){

      var deferred = Q.defer();
      var repoURL = item.repo;
      var path = item.path;
      var args = ['clone', repoURL, path, '&&', 'pwd'];

      deleteOldFiles(path).then( function(){

        if(errorOccured === true){
          deferred.reject();
          return;
        }

        if(grunt.file.isDir(path) && options.overWrite === false){
          deferred.resolve();
          return;
        }

        var msg = '---> Cloning "'+repoURL+'" ==> '+path;
        var execString = 'git clone '+repoURL+' '+path;

        if(options.postClone !== ''){
          msg += ' THEN executing "'+options.postClone+'"';
          execString += ' && cd '+path+' && '+options.postClone;
        }

        grunt.log.writeln(msg);

        var child = exec(execString);

        // add events for logging
        child.stdout.on('data', function(data) {
          grunt.log.writeln(data);
        });
        child.stderr.on('data', function(data) {
          grunt.verbose.writeln(data);
        });
        child.on('close', function(code) {
          deferred.resolve();
        });

      });

      return deferred.promise;

    }


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

    // create a empty promise to start our series (so we can use `then`)
    var currentPromise = Q();
    var promises = repoList.map(function (el) {
      return currentPromise = currentPromise.then(function () {
        // execute the next function after the previous has resolved successfully
        return cloneRepo(el);
      });
    });

    // group the results and return the group promise
    Q.all(promises).then(function(){
      done();
    });


  });

};


