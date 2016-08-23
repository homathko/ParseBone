# ParseBone

ParseBone is a version of Parse 1.5.0 modified to be compatible with the open-source Parse server.

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](http://standardjs.com/)
[![latest-release](https://img.shields.io/github/release/MrSlide/ParseBone.svg?style=flat-square)](https://github.com/MrSlide/ParseBone/tree/master)
[![GitHub issues](https://img.shields.io/github/issues/MrSlide/ParseBone.svg?style=flat-square)](https://github.com/MrSlide/ParseBone/issues)
[![license](https://img.shields.io/github/license/MrSlide/ParseBone.svg?style=flat-square)](https://opensource.org/licenses/MIT)



## Why?

On January 28th, 2016, Facebook [announced](http://blog.parse.com/announcements/moving-on/) they would be discontinuing the [Parse](http://parse.com/) service, and provide an open-source version of [Parse Server](https://github.com/ParsePlatform/parse-server). This meant that we should host our [Parse](http://parse.com/) apps in our own servers. The problem is that the open-source version of Parse Server requires at least version 1.6.14 of the Parse JS SDK. Any versions of the [Parse JS SDK](https://github.com/ParsePlatform/Parse-SDK-JS) released after version 1.5.0 do not come with [Backbone](http://backbonejs.org/)-style functionality, which means that if you were using those features (Collection, View, Events, history, Router, etc), you cannot upgrade without a lot of refactoring, and therefore cannot move to a self hosted Parse Server.

ParseBone allows you to upgrade to a self hosted Parse Server because it keeps all the functionality of the [Parse JS SDK](https://github.com/ParsePlatform/Parse-SDK-JS) 1.5.0, including the [Backbone](http://backbonejs.org/)-style features, while being compatible with the [Parse Server](https://github.com/ParsePlatform/parse-server) (tested with version 2.2.16).



## Installation

### Via [Bower](http://bower.io/)

```
bower install parsebone
```

### Via [NPM](https://www.npmjs.com/)

```
npm install parsebone

```



## Usage

ParseBone is an [UMD](https://github.com/umdjs/umd) module. You can load it into your application either by importing the module, or loading the script in your page.

If you are importing the ParseBone module via [Webpack](https://webpack.github.io/), [Browserify](http://browserify.org/) or similar, make sure that the module name `parsebone` is being resolved correctly to the [Bower](http://bower.io/) or [NPM](https://www.npmjs.com/) packages folder.

Just like the original [Parse JS SDK](https://github.com/ParsePlatform/Parse-SDK-JS) 1.5.0, ParseBone comes bundled with [Underscore.js](http://underscorejs.org/), you do not need to load it separately.

### Via ES6 syntax

```
import {Parse, _} from 'parsebone'
```

### Via CommonJS syntax

```
var Parse = require('parsebone').Parse
var _ = require('parsebone')._
```

### Via the script tag

```
<script src="/scripts/parsebone.js"></script> // Change the path as necessary
// The objects Parse and _ will be available in the global scope
```



## F.A.Q.

### Why was ParseBone created?

Where I work, there were a few projects built with Parse, and making use of the [Backbone](http://backbonejs.org/)-style functionality. Because these projects will be around for longer than the Parse service will be available, we had the option to refactor them, or modify the [Parse JS SDK](https://github.com/ParsePlatform/Parse-SDK-JS) that we are using. Refactoring the projects was not an option due to time and cost. We researched a few projects that tried to add [Backbone](http://backbonejs.org/) style features to the newer versions of Parse, but they didn't seem to do the job very well and left out a lot of behind the scenes work that Parse did.

### If I'm not using [Backbone](http://backbonejs.org/)-style functionality, do I need something like ParseBone?

No, you should be able to upgrade to the latest versions of the [Parse JS SDK](https://github.com/ParsePlatform/Parse-SDK-JS) with ease.


### What makes ParseBone compatible with the open-source [Parse Server](https://github.com/ParsePlatform/parse-server)?

Some routes of the Parse API have changed, and ParseBone was updated to use the new routes.


### Where can I find documentation for the library?

ParseBone has the exact same API as the original [Parse JS SDK](https://github.com/ParsePlatform/Parse-SDK-JS) version 1.5.0. You can find a guide for the JS SDK at [parseplatform.github.io/docs/js/guide](http://parseplatform.github.io/docs/js/guide/). For the [Backbone](http://backbonejs.org/)-style functionality, you can find documentation on the official web site at [backbonejs.org](http://backbonejs.org/). Please note that just like the original version 1.5.0 of the [Parse JS SDK](https://github.com/ParsePlatform/Parse-SDK-JS), the Backbone features included vary slightly.


### Does ParseBone have the newer features of the [Parse JS SDK](https://github.com/ParsePlatform/Parse-SDK-JS)?

No. ParseBone is a copy of version 1.5.0 of the [Parse JS SDK](https://github.com/ParsePlatform/Parse-SDK-JS), with some changes.


### Are the newer features planned to be added to ParseBone?

No. The idea behind ParseBone is that you will be able to keep your app working without having to go through a lot of refactoring.


### What other changes were made?

The source code was modified to conform to the linting rules of [Standard](http://standardjs.com/). This should have no effect on performance or stability.


### Do I need to make any changes on my Cloud code?

There are no changes required for ParseBone, but you do need to make some changes to migrate to the open-source [Parse Server](https://github.com/ParsePlatform/parse-server). There is a migration guide available at [parse.com/migration](https://parse.com/migration).


### Is this library tested?

The library is not tested using automated testing like unit testing or end-to-end testing, but it has been used in production code and is working as expected. Still, if you find bugs, please open an issue.



## Brower support

ParseBone, although not tested in all of them, uses features supported by these browsers.

- Android Browser 4+
- Blackberry Browser 7+
- Chrome 13+
- Firefox 4+
- Internet Explorer 9+
- Opera 12+
- Opera Mini 5+
- Safari 7+



## License

Released under the [MIT](https://opensource.org/licenses/MIT) license



## Copyright

Copyright (c) 2016 Luís Rodrigues

Includes: [Parse JavaScript SDK](https://github.com/ParsePlatform/Parse-SDK-JS)
Copyright 2015 Parse, LLC

Includes: [Underscore.js](http://underscorejs.org/)
Copyright 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
