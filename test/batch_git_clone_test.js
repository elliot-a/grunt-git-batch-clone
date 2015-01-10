'use strict';

var grunt     = require('grunt');
var rimraf    = require('rimraf');


/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/





exports.batch_git_clone = {

  setUp: function(done) {

    // no setup really needed
    done();
  },

  standard: function(test) {

    // read in the config file.
    var config = grunt.file.readJSON('config-standard.json');
    var pathList = [];

    // create an array of repos which included the path of each repo.
    // works recursively.
    getItemList(config, '');

    function getItemList(object, path){
      for (var prop in object){
        if(typeof object[prop] === 'object'){
          var newPath = path + (prop+'/');
          getItemList(object[prop], newPath);
        }else{
          pathList.push(path+prop);
        }
      }
    }

    test.expect(5);

    for (var i = 0; i < pathList.length; i++) {
      test.equal(grunt.file.isDir(pathList[i]), true);
    }

    test.done();
  },


  withNPM: function(test) {

    // read in the config file.
    var config = grunt.file.readJSON('config-with-dependencies.json');
    var pathList = [];

    // create an array of repos which included the path of each repo.
    // works recursively.
    getItemList(config, '');

    function getItemList(object, path){
      for (var prop in object){
        if(typeof object[prop] === 'object'){
          var newPath = path + (prop+'/');
          getItemList(object[prop], newPath);
        }else{
          pathList.push(path+prop);
        }
      }
    }

    test.expect(4);

    for (var i = 0; i < pathList.length; i++) {
      console.log(pathList[i]+'/node_modules');
      test.equal(grunt.file.isDir(pathList[i]+'/node_modules'), true);
    }

    test.done();
  },

  withOverwrite : function(test){

    // This test will be completed when I can add callback to a task in grunt,
    // see https://github.com/gruntjs/grunt/issues/1184

    /*
    grunt.file.mkdir('clones-with-overwrite/q/this-should-be-deleted');

    runTask.loadNpmTasks('batch_git_clone');
    var task = runTask.task('batch_git_clone', {
      default: {
        options: {
          configFile: 'config-with-overwrite.json',
          overWrite: true
        }
      }
    });

    task.run('default', function(err){
      console.error(err);
      test.equal(grunt.file.isDir('clones-with-overwrite/q/this-should-be-deleted'), false);
      test.done();
    })
    */

    test.done();

  }


};
