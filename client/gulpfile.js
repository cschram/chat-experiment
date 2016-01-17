"use strict";

let gulp = require('gulp');
let minimist = require('minimist');
let gulpif = require('gulp-if');
let sourcemaps = require('gulp-sourcemaps');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let browserify = require('browserify');
let babel = require('babelify');
let del = require('del');
let uglify = require('gulp-uglify');
let zip = require('gulp-zip');
let pkg = require('./package.json');

let options = minimist(process.argv.slice(2), {
    boolean: ['debug'],
});

gulp.task('build:js', () => {
    let bundler = browserify('app/index.jsx', { debug: options.debug }).transform(babel);
    return bundler.bundle()
        .on('error', function (err) {
            console.error(err.stack);
            this.emit('end');
        })
        .pipe(source('bundle.min.js'))
        .pipe(buffer())
        .pipe(gulpif(!options.debug, uglify()))
        .pipe(gulpif(options.debug, sourcemaps.init({ loadMaps: true })))
        .pipe(gulpif(options.debug, sourcemaps.write()))
        .pipe(gulp.dest('dist'));
});

gulp.task('build:copy', () => {
    return gulp.src('public/**/*.*')
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['build:js', 'build:copy']);

gulp.task('package', ['build'], () => {
    return gulp.src('dist/*')
        .pipe(zip('client-' + pkg.version + '.zip'))
        .pipe(gulp.dest(''));
});

gulp.task('clean', () => {
    return del([
        'dist/*',
        'client-*.zip'
    ]);
});

gulp.task('watch', ['build'], () => {
    gulp.watch(['app/**/*.js', 'app/**/*.jsx'], ['build:js']);
    gulp.watch('styles/**/*.scss', ['build:sass']);
    gulp.watch('public/**/*.*', ['build:copy']);
});

gulp.task('default', ['build']);
