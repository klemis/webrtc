const { src, dest, parallel } = require('gulp');
// const pug = require('gulp-pug');
const sass = require('gulp-sass');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');

function html() {
  return src('public/html/*.html')
    .pipe(pug())
    .pipe(dest('build/html'))
}

function css() {
  return src('public/sass/*.sass')
    .pipe(sass())
    .pipe(minifyCSS())
    .pipe(dest('build/css'))
}

function js() {
  return src('public/javascript/*.js', { sourcemaps: true })
    .pipe(concat('app.min.js'))
    .pipe(dest('build/js', { sourcemaps: true }))
}

exports.js = js;
exports.css = css;
exports.html = html;
exports.default = parallel(html, css, js);