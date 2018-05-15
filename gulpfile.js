const gulp = require('gulp');

const autoprefixer = require('gulp-autoprefixer');
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
var pug = require('gulp-pug');

gulp.task('server', function () {
    browser.init({
        server: {
            baseDir: './dist',
            index: 'index.html'
        },
        port: 2000
    });
});

gulp.task('html', function () {
  gulp.src('src/**/*.html')
    .pipe(browser.stream());
    browser.reload();
});

gulp.task('sass', function () {
    gulp.src('src/stylesheets/**/*.scss')
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
						loadPaths: ['assets/images/'], // basePathから見た画像フォルダの位置
						basePath: 'dist/', // プロジェクトで公開するパス
						cachebuster: true
					})
				]))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./dist/assets/css'))
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

    gulp.src('src/javascripts/index.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(browserified)
        .pipe(buffer())
        .pipe(uglify())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest('./dist/assets/js'))
        .pipe(browser.stream());
});

gulp.task('js.concat', function() {
  return gulp.src('src/javascripts/vendor/*.js')
    .pipe(plumber())
    .pipe(concat('vendor.pack.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets/js'));
});

gulp.task('js', ['js.concat']);

gulp.task('default', function() {
    gulp.watch('src/stylesheets/**/*.scss',['sass']);
    gulp.watch('src/javascripts/*.js', ['es2015']);
});
