var gulp =  require('gulp'),
            autoprefixer = require("autoprefixer"),
            babelify = require('babelify'),
            browser = require('browser-sync').create(),
            browserify = require('browserify'),
            buffer = require('vinyl-buffer'),
            // cleanCSS = require('gulp-clean-css'),
            concat = require("gulp-concat"),
            plumber = require('gulp-plumber'),
            sass = require('gulp-sass'),
            sourcemaps = require('gulp-sourcemaps'),
            through = require('through2'),
            uglify = require('gulp-uglify'),
            postcss = require('gulp-postcss'),
            assets = require('postcss-assets'),
            // normalize = require('postcss-normalize'),
            postcssGapProperties = require("postcss-gap-properties"),
            pug = require('gulp-pug');

const paths = {
  'scss':  './src/stylesheets/',
  'jssrc': './src/javascripts/',
  'pug':   './src/pug/',
  'html':  './dest/',
  'css':   './dest/assets/css/',
  'js':    './dest/assets/js/',
  'imagesrc': '/src/images/',
  'image': '/dest/assets/images/'
}

//setting : Pug Options
const pugOptions = {
  pretty: true
}
//Pug
gulp.task('pug', () => {
    // browser.reload();
  return gulp.src([ paths.pug + '**/*.pug', '!' + paths.pug + '**/_*.pug'])
    .pipe(plumber())
    .pipe(pug(pugOptions))
    .pipe(gulp.dest(paths.html))
    .pipe(browser.stream());
});

// SCSS
gulp.task('sass', () => {
    return gulp.src( paths.scss + '**/*.scss')
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

// JS
gulp.task('es2015', () => {
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
    return gulp.src(paths.jssrc + 'index.js')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(browserified)
        .pipe(buffer())
        .pipe(uglify())
        .pipe(sourcemaps.write('../maps'))
        .pipe(gulp.dest(paths.js))
        .pipe(browser.stream());
});

// JS Vendor CONCAT
gulp.task('js-concat', () => {
  return gulp.src(paths.jssrc + 'vendor/*.js')
    .pipe(plumber())
    .pipe(concat('vendor.pack.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js));
});


// watch
gulp.task('watches', () => {
    gulp.watch(paths.pug + '**/*.pug', gulp.task('pug'));
    gulp.watch(paths.scss + '**/*.scss', gulp.task('sass'));
    gulp.watch(paths.jssrc + 'vendor/*.js', gulp.task('js-concat'));
    gulp.watch([paths.jssrc + '**/*.js', '!' + paths.jssrc + 'vendor/*'], gulp.task('es2015'));
});

// browser-sync
gulp.task('server', (done) => {
    browser.init({
        server: {
            baseDir: paths.html,
            index: 'index.html'
        }
    });
    done();
});

// default v4 での記述
gulp.task('default', gulp.parallel(['watches', 'server']));