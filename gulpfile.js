'use strict';

const gulp = require('gulp'),
	less = require('gulp-less'),
	pug = require('gulp-pug'),
	jshint = require('gulp-jshint'),
	cssmin = require('gulp-cssmin'),
	concat = require('gulp-concat'),
	imagemin = require('gulp-imagemin'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	clean = require('gulp-clean'),
	connect = require('gulp-connect'),
	gutil = require('gulp-util'),
	babel = require('gulp-babel'),
	qunit = require('gulp-qunit');


// Source folder configuration
const SRC_DIR = {};
SRC_DIR.root = './app/';
SRC_DIR.assets = SRC_DIR.root + 'assets/';
SRC_DIR.img = SRC_DIR.root + 'images/';
SRC_DIR.js = SRC_DIR.root + 'js/';
SRC_DIR.less = SRC_DIR.root + 'less/';
SRC_DIR.pug = SRC_DIR.root + 'pug/';


// Source file matchers, using respective directories
const SRC_FILES = {
	less: SRC_DIR.less + '*.less',
	pug: [SRC_DIR.pug + '*.pug'],
	js: SRC_DIR.js + '**/*.js',
	images: SRC_DIR.img + '**/*',
	assets: SRC_DIR.assets + '**/*'
};

// Output directories
const PUB_DIR = {};
PUB_DIR.root = './public/';
PUB_DIR.js = PUB_DIR.root + 'js/';
PUB_DIR.css = PUB_DIR.root + 'css/';
PUB_DIR.fnt = PUB_DIR.root + 'fonts/';
PUB_DIR.img = PUB_DIR.root + 'images/';

gulp.task('scripts', () => {
	return gulp.src([SRC_DIR.js + 'site.js', SRC_DIR.js + 'plugins/*.js'])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.on('error', function(err) {
			let displayErr = gutil.colors.red(err.message);
			gutil.log(displayErr);
			this.emit('end');
		})
		.pipe(babel())
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest(PUB_DIR.js))
		// .pipe(rename({ suffix: '.min' }))
		// .pipe(uglify())
		// .on('error', function(err) {
		// 	let displayErr = gutil.colors.red(err.message);
		// 	gutil.log(displayErr);
		// 	this.emit('end');
		// })
		// .pipe(gulp.dest(PUB_DIR.js))
});

gulp.task('jsguide', () => {
	return gulp.src([SRC_DIR.js + 'guide/guide.js', SRC_DIR.js + 'guide/plugins/*.js'])
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('default'))
		.on('error', function(err) {
			let displayErr = gutil.colors.red(err.message);
			gutil.log(displayErr);
			this.emit('end');
		})
		.pipe(babel())
		.pipe(concat('jsguide.js'))
		.pipe(gulp.dest(PUB_DIR.js))
		// .pipe(rename({ suffix: '.min' }))
		// .pipe(uglify())
		// .on('error', function(err) {
		// 	let displayErr = gutil.colors.red(err.message);
		// 	gutil.log(displayErr);
		// 	this.emit('end');
		// })
		// .pipe(gulp.dest(PUB_DIR.js))
});

gulp.task('libs', () => {
	return gulp.src(SRC_DIR.js + 'libs/*.js')
		.pipe(babel())
		.pipe(concat('libs.js'))
		.pipe(gulp.dest(PUB_DIR.js))
		// .pipe(rename({ suffix: '.min' }))
		// .pipe(uglify())
		// .pipe(gulp.dest(PUB_DIR.js))
});

gulp.task('less', () =>
	gulp.src(SRC_FILES.less)
		.pipe(less().on('error', function(err) {
			let displayErr = gutil.colors.red(err.message);
			gutil.log(displayErr);
			this.emit('end');
		}))
		.pipe(gulp.dest(PUB_DIR.css))
		// .pipe(cssmin())
		// .pipe(rename({suffix: '.min'}))
		// .pipe(gulp.dest(PUB_DIR.css))
		// .pipe(connect.reload())
);

gulp.task('pug', () =>
	gulp.src(SRC_FILES.pug)
		.pipe(pug({
			pretty: true
		})
		.on('error', function(err) {
			let displayErr = gutil.colors.red(err.message);
			gutil.log(displayErr);
			this.emit('end');
		}))
		.pipe(gulp.dest(file => {
			var pugIndex = file.base.lastIndexOf('pug');
			var relPath = file.base.substr(pugIndex+4);
			return PUB_DIR.root + relPath;
		}))
		//.pipe(connect.reload())
);

gulp.task('pugdata', () =>
	gulp.src('./app/pug/data/*.pug')
		.pipe(pug({
			pretty: true
		})
		.on('error', function(err) {
			let displayErr = gutil.colors.red(err.message);
			gutil.log(displayErr);
			this.emit('end');
		}))
		.pipe(gulp.dest(file => {
			var pugIndex = file.base.lastIndexOf('pug');
			var relPath = file.base.substr(pugIndex+4);
			return PUB_DIR.root + relPath;
		}))
		//.pipe(connect.reload())
);

gulp.task('imagemin', () =>
	gulp.src(SRC_FILES.images)
		//.pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
		.pipe(gulp.dest(PUB_DIR.img))
		//.pipe(connect.reload())
);

gulp.task('copyAssets', () =>
	gulp.src(SRC_FILES.assets)
		.pipe(gulp.dest(PUB_DIR.root))
		//.pipe(connect.reload())
);

gulp.task('test', function() {
	return gulp.src('./test/*.html')
		.pipe(qunit({'page': {
			viewportSize: { width: 1280, height: 800 }
		}}));
});

gulp.task('watch', () => {
	gulp.watch([SRC_DIR.less + '*.less', SRC_DIR.less + '**/*.less'], ['less']);
	gulp.watch([SRC_DIR.js + 'site.js', SRC_DIR.js + 'plugins/*.js', SRC_DIR.js + 'guide/guide.js', SRC_DIR.js + 'guide/**/*.js'], ['scripts']);
	gulp.watch([SRC_DIR.pug + '**/*.pug', SRC_DIR.pug + '*.pug'], ['pug']);
	gulp.watch(SRC_FILES.images, ['imagemin']);
	gulp.watch(SRC_FILES.assets, ['copyAssets']);
});

gulp.task('clean', () => {
	return gulp.src('./public', {read: false})
		.pipe(clean());
});

gulp.task('webserver', () =>
	connect.server({
		root: PUB_DIR.root,
		livereload: false,
		port: process.env.PORT || 5000
	})
);

gulp.task('server', ['watch', 'webserver']);
gulp.task('build', ['less', 'pug', 'pugdata', 'imagemin', 'scripts', 'jsguide', 'libs', 'copyAssets']);
gulp.task('default', ['clean'], () => { gulp.run(['build', 'server']); });
gulp.task('deploy', ['build', 'webserver']);
