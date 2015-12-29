"use strict";

let gulp = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let browserify = require('browserify');
let watchify = require('watchify');
let babel = require('babelify');
let del = require('del');
let uglify = require('gulp-uglify');
let sass = require('gulp-sass');
let zip = require('gulp-zip');
let pkg = require('./package.json');

gulp.task('build:js', () => {
    let bundler = browserify('./app/index.jsx', { debug: true }).transform(babel);
    return bundler.bundle()
        .on('error', function (err) {
            console.error(err.stack);
            this.emit('end');
        })
        .pipe(source('bundle.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist'));
});

gulp.task('build:sass', () => {
    return gulp.src('./scss/style.scss')
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist'));
});

gulp.task('build:copy', () => {
    return gulp.src('./public/**.*')
        .pipe(gulp.dest('./dist'));
});

gulp.task('build', ['build:js', 'build:sass', 'build:copy']);

gulp.task('package', ['build'], () => {
    return gulp.src('./dist/*')
        .pipe(zip('client-' + pkg.version + '.zip'))
        .pipe(gulp.dest('./'));
});

gulp.task('clean', () => {
    return del([
        './dist/*',
        './client-*.zip'
    ]);
});

gulp.task('watch', ['build'], () => {
    gulp.watch(['./app/**/*.js', './app/**/*.jsx'], ['build:js']);
    gulp.watch('./sass/**/*.scss', ['build:sass']);
    gulp.watch('./public/**.*', ['build:copy']);
});

gulp.task('default', ['build']);
