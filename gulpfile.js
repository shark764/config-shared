'use strict';

var gulp = require('gulp');
var karma = require('karma').Server;
var concat = require('gulp-concat');
var concatStream = require('concat-stream');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var path = require('path');
var plumber = require('gulp-plumber');
var runSequence = require('run-sequence');
var jshint = require('gulp-jshint');
var wiredep = require('wiredep');
var _ = require('lodash');
var gutil = require('gulp-util');
var debug = require('gulp-debug');

var templateCache = require('gulp-angular-templatecache');
var eventStream = require('event-stream');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

/**
 * File patterns
 **/

// Root directory
var rootDirectory = path.resolve('./');

// Source directory for build process
var sourceDirectory = path.join(rootDirectory, './src');

var sourceFiles = [

  // Make sure module files are handled first
  path.join(sourceDirectory, '/**/*.module.js'),

  // Then add all JavaScript files
  path.join(sourceDirectory, '/**/*.js'),

  path.join('!' + sourceDirectory, '/**/*.spec.js')
];

gulp.task('build', ['styles'], function () {
  eventStream.merge(gulp.src(sourceFiles), gulp.src('src/**/*.html')
      .pipe(templateCache({
        module: 'liveopsConfigPanel.shared.directives'
      })))
    .pipe(concat('liveops-config-panel-shared.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename('liveops-config-panel-shared.min.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('styles', function () {
  var sassOptions = {
    style: 'expanded'
  };

  function errorHandler(title) {
    return function(err) {
      gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
      this.emit('end');
    };
  }

  var styleFiles = gulp.src([
    'src/liveops-config-panel-shared/sass/_constants.scss',
    'src/liveops-config-panel-shared/sass/_mixins.scss',
    'src/liveops-config-panel-shared/sass/_fonts.scss',
    'src/liveops-config-panel-shared/sass/_components.scss',
    'src/liveops-config-panel-shared/sass/_inputs.scss',
    'src/liveops-config-panel-shared/sass/_layout.scss',
    'src/liveops-config-panel-shared/sass/_default_theme.scss',
    'src/liveops-config-panel-shared/index.scss',
    'src/liveops-config-panel-shared/directives/**/*.scss',
    'src/liveops-config-panel-shared/filters/**/*.scss',
    'src/liveops-config-panel-shared/services/**/*.scss',
    'src/liveops-config-panel-shared/util/**/*.scss'
  ]);

  return styleFiles
    .pipe(concat('styles.scss'))
    .pipe(gulp.dest('./dist/'))
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassOptions)).on('error', errorHandler('Sass'))
    .pipe($.autoprefixer()).on('error', errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(rename('styles.css'))
    .pipe(gulp.dest('./dist/'));
});

/**
 * Process build
 */
gulp.task('process-build', function (done) {
  runSequence('jshint', 'build', done);
});

/**
 * Process all
 */
gulp.task('process-all', function (done) {
  runSequence('jshint', 'test', 'build', done);
});

/**
 * Watch task
 */
gulp.task('watch', function () {

  // Watch JavaScript files
  gulp.watch(sourceFiles, ['process-build']);
});

/**
 * Watch task with test
 */
gulp.task('watch:test', function () {

  // Watch JavaScript files
  gulp.watch(sourceFiles, ['process-all']);
});

/**
 * Validate source JavaScript
 */
gulp.task('jshint', function () {
  return gulp.src(sourceFiles)
    .pipe(plumber())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});


function listFiles(callback) {
  var wiredepOptions = {
    directory: 'bower_components',
    dependencies: true,
    devDependencies: true
  };
  var bowerDeps = wiredep(wiredepOptions);

  var htmlFiles = [
    'src/**/*.html'
  ];

  var allSpecFiles = [
    'src/**/*.spec.js',
    'src/**/*.mock.js'
  ];

  var srcFiles = [
    'src/liveops-config-panel-shared/liveopsConfigPanel.shared.module.js',
    'src/**/*.js'
  ].concat(allSpecFiles.map(function (file) {
    return '!' + file;
  }));

  gulp.src(srcFiles)
    .pipe(concatStream(function (files) {
      callback(bowerDeps.js
        .concat(_.pluck(files, 'path'))
        .concat(htmlFiles)
        .concat(allSpecFiles));
    }));
}

/**
 * Run test once and exit
 */
gulp.task('test', function (done) {
  listFiles(function (files) {
    const karmaServer = new karma({
      configFile: __dirname + '/karma.conf.js',
      files: files,
      singleRun: true
    }, done);
    karmaServer.start();
  });
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-concatenated', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-concatenated.conf.js',
    singleRun: true
  }, done);
});

/**
 * Run test once and exit
 */
gulp.task('test-dist-minified', function (done) {
  karma.start({
    configFile: __dirname + '/karma-dist-minified.conf.js',
    singleRun: true
  }, done);
});

gulp.task('default', function () {
  runSequence('process-all', 'watch');
});
