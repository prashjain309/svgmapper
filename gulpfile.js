var fs = require('fs');

var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var less = require('gulp-less');
var clean = require('gulp-clean');
var plugins = require('gulp-load-plugins')();
var path = require('path');
var runSequence = require('run-sequence');

var reload = browserSync.reload;

// ---------------------------------------------------------------------
// | Helper tasks                                                      |
// ---------------------------------------------------------------------

//delete the PREVIOUS contents of the build folder
gulp.task('clean', function (done) {
  return gulp.src('build', {read: false})
  .pipe(clean());
});


//Covert all less file to css 
gulp.task('less', function () {
  return gulp.src('./src/styles/*.less')
  .pipe(less())
  .pipe(gulp.dest('./build/styles/'));
});

// gulp.task('less', function () {
//   return gulp.src('./src/styles/*.less')
//     .pipe(less({
//       paths: [ path.join(__dirname, 'less', 'includes') ]
//     }))
//     .pipe(gulp.dest('./build/styles/*.css'));
// });


//Minify all html files 
gulp.task('html', ['less'], function () {
  return gulp.src([
    // Copy all `.html` files
    'src/*.html',
  ])
  .pipe(plugins.htmlmin({
    removeComments: true,
    removeCommentsFromCDATA: true,
    removeCDATASectionsFromCDATA: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeRedundantAttributes: true,
    minifyJS: true
  })).pipe(gulp.dest('build'))
    .pipe(reload({stream: true}));
});

//Copy all other file
gulp.task('copy', function () {
  return gulp.src([
    // Copy all files except html styles scripts  
    'src/**',
    // Exclude the following files
    // (other tasks will handle the copying of these files)
    '!src/*.html',
    '!src/{styles,styles/**}',
    '!src/{js,scripts/**}'
  ]).pipe(gulp.dest('build'));
});

//Copy all js file  
gulp.task('js', function () {
  return gulp.src('./src/scripts/**/*.js')
  .pipe(gulp.dest('./build/scripts/'));
});

//browser sync (web server) for development
gulp.task('browser-sync', function() {
  browserSync.init({
    notify: true,
    port: 8081,
    baseDir: "build",
    server: "build",
    open: false
  });
});

//Watch all changes 
gulp.task('watch', function() {
  gulp.watch(['src/**/*.less'], ['less']);
  gulp.watch(['src/*.html'], ['html']);
  gulp.watch(['src/**/*.js'], ['js']);
});

// ---------------------------------------------------------------------
// | Main tasks                                                        |
// ---------------------------------------------------------------------

gulp.task('build', function (done) {
  runSequence('clean','copy', 'html', 'js', 'less', done);
});

gulp.task('default', ['build']);

gulp.task('serve', function (done) {
  runSequence( 'build', ['browser-sync', 'watch'], done);
});
