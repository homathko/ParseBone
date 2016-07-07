var gulp = require('gulp')
var path = require('path')
var include = require('gulp-include')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var sourcemaps = require('gulp-sourcemaps')
var configVars = require('../configVars.js')

/**
 * Transpile and minify source JavaScript code using Webpack and Babel
 */
gulp.task('compileJs', function (cb) {
  return gulp.src('./' + configVars['js']['srcPath'] + configVars['js']['entryFile'])
    .pipe(include({
      extensions: 'js',
      hardFail: true,
      includePaths: [
        path.join(__dirname, '../node_modules'),
        path.join(__dirname, '../src')
      ]
    }))
    .pipe(gulp.dest('./' + configVars['global']['outputPath']))
    .pipe(sourcemaps.init())
    .pipe(uglify({
      preserveComments: 'license'
    }))
    .pipe(rename({ extname: '.min.js' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./' + configVars['global']['outputPath'] + configVars['js']['outputPath']))
})
