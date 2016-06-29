/**
 * Configuration values
 */
module.exports = {
  global: {
    gulpPath: 'gulp/',
    outputPath: 'build/',
    cleanWhitelist: ['index.html']
  },
  js: {
    fileGlob: '**/*.js',
    srcPath: 'src/',
    entryFile: 'parsebone.js',
    libraryName: 'parsebone',
    outputPath: '',
    outputFile: 'parsebone.js',
    outputMinFile: 'parsebone.min.js'
  }
}
