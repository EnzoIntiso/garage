"use strict";

// Load Core
var gulp = require("gulp"),
	runSequence = require("run-sequence");

// Load Plug-ins
var autoprefixer = require("gulp-autoprefixer"),
	cssnano = require("gulp-cssnano"),
	concat = require("gulp-concat"),
	del = require("del"),
	expect = require("gulp-expect-file"),
	gutil = require("gulp-util"),
	htmlmin = require("gulp-htmlmin"),
	inject = require("gulp-inject"),
	jshint = require('gulp-jshint'),
	scsslint = require("gulp-scss-lint"),
    scsslint_stylish  = require("gulp-scss-lint-stylish2"),
	plumber = require("gulp-plumber"),
	sass = require("gulp-sass"),
	series = require("stream-series"),
	sourcemaps = require("gulp-sourcemaps"),
	uglify = require("gulp-uglify"),
	watch = require("gulp-watch"),
	spritesmith = require("gulp.spritesmith");
	


var config = require("./config.json");

var gulp_src = gulp.src;
gulp.src = function() {
	return gulp_src.apply(gulp, arguments)
		.pipe(plumber(function(error) {
			gutil.log(gutil.colors.red("Error (" + error.plugin + "): " + error.message));
			this.emit("end");
		})
	);
};

var sassOptions = {
  errLogToConsole: true,
  outputStyle: "expanded"
};


// TASKS
// styles
gulp.task("minify-html", function() {
	return gulp.src(config.paths.source.html)
	.on("finish", function() { gutil.log(gutil.colors.green("Minifying HTML...")); })
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest(""))
	.on("finish", function() { gutil.log(gutil.colors.green("> DONE: html files are minified are compiled in " + config.paths.source.html)); });
});

gulp.task("compile-styles", function () {
	return gulp.src(config.paths.source.sass_to_compile)
	.on("finish", function() { gutil.log(gutil.colors.green("Compiling SCSS...")); })
    .pipe(sass(sassOptions))
    .pipe(gulp.dest(config.paths.source.root + "/" + config.folders.css_folder))
	.on("finish", function() { gutil.log(gutil.colors.green("> DONE: styles are compiled in " + config.paths.source.root + "/" + config.folders.css_folder)); });
});

gulp.task("generate-styles", function () {	
	return gulp.src(config.paths.source.css)
	.pipe(sourcemaps.init())
	.pipe(autoprefixer({ browsers: ["last 2 version"] }))
	.on("finish", function() { gutil.log(gutil.colors.green("Minifying CSS...")); })
	.pipe(cssnano())
	.on("finish", function() { gutil.log(gutil.colors.green("Concatenating CSS...")); })
	.pipe(concat("main.css"))
	.pipe(sourcemaps.write("."))
    .pipe(gulp.dest(config.paths.build.root + "/" + config.folders.css_folder))
	.on("finish", function() { gutil.log(gutil.colors.green("> DONE: styles are built in " + config.paths.build.root + "/" + config.folders.css_folder)); });
});

gulp.task("generate-styles-no-min", function () {
	return gulp.src(config.paths.source.css)
	.pipe(sourcemaps.init())
	.pipe(autoprefixer({ browsers: ["last 2 version"] }))
	.on("finish", function() { gutil.log(gutil.colors.green("Concatenating CSS...")); })
	.pipe(concat("main.css"))
	.pipe(sourcemaps.write())
    .pipe(gulp.dest(config.paths.build.root + "/" + config.folders.css_folder))
	.on("finish", function() { gutil.log(gutil.colors.green("> DONE: styles are built in " + config.paths.build.root + "/" + config.folders.css_folder)); });
});

gulp.task("scss-lint", function() {
	return gulp.src(config.paths.source.sass)
	.pipe(scsslint( { "config": "lint.yml" } ));
});

gulp.task("scss-lint-stylish", function()
{
    var reporter = scsslint_stylish();
	return gulp.src(config.paths.source.sass)
	.pipe( scsslint( { "config": "lint.yml", "customReport": reporter.issues }) )
	.pipe( reporter.printSummary );
	
});

// javascript
gulp.task('jshint', function() {
  return gulp.src(config.paths.source.backbone)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// multimedia
/*
gulp.task("build-images",function(){
	return gulp.src(config.paths.source.images) 
	.on("finish", function() { gutil.log(gutil.colors.green("Optimizing images...")); })
	.pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    }))
	.pipe(gulp.dest(config.paths.build.root + "/" + config.folders.image_folder))
	.on("finish", function() { gutil.log(gutil.colors.green("> DONE: images are built.")); });
});
*/
gulp.task("sprite", function () {
    var spriteData = gulp.src(config.paths.source.sprites)
	.pipe(spritesmith({
		/* this whole image path is used in css background declarations */
		imgName: "../" + config.folders.image_folder + "/" + config.folders.sprites_folder + "/icons.png",
		cssName: "sprite.css"
	}))
    spriteData.img.pipe(gulp.dest(config.paths.build.root + "/" + config.folders.sprites_folder))
	.on("finish", function() { gutil.log(gutil.colors.green("> DONE SPRITE IMAGE: sprite is built in "+config.paths.build.root + "/" + config.folders.sprites_folder)); });
	
    spriteData.css.pipe(gulp.dest(config.paths.source.root + "/" + config.folders.css_folder + "/sprites"))
	.on("finish", function() { gutil.log(gutil.colors.green("> DONE SPRITE CSS: CSS is built in "+config.paths.source.root + "/" + config.folders.css_folder)); });
});

// service
gulp.task("inject", function(){
	var vendorStream = gulp.src(config.paths.build.vendor, {read: false});
	var appStream = gulp.src(config.paths.build.javascript.concat(config.paths.build.css), {read: false});

    gulp.src(config.paths.source.html)
	.pipe(inject(
		series(vendorStream, appStream), 
		{relative: true}
	))
	.pipe(gulp.dest("./"));
});

gulp.task("inject-css", function(){
	var appStream = gulp.src(config.paths.build.css, {read: false});
    gulp.src(config.paths.source.html)
	.pipe(inject(
		series(appStream), 
		{relative: true}
	))
	.pipe(gulp.dest("./"));
});

gulp.task("clean:build", function () {
	return del([config.paths.build.root], gutil.log(gutil.colors.green("> BUILD CLEANED: " + config.paths.build.root)));
});

gulp.task("clean:tmp-css", function () {
	return del(config.paths.source.css_to_delete, gutil.log(gutil.colors.green("> CSS TEMP FOLDER CLEANED: " + config.paths.source.css_to_delete))); 
});

gulp.task("clean:build-css", function () {
	return del(config.paths.build.css, gutil.log(gutil.colors.green("> CSS TEMP FOLDER CLEANED: " + config.paths.build.css))); 
});

gulp.task("import-resources", function() {
	for (var lib in config.libmap) {
		var source = config.libmap[lib].source;
		var target = config.libmap[lib].target;
		gutil.log("Copying " + lib );
		gutil.log(gutil.colors.green("from: " + source));
		gutil.log(gutil.colors.green("to: " + target));
		gulp.src(source)
		.pipe(expect(source))		
		.pipe(gulp.dest(target));
	}
});

// WATCHERS 
gulp.task("watch", function() {
	gulp.watch(config.paths.source.sass, ["build-styles"])
	.on("change", function(event) { gutil.log(gutil.colors.yellow("File " + event.path + " was " + event.type + ", running tasks...")); });
});

gulp.task("watch-no-min-styles", function() {
	gulp.watch(config.paths.source.sass, ["build-styles-no-min"])
	.on("change", function(event) { gutil.log(gutil.colors.yellow("File " + event.path + " was " + event.type + ", running tasks...")); });
});

/* MAIN RUNNERS */
gulp.task("build-styles", function (cb) {
	runSequence(
		["clean:tmp-css", "clean:build-css"],
		"compile-styles",
        "generate-styles",
        cb
	);
});

// same as runner "build-styles" but does not minify
gulp.task("build-styles-no-min", function (cb) {
	runSequence(
		["clean:tmp-css", "clean:build-css"],
		"compile-styles",
        "generate-styles-no-min",
        cb
	);
});

// runner for importing resources, spriting, linting scss, minifing styles in one single + injection
gulp.task("default", function (cb) {
	runSequence(
		["sprite", "import-resources"],
		["jshint", "scss-lint"],
        "build-styles",
		"inject-css",
        cb
	);
});

// same as default but does not minify CSS files
gulp.task("default-no-min-styles", function (cb) {
	runSequence(
		["sprite", "import-resources"],
		["jshint", "scss-lint"],
        "build-styles-no-min",
		"inject-css",
        cb
	);
});


