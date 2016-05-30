/////////////////////  Dependencies

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoPrefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var sourcemaps = require('gulp-sourcemaps');
var watch = require('gulp-watch');
var browserSync = require('browser-sync');
var uglify = require("gulp-uglify");
var rename = require("gulp-rename");
var cssmin = require("gulp-minify-css");
var compilehbs = require("gulp-compile-handlebars");
var clean = require("rimraf");
/////////////// Getting and defining paths for bower Components

var src = {
  bootstrap: 'bower_components/bootstrap/dist/css/bootstrap.min.css',
  jquery: 'bower_components/jquery/dist/jquery.min.js',
};

//////////////////// Error Message

var error = function (err) {  // This is the error message from gulp plumber
  console.log(err);
  this.emit('end');
}

////////////////// Cleaning the Dist

gulp.task('clean', function (cb) {
  clean('dist/**/*', cb)
});

/////////////////////////////////// Gulp Tasks /////////////////////////////////


/////////// Styles Task
gulp.task('sass', function (){
  return gulp.src("app/scss/**/*.scss")
  .pipe(plumber({
    errorHandler: error
  }))
  .pipe(sourcemaps.init())
  .pipe(sass())
  .pipe(concat('main.css'))
  .pipe(cssmin())
  .pipe(rename('main.min.css'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest("dist/css"))
  .pipe(browserSync.reload({stream:true}))
});

////////// javascript Task

gulp.task('scripts', function () {
  return gulp.src("app/js/**/*.js")
  .pipe(plumber({
    errorHandler: error
  }))
  .pipe(sourcemaps.init())
  .pipe(concat('main.js'))
  .pipe(uglify())
  .pipe(rename('main.min.js'))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest("dist/js"))
  .pipe(browserSync.reload({stream:true}))
});

//////// html Task

gulp.task('html', function () {
  return gulp.src('app/html/**/*.hbs')
  .pipe(compilehbs( {path:'.'},{ batch:['app/html']} )) //API Documentation - batch : Javascript array of filepaths to use as partials
  .pipe(rename({extname:'.html'})) //API Documentation - extname is the file extension including the '.' like path.extname(filename).
  .pipe(gulp.dest('dist'))
  .pipe(browserSync.reload({stream:true}))
});

/////// Bower Components Task

gulp.task('bower', function () {

   gulp.src([src.bootstrap])
  .pipe(gulp.dest('dist/css'));

  gulp.src([src.jquery])
  .pipe(gulp.dest('dist/js'));

});

/////// images task

gulp.task('img', function () {
  return gulp.src('app/img/*')
  .pipe(gulp.dest('dist/img'))
});


/////////////////////////////// Gulp Watch /////////////////////////////////////
gulp.task('watch', function () {
  browserSync.init({
    server:'./dist'
  });
  gulp.watch('app/scss/**/*.scss', ['sass']);
  gulp.watch('app/js/**/*.js', ['scripts']);
  gulp.watch('app/img/*', ['img']);
  gulp.watch('app/html/**/*.hbs', ['html']);
});


//////////////////////////////  Launch!!!! /////////////////////////////////////

gulp.task('default', ['sass', 'scripts', 'bower', 'html', 'img', 'watch']);
