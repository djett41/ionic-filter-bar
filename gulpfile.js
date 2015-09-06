var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var karma = require('karma').server;
var uglify = require('gulp-uglify');

var karmaConf = require('./karma.conf.js');
var paths = {
  sass: ['./scss/**/*.scss'],
  js: ['js/**/*.js'],
  dist: './dist'
};

gulp.task('default', ['karma']);
gulp.task('dist', ['karma', 'scripts']);

gulp.task('scripts', function() {
  return gulp.src([
    'js/ionic.filter.bar.js',
    'js/ionic.filter.bar.directive.js',
    'js/ionic.filter.bar.config.js',
    'js/ionic.filter.bar.service.js',
    'js/ionic.filter.bar.modal.js'
  ])
    .pipe(concat('ionic.filter.bar.js'))
    .pipe(gulp.dest(paths.dist))
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))
    .pipe(gulp.dest(paths.dist));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.filter.bar.scss')
    /*
      Since this is a plugin, we dont want to include ionic scss in dist.  Don't think there is a way to compile scss
      using ionic vars/mixins without including it in the compiled file.
      For now we need to manually add @import "../bower_components/ionic/scss/ionic"; to the scss file,
      run this gulp task, remove ionic css in css file (inlcuding minified version), then remove the import in scss
     */
    .pipe(sass({ errLogToConsole: true }))
    .pipe(gulp.dest(paths.dist))
    .pipe(minifyCss({ keepSpecialComments: 0 }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest(paths.dist))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('karma', function(done) {
  karmaConf.singleRun = true;
  karma.start(karmaConf, done);
});

gulp.task('karma-watch', function(done) {
  karmaConf.singleRun = false;
  karma.start(karmaConf, done);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});
