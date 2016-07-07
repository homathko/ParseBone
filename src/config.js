;(function (root) {
  root.Parse = root.Parse || {}
  var Parse = root.Parse
  var _ = Parse._

  /**
   * @class Parse.Config is a local representation of configuration data that
   * can be set from the Parse dashboard.
   */
  Parse.Config = function () {
    this.attributes = {}
    this._escapedAttributes = {}
  }

  /**
   * Retrieves the most recently-fetched configuration object, either from
   * memory or from local storage if necessary.
   *
   * @return {Parse.Config} The most recently-fetched Parse.Config if it
   *     exists, else an empty Parse.Config.
   */
  Parse.Config.current = function () {
    if (Parse.Config._currentConfig) {
      return Parse.Config._currentConfig
    }

    var config = new Parse.Config()

    if (Parse.Storage.async) {
      return config
    }

    var configData = Parse.Storage.getItem(Parse._getParsePath(
      Parse.Config._CURRENT_CONFIG_KEY))

    if (configData) {
      config._finishFetch(JSON.parse(configData))
      Parse.Config._currentConfig = config
    }
    return config
  }

  /**
   * Gets a new configuration object from the server.
   * @param {Object} options A Backbone-style options object.
   * Valid options are:<ul>
   *   <li>success: Function to call when the get completes successfully.
   *   <li>error: Function to call when the get fails.
   * </ul>
   * @return {Parse.Promise} A promise that is resolved with a newly-created
   *     configuration object when the get completes.
   */
  Parse.Config.get = function (options) {
    options = options || {}

    var request = Parse._request({
      route: 'config',
      method: 'GET'
    })

    return request.then(function (response) {
      if (!response || !response.params) {
        var errorObject = new Parse.Error(
          Parse.Error.INVALID_JSON,
          'Config JSON response invalid.')
        return Parse.Promise.error(errorObject)
      }

      var config = new Parse.Config()
      config._finishFetch(response)
      Parse.Config._currentConfig = config
      return config
    })._thenRunCallbacks(options)
  }

  Parse.Config.prototype = {

    /**
     * Gets the HTML-escaped value of an attribute.
     */
    escape: function (attr) {
      var html = this._escapedAttributes[attr]
      if (html) {
        return html
      }
      var val = this.attributes[attr]
      var escaped
      if (Parse._isNullOrUndefined(val)) {
        escaped = ''
      } else {
        escaped = _.escape(val.toString())
      }
      this._escapedAttributes[attr] = escaped
      return escaped
    },

    /**
     * Gets the value of an attribute.
     * @param {String} attr The name of an attribute.
     */
    get: function (attr) {
      return this.attributes[attr]
    },

    _finishFetch: function (serverData) {
      this.attributes = Parse._decode(null, _.clone(serverData.params))
      if (!Parse.Storage.async) {
        // We only provide local caching of config with synchronous Storage
        Parse.Storage.setItem(
          Parse._getParsePath(Parse.Config._CURRENT_CONFIG_KEY),
          JSON.stringify(serverData))
      }
    }
  }

  Parse.Config._currentConfig = null

  Parse.Config._CURRENT_CONFIG_KEY = 'currentConfig'
}(this))
