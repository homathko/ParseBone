;(function (root) {
  root.Parse = root.Parse || {}
  var Parse = root.Parse

  /**
   * @class
   *
   * <p>A Parse.Session object is a local representation of a revocable session.
   * This class is a subclass of a Parse.Object, and retains the same
   * functionality of a Parse.Object.</p>
   */
  Parse.Session = Parse.Object.extend('_Session', {
    /**
     * Returns the session token string.
     * @return {String}
     */
    getSessionToken: function () {
      return this._sessionToken
    },

    /**
     * Internal method to handle special fields in a _Session response.
     */
    _mergeMagicFields: function (attrs) {
      if (attrs.sessionToken) {
        this._sessionToken = attrs.sessionToken
        delete attrs.sessionToken
      }
      Parse.Session.__super__._mergeMagicFields.call(this, attrs)
    }
  }, /** @lends Parse.Session */ {

    // Throw an error when modifying these read-only fields
    readOnlyAttributes: {
      createdWith: true,
      expiresAt: true,
      installationId: true,
      restricted: true,
      sessionToken: true,
      user: true
    },

    /**
     * Retrieves the Session object for the currently logged in session.
     * @return {Parse.Promise} A promise that is resolved with the Parse.Session
     *   object after it has been fetched.
     */
    current: function (options) {
      options = options || {}

      var session = Parse.Object._create('_Session')
      var currentToken = Parse.User.current().getSessionToken()
      return Parse._request({
        route: 'sessions',
        className: 'me',
        method: 'GET',
        useMasterKey: options.useMasterKey,
        sessionToken: currentToken
      }).then(function (resp, status, xhr) {
        var serverAttrs = session.parse(resp, status, xhr)
        session._finishFetch(serverAttrs)
        return session
      })._thenRunCallbacks(options, session)
    },

    /**
     * Determines whether a session token is revocable.
     * @return {Boolean}
     */
    _isRevocable: function (token) {
      return token.indexOf('r:') > -1
    },

    /**
     * Determines whether the current session token is revocable.
     * This method is useful for migrating Express.js or Node.js web apps to
     * use revocable sessions. If you are migrating an app that uses the Parse
     * SDK in the browser only, please use Parse.User.enableRevocableSession()
     * instead, so that sessions can be automatically upgraded.
     * @return {Boolean}
     */
    isCurrentSessionRevocable: function () {
      if (Parse.User.current() !== null) {
        return Parse.Session._isRevocable(
          Parse.User.current().getSessionToken()
        )
      }
    }
  })
})(this)
