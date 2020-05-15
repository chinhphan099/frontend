'use strict';

const { task, watch, src, dest, parallel, series } = require('gulp'),
  less = require('gulp-less'),
  pug = require('gulp-pug'),
  jshint = require('gulp-jshint'),
  cssmin = require('gulp-cssmin'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  clean = require('gulp-clean'),
  webserver = require('gulp-webserver'),
  gutil = require('gulp-util'),
  babel = require('gulp-babel'),
  sourcemaps = require('gulp-sourcemaps'),
  qunit = require('gulp-qunit'),
  autoprefixer = require('gulp-autoprefixer'),
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

task('scripts', () =>
  src([SRC.js + 'site.js', SRC.js + 'components/*.js'])
    .pipe(sourcemaps.init())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .on('error', function (err) {
      let displayErr = gutil.colors.red(err.message);
      gutil.log(displayErr);
      this.emit('end');
    })
    .pipe(babel({
      "presets": ["@babel/preset-env"]
    }))
    .pipe(concat('scripts.js'))
    .pipe(dest(PUB.js))
    // .pipe(uglify())
    // .pipe(rename({suffix: '.min'}))
    // .on('error', function(err) {
    //   let displayErr = gutil.colors.red(err.message);
    //   gutil.log(displayErr);
    //   this.emit('end');
    // })
    // .pipe(dest(PUB.js))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(PUB.js))
);

task('jsguide', () =>
  src([SRC.js + 'guide/guide.js', SRC.js + 'guide/components/*.js'])
    .pipe(sourcemaps.init())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .on('error', function (err) {
      let displayErr = gutil.colors.red(err.message);
      gutil.log(displayErr);
      this.emit('end');
    })
    .pipe(babel({
      "presets": ["@babel/preset-env"]
    }))
    .pipe(concat('jsguide.js'))
    // .pipe(uglify())
    // .pipe(rename({suffix: '.min'}))
    // .on('error', function(err) {
    //   let displayErr = gutil.colors.red(err.message);
    //   gutil.log(displayErr);
    //   this.emit('end');
    // })
    .pipe(dest(PUB.js))
    .pipe(sourcemaps.write('.'))
    .pipe(dest(PUB.js))
);

task('libs', () =>
  src(SRC.js + 'libs/*.js')
    .pipe(concat('libs.js'))
    .pipe(uglify())
    // .pipe(rename({suffix: '.min'}))
    .pipe(dest(PUB.js))
);

task('less', () =>
  src(FILES.less)
    .pipe(less().on('error', function (err) {
      let displayErr = gutil.colors.red(err.message);
      gutil.log(displayErr);
      this.emit('end');
    }))
    .pipe(autoprefixer('last 3 versions', 'ie 10'))
    .pipe(dest(PUB.css))
  //.pipe(cssmin())
  //.pipe(rename({ suffix: '.min' }))
  //.pipe(dest(PUB.css))
);

task('pug', () =>
  src(FILES.pug)
    .pipe(pug({
      pretty: true
    })
      .on('error', function (err) {
        let displayErr = gutil.colors.red(err.message);
        gutil.log(displayErr);
        this.emit('end');
      }))
    .pipe(dest(file => {
      var pugIndex = file.base.lastIndexOf('pug');
      var relPath = file.base.substr(pugIndex + 4);
      return PUB.root + relPath;
    }))
);

task('pugdata', () =>
  src('./app/pug/data/*.pug')
    .pipe(pug({
      pretty: true
    })
      .on('error', function (err) {
        let displayErr = gutil.colors.red(err.message);
        gutil.log(displayErr);
        this.emit('end');
      }))
    .pipe(dest(file => {
      var pugIndex = file.base.lastIndexOf('pug');
      var relPath = file.base.substr(pugIndex + 4);
      return PUB.root + relPath;
    }))
);

task('copyAssets', () =>
  src(FILES.assets).pipe(dest(PUB.root))
);

task('test', () =>
  src('./test/*.html')
    .pipe(qunit({
      'page': {
        viewportSize: { width: 1280, height: 800 }
      }
    }))
);

task('watch', (done) => {
  watch([SRC.less + '*.less', SRC.less + '**/*.less'], series('less'));
  watch([SRC.js + 'site.js', SRC.js + 'components/*.js'], series('scripts'));
  watch([SRC.js + 'guide/guide.js', SRC.js + 'guide/**/*.js'], series('jsguide'));
  watch(SRC.js + 'libs/*.js', series('libs'));
  watch([SRC.pug + '**/*.pug', SRC.pug + '*.pug'], series('pug'));
  watch(FILES.assets, series('copyAssets'));
  done();
});

task('clean', () => {
  return src('./public', { read: false, allowEmpty: true }).pipe(clean());
});

task('webserver', (done) => {
  src(PUB.root)
    .pipe(webserver({
      host: ip.address(),
      port: process.env.PORT || 2222,
      directoryListing: true,
      open: '/sitemap.html',
      fallback: '/404.html'
    }));

  done();
});

task('build',
  parallel('less', 'pug', 'scripts', 'jsguide', 'libs', 'copyAssets', 'watch')
);
task('default',
  series('clean', 'build', 'webserver')
);
