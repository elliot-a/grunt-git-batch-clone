# grunt-batch-git-clone

> Clones multiple git repos into the specified folders.

This plugin enables you to install and setup multiple git repos into a specified folder structure. You can then run commands on each folder such as ```npm install```.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-batch-git-clone --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-batch-git-clone');
```

## The "batch_git_clone" task

### Overview
In your project's Gruntfile, add a section named `batch_git_clone` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  batch_git_clone: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.configFile
Type: `String`
Default value: `none`

The location of your .json file that describes which git repos you want to clone and where they should go.

#### options.postClone
Type: `String`
Default value: ``

If you need to run a command after you have cloned your repos, you should add it here. If you need to run multiple commands they should be
separated by the && symbol. eg 'npm install && bower install'

#### options.overWrite
Type: `Boolean`
Default value: `false`

The overWrite setting stops the plugin deleting folders that already exist. So if you run plugin and the folder is already there then
it will not do anything. If overWrite is set to true if the folder exists then it be deleted before the clone takes place.


### Usage Examples

#### Default Options
The only option is the location of the JSON config file - provide this as follows : 

```js
grunt.initConfig({
  batch_git_clone: {
    options: {
      configFile:"sample.json",
      postClone:"npm install && bower install",
      overWrite:true
    }
  },
});
```

Your JSON file should be in this format, you can use https or ssh links (but see the got'ya below) :
```
{
  "clones-folder": {
    "promises": {
      "q" : "https://github.com/kriskowal/q.git",
      "async" : "https://github.com/caolan/async.git"
    },
    "rust": {
      "rust_game" : "https://github.com/benbrunton/rusteroids.git"
    },
    "frameworks": {
      "front": {
        "angular" : "git@github.com:angular/angular.git"
      },
      "angular" : "git@github.com:angular/angular.git"
    }
  }
}
```

This will create the following paths, existing folders will be deleted if they are already there as overWrite is set to true.
```
/clones-folder/promises/q
/clones-folder/promises/async
/clones-folder/rust/rust_game
/clones-folder/frameworks/front/angular
/clones-folder/frameworks/angular
```

The relevant git repos will then be cloned in to those folders.

## Gotya's

Bear in mind that if you choose to use this on server during deployment you should use the 'https' links to the git repos as the keys will not be available to use the 'git@' version.

## Tests

To run the tests run ```grunt test```.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
