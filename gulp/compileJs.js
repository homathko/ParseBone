var gulp = require('gulp')
var webpack = require('webpack')
var configVars = require('../configVars.js')

/**
 * Transpile and minify source JavaScript code using Webpack and Babel
 */
gulp.task('compileJs', function (cb) {
  webpack({
    entry: './' + configVars['js']['srcPath'] + configVars['js']['entryFile'],
    output: {
      library: configVars['js']['libraryName'],
      libraryTarget: 'umd',
      umdNamedDefine: true,
      filename: configVars['js']['outputFile'],
      path: './' + configVars['global']['outputPath'],
      devtoolModuleFilenameTemplate: '/[resource-path]'
    },
    module: {
      loaders: [
        {
          test: /^(.(?!\.spec))*\.js$/,
          loader: 'babel',
          query: {
            presets: ['es2015'],
            plugins: ['transform-object-assign'],
            cacheDirectory: true
          }
        }
      ]
    },
    cache: true
  }, function (err, res) {
    if (err) {
      console.error(err)
      process.exit(1)
    } else {
      cb()
    }
  })
})
