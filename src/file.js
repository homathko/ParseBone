;(function (root) {
  root.Parse = root.Parse || {}
  var Parse = root.Parse
  var _ = Parse._

  var b64Digit = function (number) {
    if (number < 26) {
      return String.fromCharCode(65 + number)
    }
    if (number < 52) {
      return String.fromCharCode(97 + (number - 26))
    }
    if (number < 62) {
      return String.fromCharCode(48 + (number - 52))
    }
    if (number === 62) {
      return '+'
    }
    if (number === 63) {
      return '/'
    }
    throw new Error('Tried to encode large digit ' + number + ' in base64.')
  }

  var encodeBase64 = function (array) {
    var chunks = []
    chunks.length = Math.ceil(array.length / 3)
    _.times(chunks.length, function (i) {
      var b1 = array[i * 3]
      var b2 = array[i * 3 + 1] || 0
      var b3 = array[i * 3 + 2] || 0

      var has2 = (i * 3 + 1) < array.length
      var has3 = (i * 3 + 2) < array.length

      chunks[i] = [
        b64Digit((b1 >> 2) & 0x3F),
        b64Digit(((b1 << 4) & 0x30) | ((b2 >> 4) & 0x0F)),
        has2 ? b64Digit(((b2 << 2) & 0x3C) | ((b3 >> 6) & 0x03)) : '=',
        has3 ? b64Digit(b3 & 0x3F) : '='
      ].join('')
    })
    return chunks.join('')
  }

  /**
   * Reads a File using a FileReader.
   * @param file {File} the File to read.
   * @param type {String} (optional) the mimetype to override with.
   * @return {Parse.Promise} A Promise that will be fulfilled with a
   *     base64-encoded string of the data and its mime type.
   */
  var readAsync = function (file, type) {
    var promise = new Parse.Promise()

    if (typeof (FileReader) === 'undefined') {
      return Parse.Promise.error(new Parse.Error(
        Parse.Error.FILE_READ_ERROR,
        'Attempted to use a FileReader on an unsupported browser.'))
    }

    var reader = new FileReader()
    reader.onloadend = function () {
      if (reader.readyState !== 2) {
        promise.reject(new Parse.Error(
          Parse.Error.FILE_READ_ERROR,
          'Error reading file.'))
        return
      }

      var dataURL = reader.result
      var matches = /^data:([^;]*);base64,(.*)$/.exec(dataURL)
      if (!matches) {
        promise.reject(new Parse.Error(
          Parse.Error.FILE_READ_ERROR,
          'Unable to interpret data URL: ' + dataURL))
        return
      }

      promise.resolve(matches[2], type || matches[1])
    }
    reader.readAsDataURL(file)
    return promise
  }

  /**
   * A Parse.File is a local representation of a file that is saved to the Parse
   * cloud.
   * @class
   * @param name {String} The file's name. This will be prefixed by a unique
   *     value once the file has finished saving. The file name must begin with
   *     an alphanumeric character, and consist of alphanumeric characters,
   *     periods, spaces, underscores, or dashes.
   * @param data {Array} The data for the file, as either:
   *     1. an Array of byte value Numbers, or
   *     2. an Object like { base64: "..." } with a base64-encoded String.
   *     3. a File object selected with a file upload control. (3) only works
   *        in Firefox 3.6+, Safari 6.0.2+, Chrome 7+, and IE 10+.
   *        For example:<pre>
   * var fileUploadControl = $("#profilePhotoFileUpload")[0]
   * if (fileUploadControl.files.length > 0) {
   *   var file = fileUploadControl.files[0]
   *   var name = "photo.jpg"
   *   var parseFile = new Parse.File(name, file)
   *   parseFile.save().then(function() {
   *     // The file has been saved to Parse.
   *   }, function(error) {
   *     // The file either could not be read, or could not be saved to Parse.
   *   })
   * }</pre>
   * @param type {String} Optional Content-Type header to use for the file. If
   *     this is omitted, the content type will be inferred from the name's
   *     extension.
   */
  Parse.File = function (name, data, type) {
    this._name = name

    // Guess the content type from the extension if we need to.
    var extension = /\.([^.]*)$/.exec(name)
    if (extension) {
      extension = extension[1].toLowerCase()
    }
    var specifiedType = type || ''

    if (_.isArray(data)) {
      this._source = Parse.Promise.as(encodeBase64(data), specifiedType)
    } else if (data && data.base64) {
      // if it contains data uri, extract based64 and the type out of it.
      var dataUriRegexp = /^data:([a-zA-Z]*\/[a-zA-Z+.-]*);(charset=[a-zA-Z0-9\-\/\s]*,)?base64,(\S+)/

      var matches = dataUriRegexp.exec(data.base64)
      if (matches && matches.length > 0) {
        // if data URI with charset, there will have 4 matches.
        this._source = Parse.Promise.as(
          (matches.length === 4 ? matches[3] : matches[2]), matches[1]
        )
      } else {
        this._source = Parse.Promise.as(data.base64, specifiedType)
      }
    } else if (typeof (File) !== 'undefined' && data instanceof File) {
      this._source = readAsync(data, type)
    } else if (_.isString(data)) {
      throw new Error('Creating a Parse.File from a String is not yet supported.')
    }
  }

  Parse.File.prototype = {

    /**
     * Gets the name of the file. Before save is called, this is the filename
     * given by the user. After save is called, that name gets prefixed with a
     * unique identifier.
     */
    name: function () {
      return this._name
    },

    /**
     * Gets the url of the file. It is only available after you save the file or
     * after you get the file from a Parse.Object.
     * @return {String}
     */
    url: function () {
      return this._url
    },

    /**
     * Saves the file to the Parse cloud.
     * @param {Object} options A Backbone-style options object.
     * @return {Parse.Promise} Promise that is resolved when the save finishes.
     */
    save: function (options) {
      options = options || {}

      var self = this
      if (!self._previousSave) {
        self._previousSave = self._source.then(function (base64, type) {
          var data = {
            base64: base64,
            _ContentType: type
          }
          return Parse._request({
            route: 'files',
            className: self._name,
            method: 'POST',
            data: data,
            useMasterKey: options.useMasterKey
          })
        }).then(function (response) {
          self._name = response.name
          self._url = response.url
          return self
        })
      }
      return self._previousSave._thenRunCallbacks(options)
    }
  }
}(this))
