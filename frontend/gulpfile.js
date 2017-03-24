var gulp = require('gulp');
var uglify = require('gulp-uglify');
var uglifycss = require('gulp-uglifycss');
var plumber = require('gulp-plumber');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var del = require('del');
var htmlmin = require('gulp-htmlmin');
var jsonminify = require('gulp-jsonminify');
var angularTemplateCache = require('gulp-angular-templatecache');
var addStream = require('add-stream');
var imagemin = require('gulp-imagemin');
var replace = require('gulp-string-replace');
var sass = require('gulp-sass');

var templateCache;

// This value can be updated by running gulp increment
var v = "1";

//////////
// Default Task
//////////
gulp.task('default', ['dev']);

//////////
// Build for production task
//////////
gulp.task('dist', ['clean-dist-folder'], function() {
  moveHtmlFiles('dist');
  doSass('dist');
  concatJsFiles('dist', function() {
    minifyJs('dist/main_' + v + '.js', 'dist');
  }, true);
  move('app/assets/fonts/*', 'dist/assets/fonts');
  move('app/assets/favicon/*', 'dist/assets/favicon');
  move('app/.htaccess', 'dist');
  optimizeImages(function() {
    moveV(['app/assets/images/*.*', 'app/assets/images/**/**'], 'dist/assets/images');
    console.log();
    console.log();
    console.log();
    console.log("-------------------------------------");
    console.log();
    console.log();
    console.log("  FINISHED DISTRIBUTION BUILD IN '/dist'.");
    console.log();
    console.log("  Did you remember to increment before running this command?");
    console.log("  If not the just run 'gulp increment'");
    console.log("  You will have to run 'gulp dist' again afterwards");
    console.log();
    console.log();
    console.log("-------------------------------------");
    console.log();
    console.log();
    console.log();
  });
});


//////////
// Dev task
//////////
gulp.task('dev', ['clean-dev-folder'], function() {
  moveHtmlFiles('dev');
  movePreHtmlFiles('dev');
  doSass('dev');
  concatJsFiles('dev', function() {
    gulp.src('dev/main_' + v + '.js')
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('dev'));
  }, false);
  move('app/assets/fonts/*', 'dev/assets/fonts');
  move('app/assets/favicon/*', 'dev/assets/favicon');
  move('app/.htaccess', 'dev');
  moveV(['app/assets/images/*.*', 'app/assets/images/**/**'], 'dev/assets/images');

  gulp.watch(['app/**/*.html', 'app/**/**/*.html', '!app/**/*.pre.html', '!app/**/**/*.pre.html'], function() {
    moveHtmlFiles('dev');
  });

  gulp.watch(['app/**/*.pre.html', 'app/**/**/*.pre.html'], function() {
    movePreHtmlFiles('dev');
  });

  gulp.watch(['app/*.js', 'app/**/*.js', 'app/**/**/*.js'], function() {
    concatJsFiles('dev', function() {
      gulp.src('dev/main_' + v + '.js')
      .pipe(rename({suffix: '.min'}))
      .pipe(gulp.dest('dev'));
    });
  });

  gulp.watch(['app/**/*.scss', 'app/**/**/*.scss'], function() {
    doSass('dev/assets/styles');
  });
});


//////////
// Clean dev folder task
//////////
gulp.task('clean-dev-folder', function() {
  return del(['dev/*']);
});

//////////
// Clean dist folder task
//////////
gulp.task('clean-dist-folder', function() {
  return del(['dist/*']);
});


//////////
// Moves non .pre html files to the dev folder
//////////
function moveHtmlFiles(dest) {
  return gulp.src([
    'app/index.html',
    'app/**/*.html',
    'app/**/**/*.html',
    '!app/**/*.pre.html',
    '!app/**/**/*.pre.html'
  ])
  .pipe(replace('@version@', v))
  .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
  .pipe(gulp.dest(dest));
}


//////////
// Renames and moving .pre html files
//////////
function movePreHtmlFiles(dest) {
  return gulp.src([
    'app/**/*.pre.html',
    'app/**/**/*.pre.html'
  ])
  .pipe(rename(function(opt) {
    opt.basename = opt.basename.split(".")[0];
    return opt;
  }))
  .pipe(replace('@version@', v))
  .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
  .pipe(gulp.dest(dest));
}


//////////
// Concatenates all of the javascript files
//////////
function concatJsFiles(dest, callback, preload) {
  return gulp.src([
    'node_modules/angular/angular.min.js',
    'node_modules/angular-route/angular-route.min.js',
    'app/*.js',
    'app/**/*.js',
    'app/**/**/*.js'
  ])
  .pipe(addStream.obj(prepareTemplates(preload)))
  .pipe(concat('main_' + v + '.js'))
  .pipe(gulp.dest(dest))
  .on('end', function() {
    console.log("Done JS files");
    if (callback) callback();
  });
}


//////////
// Minifies a js file
//////////
function minifyJs(src, dest) {
  return gulp.src(src)
  .pipe(ngAnnotate())
  .pipe(uglify({mangle: false}))
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest(dest));
}


//////////
// Moves files
//////////
function move(src, dest) {
  return gulp.src(src)
  .pipe(gulp.dest(dest));
}

//////////
// Moves and version files
//////////
function moveV(src, dest) {
  return gulp.src(src)
  .pipe(rename({suffix: "_" + v}))
  .pipe(gulp.dest(dest));
}


//////////
// Sass
//////////
function doSass(dest) {
  return gulp.src(['app/assets/styles/*.scss'])
  .pipe(plumber())
  .pipe(rename({suffix: "_" + v + '.min'}))
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer('last 2 versions'))
  .pipe(replace('@version@', v))
  .pipe(uglifycss())
  .pipe(gulp.dest(dest))
  .on('end', function() {
    console.log("Done sass");
  });
}


//////////
// Prepares the .pre html files to be put in the template cache
//////////
function prepareTemplates(preload) {
  if (preload) {
    return gulp.src(['app/**/*.pre.html', 'app/**/**/*.pre.html'])
    .pipe(replace('@version@', v))
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(rename(function(opt) {
      opt.basename = opt.basename.split(".")[0];
      return opt;
    }))
    .pipe(angularTemplateCache());
  } else {
    return gulp.src([]);
  }
}


//////////
// Optimizes images
//////////
function optimizeImages(callback) {
  return gulp.src(['app/assets/images/*.{png,gif,jpg}', 'app/assets/images/**/*.{png,gif,jpg}'])
  .pipe(imagemin())
  .pipe(gulp.dest('app/assets/images'))
  .on('end', callback);
}

gulp.task('increment', function() {
  gulp.src(['gulpfile.js'])
  .pipe(replace('var v = "' + v + '"', 'var v = "' + (v*1 + 1) + '"'))
  .pipe(gulp.dest(''));
});
