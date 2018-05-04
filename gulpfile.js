var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('scripts', function(){
    gulp.src([
        'order.js', 
        'customer.js', 
        'search.js'
    ])
    .pipe(concat('order.min.js').on('error', function(e){
            console.log(e);
    }))
    .pipe(uglify().on('error', function(e){
            console.log(e);
    }))
    .pipe(gulp.dest('build/'))
});

gulp.task('default', [ 'scripts' ]);