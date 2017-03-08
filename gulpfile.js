const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks');
const customizeBootstrap = require('./modified-gulp-customize-bootstrap/index.js');
const sass = require('gulp-sass');

gulp.task('compile', ['bootstrap'], () => {
    gulp.src(['src/templates/**/*.html', '!src/templates/**/_*.js'])
        .pipe(nunjucks.compile({}, {}))
        .pipe(gulp.dest('dist'));
    gulp.src('src/js/', { base: '.' })
        .pipe(gulp.dest('dist/lib/js/'));
    gulp.src('src/css/', { base: '.' })
        .pipe(gulp.dest('dist/lib/css/'));
});

gulp.task('bootstrap', () => {
    gulp.src('node_modules/bootstrap/scss/bootstrap.scss')
        .pipe(customizeBootstrap('src/css/bootstrap-custom/*.scss'))
        .pipe(sass())
        .pipe(gulp.dest('dist/lib/css/bootstrap/'))
})