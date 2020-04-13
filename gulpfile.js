'use strict';

const {task, watch, src, dest, parallel, series} = require('gulp'),
    less = require('gulp-less'),
    pug = require('gulp-pug'),
    jshint = require('gulp-jshint'),
    cssmin = require('gulp-cssmin'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    webserver = require('gulp-webserver'),
    gutil = require('gulp-util'),
    babel = require('gulp-babel'),
    sourcemaps = require('gulp-sourcemaps'),
    qunit = require('gulp-qunit'),
    ip = require('ip');

// Source folder configuration
const SRC = {};
SRC.root = './app/';
SRC.assets = SRC.root + 'assets/';
SRC.img = SRC.root + 'images/';
SRC.js = SRC.root + 'js/';
SRC.less = SRC.root + 'less/';
SRC.pug = SRC.root + 'pug/';

// Source file matchers, using respective directories
const FILES = {
    less: SRC.less + '*.less',
    pug: [SRC.pug + '*.pug'],
    js: SRC.js + '**/*.js',
    images: SRC.img + '**/*',
    assets: SRC.assets + '**/*'
};

// Output directories
const PUB = {};
PUB.root = './public/';
PUB.js = PUB.root + 'js/';
PUB.css = PUB.root + 'css/';
PUB.fnt = PUB.root + 'fonts/';
PUB.img = PUB.root + 'images/';

task('scripts', () => {
    return src([SRC.js + 'site.js', SRC.js + 'components/*.js'])
        .pipe(sourcemaps.init())
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .on('error', function(err) {
            let displayErr = gutil.colors.red(err.message);
            gutil.log(displayErr);
            this.emit('end');
        })
        .pipe(babel({
            "presets": ["@babel/preset-env"]
        }))
        .pipe(concat('scripts.js'))
        .pipe(dest(PUB.js))
        /*.pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .on('error', function(err) {
            let displayErr = gutil.colors.red(err.message);
            gutil.log(displayErr);
            this.emit('end');
        })
        .pipe(dest(PUB.js))*/
        .pipe(sourcemaps.write('.'))
        .pipe(dest(PUB.js))
});

task('jsguide', () => {
    return src([SRC.js + 'guide/guide.js', SRC.js + 'guide/components/*.js'])
        .pipe(sourcemaps.init())
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .on('error', function(err) {
            let displayErr = gutil.colors.red(err.message);
            gutil.log(displayErr);
            this.emit('end');
        })
        .pipe(babel({
            "presets": ["@babel/preset-env"]
        }))
        .pipe(concat('jsguide.js'))
        .pipe(dest(PUB.js))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(PUB.js))
});

task('libs', () => {
    return src(SRC.js + 'libs/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('libs.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(PUB.js))
});

task('less', () =>
    src(FILES.less)
        .pipe(less().on('error', function(err) {
            let displayErr = gutil.colors.red(err.message);
            gutil.log(displayErr);
            this.emit('end');
        }))
        .pipe(dest(PUB.css))
        // .pipe(cssmin())
        // .pipe(rename({suffix: '.min'}))
        // .pipe(dest(PUB.css))
);

task('pug', () =>
    src(FILES.pug)
        .pipe(pug({
            pretty: true
        })
        .on('error', function(err) {
            let displayErr = gutil.colors.red(err.message);
            gutil.log(displayErr);
            this.emit('end');
        }))
        .pipe(dest(file => {
            var pugIndex = file.base.lastIndexOf('pug');
            var relPath = file.base.substr(pugIndex+4);
            return PUB.root + relPath;
        }))
);

task('pugdata', () =>
    src('./app/pug/data/*.pug')
        .pipe(pug({
            pretty: true
        })
        .on('error', function(err) {
            let displayErr = gutil.colors.red(err.message);
            gutil.log(displayErr);
            this.emit('end');
        }))
        .pipe(dest(file => {
            var pugIndex = file.base.lastIndexOf('pug');
            var relPath = file.base.substr(pugIndex+4);
            return PUB.root + relPath;
        }))
);

task('imagemin', () =>
    src(FILES.images)
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true, progressive: true, optimizationLevel: 5}),
        imagemin.jpegtran({interlaced: true, progressive: true, optimizationLevel: 5}),
        imagemin.optipng({interlaced: true, progressive: true, optimizationLevel: 5}),
        imagemin.svgo({
            plugins: [
                {removeViewBox: true},
                {cleanupIDs: false}
            ]
        })
    ]))
    .pipe(dest(PUB.img))
);

task('copyAssets', () =>
    src(FILES.assets)
        .pipe(dest(PUB.root))
);

task('test', function() {
    return src('./test/*.html')
        .pipe(qunit({'page': {
            viewportSize: { width: 1280, height: 800 }
        }}));
});

task('watch', (done) => {
    watch([SRC.less + '*.less', SRC.less + '**/*.less'], series('less'));
    watch([SRC.js + 'site.js', SRC.js + 'components/*.js', SRC.js + 'guide/guide.js', SRC.js + 'guide/**/*.js'], series('scripts'));
    watch([SRC.pug + '**/*.pug', SRC.pug + '*.pug'], series('pug'));
    watch(FILES.images, series('imagemin'));
    watch(FILES.assets, series('copyAssets'));
    done();
});

task('clean', () => {
    return src('./public', {read: false, allowEmpty: true})
        .pipe(clean());
});

task('webserver', (done) => {
    src(PUB.root)
    .pipe(webserver({
        host: ip.address(),
        port: process.env.PORT || 2222,
        directoryListing: true,
        open: '/sitemap.html',
        fallback: '/sitemap.html'
    }));
    done();
});

task('optimized',
    parallel('imagemin')
);
task('build',
    parallel('less', 'pug', 'pugdata', 'scripts', 'jsguide', 'libs', 'copyAssets', 'optimized', 'watch')
);
task('default',
    series('clean', 'build', 'webserver')
);
