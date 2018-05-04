var gulp   = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('scripts', function() {
	gulp.src([
		'order.js', 
		'customer.js', 
		'search.js'
	])
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'))
});

gulp.task('default', ['minify']);