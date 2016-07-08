/* global define */

/*!
 * Parse JavaScript SDK
 * Version: 1.5.0
 * Built: Fri Jul 10 2015 17:05:46
 * http://parse.com
 *
 * Copyright 2015 Parse, LLC
 *
 * Includes: Underscore.js
 * Copyright 2009-2012 Jeremy Ashkenas, DocumentCloud Inc.
 * Released under the MIT license.
 */
var moduleExport

if ((typeof define === 'function' && define.amd) || (typeof module === 'object' && module.exports)) {
  moduleExport = {}
} else {
  moduleExport = this
}

;(function () {
  this.Parse = {}
  this.Parse.VERSION = 'js1.5.0'

  /* eslint-disable semi */
  ; // Added so that the syntax for the self executing functions in the Underscore module is correct
  /* eslint-enable semi */

  // =require underscore/underscore.js
  // =require parse.js
  // =require storage.js
  // =require analytics.js
  // =require config.js
  // =require error.js
  // =require events.js
  // =require geopoint.js
  // =require acl.js
  // =require op.js
  // =require relation.js
  // =require promise.js
  // =require file.js
  // =require object.js
  // =require role.js
  // =require collection.js
  // =require view.js
  // =require user.js
  // =require session.js
  // =require query.js
  // =require facebookutils.js
  // =require history.js
  // =require router.js
  // =require cloud.js
  // =require push.js

  this._ = this.Parse._
}).call(moduleExport)

if (typeof define === 'function' && define.amd) {
  define(moduleExport)
} else if (typeof module === 'object' && module.exports) {
  module.exports = moduleExport
}
