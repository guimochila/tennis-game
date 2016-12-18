'use strict';

// Gulfile.js for Tennis-game app
var gulp = require('gulp');
var gutil = require('gulp-util');
var eslint = require('gulp-eslint');
var autoprefixer = require('gulp-autoprefixer');
var plumber = require('gulp-plumber');
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');

// Build Javascript
gulp.task('javascript', function () {
  return gulp.src('src/assets/js/app.js')
    .pipe(sourcemaps.init())
    .pipe(uglify()).on('error', gutil.log)
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/assets/js'));
});

// HTML copy task
gulp.task('html', function () {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('build/'));
});

// Vendor's Style task
gulp.task('vendor-styles', function () {
  return gulp.src('src/assets/vendors/css/*.css')
    .pipe(plumber(function (err) {
      gutil.log('Styles task error: \n' + err);
      this.emit('end');
    }))
    .pipe(cleanCSS())
    .pipe(gulp.dest('build/assets/vendors/css'));
});

// Build SASS files
gulp.task('sass', function () {
  return gulp.src('src/assets/sass/*.scss')
    .pipe(plumber(function (err) {
      gutil.log('Sass task error: \n' + err);
      this.emit('end');
    }))
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('build/assets/css'))
    .pipe(browserSync.reload({
      stream: true
    }));
});
// Eslint task - check for syntax error
gulp.task('lint', function () {
  return gulp.src('src/assets/js/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// Browser-sync reload
gulp.task('reload', function (done) {
  browserSync.reload();
  done();
});

// Watch task
gulp.task('watch', ['default'], function () {
  browserSync.init({
    server: {
      baseDir: './build'
    }
  });

  gulp.watch('src/*.html', ['html', 'reload']);
  gulp.watch('src/assets/sass/**/*.scss', ['sass', 'reload']);
  gulp.watch('src/assets/js/app.js', ['javascript', 'reload']);
});

// Default task
gulp.task('default', ['html', 'vendor-styles', 'sass', 'lint', 'javascript'], function () {});
