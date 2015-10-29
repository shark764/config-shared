'use strict';

var gulp = require('gulp');
var karma = require('karma').server;
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

  path.join('!', sourceDirectory, '/**/*.spec.js'),
];

var lintFiles = [
  'gulpfile.js',
  // Karma configuration
  'karma-*.conf.js'
].concat(sourceFiles);

gulp.task('build', function () {
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

  return gulp.src(['./src/**/*.scss'])
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassOptions)).on('error', options.errorHandler('Sass'))
    .pipe($.autoprefixer()).on('error', options.errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest('./dist/'));
});

/**
 * Process
 */
gulp.task('process-all', function (done) {
  runSequence('jshint', 'test', 'build', done);
});

/**
 * Watch task
 */
gulp.task('watch', function () {

  // Watch JavaScript files
  gulp.watch(sourceFiles, ['process-all']);
});

/**
 * Validate source JavaScript
 */
gulp.task('jshint', function () {
  return gulp.src(lintFiles)
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
    karma.start({
      configFile: __dirname + '/karma.conf.js',
      files: files,
      singleRun: true
    }, done);
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
