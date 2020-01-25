"use strict";

// Load plugins
const autoprefixer = require("autoprefixer");
const browserSync = require("browser-sync").create();
const cssnano = require("cssnano");
const del = require("del");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");

const cleanCSS = require('gulp-clean-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const size = require('gulp-size');
const notify = require('gulp-notify');
const colors = require('colors');
const modernizr = require('gulp-modernizr');

var bases = {
    app: 'src/',
    dist: 'dist/',
};

colors.setTheme({
    silly: 'rainbow',
    input: 'grey',
    verbose: 'cyan',
    prompt: 'grey',
    info: 'green',
    data: 'grey',
    help: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
});

var displayError = function(error) {
    // Initial building up of the error
    var errorString = '[' + error.plugin.error.bold + ']';
    errorString += ' ' + error.message.replace("\n", ''); // Removes new line at the end

    // If the error contains the filename or line number add it to the string
    if (error.fileName)
        errorString += ' in ' + error.fileName;

    if (error.lineNumber)
        errorString += ' on line ' + error.lineNumber.bold;

    // This will output an error like the following:
    // [gulp-sass] error message in file_name on line 1
    console.error(errorString);
};

var onError = function(err) {
    notify.onError({
        title: "Gulp",
        subtitle: "Failure!",
        message: "Error: <%= error.message %>",
        sound: "Basso"
    })(err);
    this.emit('end');
};



// BUILD SUBTASKS
// ---------------

// Clean assets
function clean() {
    return del([bases.dist]);
}

function css() {
    return gulp
        .src(bases.app + 'scss/styles.scss')
        .pipe(plumber())
        .pipe(sass({ outputStyle: "expanded" }))
        .pipe(gulp.dest(bases.dist + 'css'))
        .pipe(cleanCSS({ debug: true }, function(details) {
            console.log(details.name + '(originalSize): ' + details.stats.originalSize);
            console.log(details.name + '(minifiedSize): ' + details.stats.minifiedSize);
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
        .pipe(uglify())
        .pipe(size({ gzip: false, showFiles: true }))
        .pipe(concat('app.js'))
        .pipe(gulp.dest(bases.dist + 'js'))
        .pipe(browserSync.stream())
    );
}



function copyFiles(done) {
    gulp.src(bases.app + 'js/libs/*.*')
        .pipe(size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(bases.dist + 'js/libs'))
        .pipe(browserSync.stream());

    gulp.src(bases.app + 'js/vendor/*.*')
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
    gulp.src([bases.app + '*.html', bases.app + '**/*.html', bases.app + '*.txt', bases.app + '*.json'])
        .pipe(size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(bases.dist))
        .pipe(browserSync.stream());

    gulp.src(bases.app + 'member/*.*')
        .pipe(size({ gzip: true, showFiles: true }))
        .pipe(gulp.dest(bases.dist + 'member'))
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
function images() {
    return gulp
        .src(bases.app + "img/**/*")
        .pipe(newer(bases.dist + "img"))
        .pipe(
            imagemin([
                imagemin.gifsicle({ interlaced: true }),
                imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [{
                        removeViewBox: false,
                        collapseGroups: true
                    }]
                })
            ])
        )
        .pipe(gulp.dest(bases.dist + "img"));
}


// Watch files
function watchFiles() {
    gulp.watch(bases.app + "scss/**/*", gulp.series(css, browserSyncReload));
    gulp.watch(bases.app + "js/**/*", gulp.series(scripts));
    gulp.watch(
        [
            bases.app + "**.html",bases.app + "member/**.html"
        ],
        gulp.series(htmls, browserSyncReload)
    );
    gulp.watch(bases.app + "img/**/*", images);
}


//define complex tasks
const js = gulp.series(scripts);
const build = gulp.series(clean, gulp.parallel(css, images, js, htmls, copyFiles));
const watch = gulp.parallel(watchFiles, browserSyncOpen);

// export tasks
exports.htmls = htmls;
exports.images = images;
exports.css = css;
exports.js = js;
// exports.jekyll = jekyll;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;