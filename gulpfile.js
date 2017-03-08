const gulp = require('gulp');
const nunjucks = require('gulp-nunjucks');

gulp.task('compile', () => {
    gulp.src(['src/templates/**/*.html', '!src/templates/**/_*.js'])
        .pipe(nunjucks.compile({}, {}))
        .pipe(gulp.dest('dist'));
    gulp.src('src/js/', { base: '.' })
        .pipe(gulp.dest('dist/src/js/'));
    gulp.src('src/css/', { base: '.' })
        .pipe(gulp.dest('dist/src/css/'));
});