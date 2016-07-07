/* global require: false, localStorage: false */
;(function (root) {
  root.Parse = root.Parse || {}
  var Parse = root.Parse

  var Storage = {
    async: false
  }

  var hasLocalStorage = (typeof localStorage !== 'undefined')
  if (hasLocalStorage) {
    try {
      localStorage.setItem('supported', true)
      localStorage.removeItem('supported')
    } catch (e) {
      hasLocalStorage = false
    }
  }
  if (hasLocalStorage) {
    Storage.getItem = function (path) {
      return localStorage.getItem(path)
    }

    Storage.setItem = function (path, value) {
      return localStorage.setItem(path, value)
    }

    Storage.removeItem = function (path) {
      return localStorage.removeItem(path)
    }

    Storage.clear = function () {
      return localStorage.clear()
    }
  } else if (typeof require === 'function' && typeof (require.ensure) === 'undefined') {
    var AsyncStorage
    try {
      AsyncStorage = require('AsyncStorage')

      Storage.async = true

      Storage.getItemAsync = function (path) {
        var p = new Parse.Promise()
        AsyncStorage.getItem(path, function (err, value) {
          if (err) {
            p.reject(err)
          } else {
            p.resolve(value)
          }
        })
        return p
      }

      Storage.setItemAsync = function (path, value) {
        var p = new Parse.Promise()
        AsyncStorage.setItem(path, value, function (err) {
          if (err) {
            p.reject(err)
          } else {
            p.resolve(value)
          }
        })
        return p
      }

      Storage.removeItemAsync = function (path) {
        var p = new Parse.Promise()
        AsyncStorage.removeItem(path, function (err) {
          if (err) {
            p.reject(err)
          } else {
            p.resolve()
          }
        })
        return p
      }

      Storage.clear = function () {
        AsyncStorage.clear()
      }
    } catch (e) {}
  }
  if (!Storage.async && !Storage.getItem) {
    var memMap = Storage.inMemoryMap = {}
    Storage.getItem = function (path) {
      if (memMap.hasOwnProperty(path)) {
        return memMap[path]
      }
      return null
    }

    Storage.setItem = function (path, value) {
      memMap[path] = String(value)
    }

    Storage.removeItem = function (path) {
      delete memMap[path]
    }

    Storage.clear = function () {
      for (var key in memMap) {
        if (memMap.hasOwnProperty(key)) {
          delete memMap[key]
        }
      }
    }
  }

  // We can use synchronous methods from async scenarios, but not vice-versa
  if (!Storage.async) {
    Storage.getItemAsync = function (path) {
      return Parse.Promise.as(
        Storage.getItem(path)
      )
    }

    Storage.setItemAsync = function (path, value) {
      Storage.setItem(path, value)
      return Parse.Promise.as(value)
    }

    Storage.removeItemAsync = function (path) {
      return Parse.Promise.as(
        Storage.removeItem(path)
      )
    }
  }

  Parse.Storage = Storage
})(this)
