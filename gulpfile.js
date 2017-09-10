let gulp = require('gulp');
let jsmin = require('gulp-jsmin');
let rename = require('gulp-rename');
let replace = require('gulp-replace');
let cleanCSS = require('gulp-clean-css');

gulp.task('minify-css', () => {
  return gulp.src('src/css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('min', function () {
    gulp.src('src/js/app.js')
        .pipe(jsmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('replaceit', function(){
  gulp.src('src/**/*.html')
    .pipe(replace('src="js/app.js"', 'src="js/app.min.js"'))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy', function(){
  gulp.src('src/img/**/*.*')
  .pipe(gulp.dest('dist/img'));
});

gulp.task('copy-libs', function(){
  gulp.src('src/js/libs/**/*.*')
  .pipe(gulp.dest('dist/js/libs'));
});

gulp.task('default', ['minify-css', 'min', 'copy','replaceit','copy-libs']);