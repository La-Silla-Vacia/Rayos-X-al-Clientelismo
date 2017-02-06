const gulp = require('gulp');
const babelify = require('babelify');
const uglify = require('gulp-uglify');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();

gulp.task('scripts', () => {
  var bundler = browserify({
    entries: './src/script.es6',
    debug: true
  })
    .transform(babelify, {presets: ['es2015']})
    .bundle();

  return bundler
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('sass', () => {
  return gulp.src('./sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*.*', ['scripts']);
  gulp.watch('./sass/**/*.scss', ['sass']);
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], () => {

  browserSync.init({
    server: "./"
  });

  gulp.watch('./src/**/*.*', ['scripts']);
  gulp.watch('./sass/**/*.scss', ['sass']);
  gulp.watch('./*.html').on('change', browserSync.reload);
});

gulp.task('default', ['serve', 'sass', 'scripts']);