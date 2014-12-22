# grunt-batch-git-clone

> Clones multiple git repos into the specified folders. 

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

### Usage Examples

#### Default Options
The only option is the location of the JSON config file - provide this as follows : 

```js
grunt.initConfig({
  batch_git_clone: {
    options: {
      configFile:"sample.json"
    }
  },
});
```

Your JSON file should be in this format :
```
{
  "clones": {
    "promises": {
      "q" : "git@github.com:kriskowal/q.git",
      "async" : "git@github.com:caolan/async.git"
    },
    "rust": {
      "rust_game" : "git@github.com:benbrunton/rusteroids.git"
    },
    "frameworks": {
      "angular" : "git@github.com:angular/angular.git"
    }
  }
}
```

This will create the following paths, existing folders will be deleted if they are already there.
```
/clones/promises/q
/clones/promises/async
/clones/rust/rust_game
/clones/frameworks/angular
```

The relevant git repos will then be cloned in to those folders.


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
