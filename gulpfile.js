"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browserSync = require("browser-sync").create();
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const imagemin = import('gulp-imagemin');
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require('gulp-sass')(require('sass'));

const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const size = require('gulp-size');
const notify = require('gulp-notify');
const babel = require('gulp-babel');

const version = require('gulp-version-number');
var sourcemaps  = require('gulp-sourcemaps');

var pug = require('gulp-pug');
var log = require('fancy-log');

var bases = {
    app: 'src/',
    dist: 'dist/',
};




// BUILD SUBTASKS
// ---------------

// Clean assets
function clean() {
  //  return del.sync([bases.dist]);
  return  (async () => {
        const deletedPaths = await del([bases.dist], {dryRun: true});    
        console.log('Files and directories that would be deleted:\n', deletedPaths.join('\n'));
    })();
}

function css() {
    return gulp
        .src(bases.app + 'scss/styles.scss')       
        .pipe(plumber())
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(gulp.dest(bases.dist + 'css'))
        .pipe(cleanCSS({debug: true}, (details) => {
            console.log(`${details.name}: ${details.stats.originalSize}`);
            console.log(`${details.name}: ${details.stats.minifiedSize}`);
          }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulp.dest(bases.dist + 'css'))
        .pipe(browserSync.stream());
}



function scripts() {
    return (
        gulp
        .src([bases.app + 'js/*.js'])
        //.pipe(modernizr()) //加入modernizr.js
        .pipe(babel({
            presets: ["@babel/preset-env"]
          }))
        .pipe(uglify())
        .on('error', function (err) {  log.error(err.toString()); })
        .pipe(size({ gzip: false, showFiles: true }))
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(bases.dist + 'js'))
        //.pipe(livereload())
        .pipe(browserSync.stream())
    );
}



function copyFiles(done) {
    gulp.src(bases.app + 'js/libs/*.*')
        .pipe(size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(bases.dist + 'js/libs'))
        .pipe(browserSync.stream());

    gulp.src(bases.app + 'js/vendor/**/**/*.*')
        .pipe(size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(bases.dist + 'js/vendor'))
        .pipe(browserSync.stream());

    gulp.src(bases.app + 'icons/*.*')
        .pipe(size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(bases.dist))
        .pipe(browserSync.stream());

    gulp.src(bases.app + 'fonts/**/*.*')
        .pipe(size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(bases.dist + 'fonts'))
        .pipe(browserSync.stream());

    gulp.src(bases.app + 'plugins/**/**/*.*')
        .pipe(size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(bases.dist + 'plugins'))
        .pipe(browserSync.stream());

    done();
}

function htmls(done) {
    gulp.src([bases.app + '*.html', bases.app + '**/*.html', bases.app + '*.txt',bases.app + '*.xml',bases.app + '*.webmanifest', bases.app + '*.json'])
        .pipe(size({ gzip: true, showFiles: true }))
        .pipe(version({
            'value': '%MDS%',
            'append': {
                'key': 'v',
                'to': ['css', 'js'],
            }
        }))
        .pipe(gulp.dest(bases.dist))
        .pipe(browserSync.stream());

    done();
}

function pugtohtml(done){

    gulp.src([bases.app + '*.pug'])
        .pipe(pug({
            pretty:true
        }))
        .pipe(version({
            'value': '%MDS%',
            'append': {
                'key': 'v',
                'to': ['css', 'js'],
            }
        }))
        .pipe(gulp.dest(bases.dist))
        .pipe(browserSync.stream());

    done();
}
function browserSyncOpen(done) {
    browserSync.init({
        server: {
            baseDir: bases.dist,
            index: 'index.html'
                //proxy: "yourlocal.dev"
        },
        port: 5000

    });

    done();
}
// BrowserSync Reload
function browserSyncReload(done) {
    browserSync.reload();
    done();
}

// Optimize Images
// function images() {
//     return gulp
//         .src([bases.app + "img/**/*"])
//         .pipe(newer(bases.dist + "img"))
//         .pipe(
//             imagemin([
//                 imagemin.gifsicle({ interlaced: true }),             
//                 imagemin.mozjpeg({quality: 80, progressive: true}),
//                 imagemin.optipng({ optimizationLevel: 5 }),
//                 imagemin.svgo({
//                     plugins: [
//                         {removeViewBox: true},
//                         {cleanupIDs: false}
//                     ]
//                 })
//             ])
//         )
//         .pipe(gulp.dest(bases.dist + "img"));
// }


// Watch files
function watchFiles() {
    gulp.watch(bases.app + "scss/**/*", gulp.series(css, browserSyncReload));
    gulp.watch(bases.app + "js/**/*", gulp.series(scripts));
    gulp.watch(
        [
            bases.app + "**.html"
        ],
        gulp.series(htmls, browserSyncReload)
    );
    gulp.watch(bases.app + "**.pug", gulp.series(pugtohtml));
    // gulp.watch(bases.app + "img/**/*", images);
}


//define complex tasks
const js = gulp.series(scripts);
//const build = gulp.series(clean, gulp.parallel(css, images, js, htmls, copyFiles));
const build = (done) => {
    gulp.series( clean, gulp.parallel(css, js, htmls, copyFiles))(done);
};
const watch = gulp.parallel(watchFiles, browserSyncOpen);

// export tasks
exports.htmls = htmls;
// exports.images = images;
exports.css = css;
exports.js = js;
exports.pug = pugtohtml;
// exports.jekyll = jekyll;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;