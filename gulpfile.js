const gulp = require('gulp');

// const autoprefixer = require('gulp-autoprefixer');
const autoprefixer = require("autoprefixer");
const babelify = require('babelify');
const browser = require('browser-sync').create();
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const cleanCSS = require('gulp-clean-css');
// const imagemin = require('gulp-imagemin');
const concat = require("gulp-concat");
// const mozjpeg  = require('imagemin-mozjpeg');
const plumber = require('gulp-plumber');
// const pngquant = require('imagemin-pngquant');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const through = require('through2');
const uglify = require('gulp-uglify');
const postcss = require('gulp-postcss');
const assets = require('postcss-assets');
// const normalize = require('postcss-normalize');
const postcssGapProperties = require("postcss-gap-properties");
const pug = require('gulp-pug');



const paths = {
  'scss':  './src/stylesheets/',
  'jssrc': './src/javascripts/',
  'pug':   './src/pug/',
  'html':  './dest/',
  'css':   './dest/assets/css/',
  'js':    './dest/assets/js/',
  'image': 'assets/images/'
}

gulp.task('server', function () {
    browser.init({
        server: {
            baseDir: paths.html,
            index: 'index.html'
        },
        port: 2000
    });
});
//setting : Pug Options
const pugOptions = {
  pretty: true
}
//Pug
gulp.task('pug', function () {
  return gulp.src([ paths.pug + '**/*.pug', '!' + paths.pug + '**/_*.pug'])
    .pipe(plumber())
    .pipe(pug(pugOptions))
    .pipe(gulp.dest(paths.html))
    .pipe(browser.stream());
    browser.reload();
});


gulp.task('sass', function () {
    gulp.src( paths.scss + '**/*.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(postcss([
            postcssGapProperties(),
            autoprefixer({
                grid: true,
                browsers: ['last 1 version'],
                cascade: false
        	   }),
            assets({
                loadPaths: [ paths.image ], // basePathから見た画像フォルダの位置
                basePath: paths.html, // プロジェクトで公開するパス
                cachebuster: true
            })
        ]))
        // .pipe(cleanCSS())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest( paths.css ))
        .pipe(browser.stream());
});

gulp.task('es2015', function () {
    var browserified = through.obj(function(file,encode,callback){
        browserify(file.path)
            .transform(babelify, {presets: ['es2015']})
            .bundle(function(err,res){
                if(err){
                    return callback(err);
                }
                file.contents = res;
                callback(null,file);
            })
            .on("error", function (err) {
                console.log("Error : " + err.message);
            });
    });

    gulp.src(paths.jssrc + 'index.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(browserified)
        .pipe(buffer())
        .pipe(uglify())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.js))
        .pipe(browser.stream());
});


gulp.task('js.concat', function() {
  return gulp.src(paths.jssrc + 'vendor/*.js')
    .pipe(plumber())
    .pipe(concat('vendor.pack.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js));
});


gulp.task('js', ['js.concat']);

gulp.task('default', ['server'], function() {
    gulp.watch(paths.pug + '**/*.pug', ['pug']);
    gulp.watch(paths.scss + '**/*.scss',['sass']);
    gulp.watch([paths.jssrc + '**/*.js', '!' + paths.jssrc + 'vendor/*'], ['es2015']);
});
