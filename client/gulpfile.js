"use strict";

let gulp = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let browserify = require('browserify');
let watchify = require('watchify');
let babel = require('babelify');
let sass = require('gulp-sass');

gulp.task('build:js', () => {
    let bundler = browserify('./app/index.js', { debug: true }).transform(babel);

    return bundler.bundle()
        .on('error', function (err) { console.error(err); this.emit('end'); })
        .pipe(source('bundle.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build:sass', () => {
    return gulp.src('./scss/style.scss')
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sass())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('build:copy', () => {
    return gulp.src('./public/**.*')
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['build:js', 'build:sass', 'build:copy']);

gulp.task('watch', ['build'], () => {
    gulp.watch('./app/**/*.js', ['build:js']);
    gulp.watch('./sass/**/*.scss', ['build:sass']);
    gulp.watch('./public/**.*', ['build:copy']);
});

gulp.task('default', ['build']);