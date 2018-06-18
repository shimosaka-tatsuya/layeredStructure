var fs = require('fs');
var gulp = require('gulp');
var rename = require('gulp-rename');
var ejs = require("gulp-ejs");
var merge = require('merge-stream');
var sass = require('gulp-sass');
var data = require('gulp-data');

// cssに関するタスク
gulp.task('build-css', function() {
	gulp.src('./_src/**/*.scss')
	.pipe(sass({
		outputStyle: 'expanded'
	}))
    .pipe(rename({extname: '.compiled.css'}))
    .pipe(gulp.dest('./_src/'));
});

// htmlに関するタスク
gulp.task('build-html', function(){
	var buildMock = gulp.src('./_src/**/*.ejs')
	.pipe(data(file => {
	return {
		filename: file.path,
		meta: require("./" + file.path.slice(file.path.indexOf("_src")).slice("_src",file.path.lastIndexOf("/") - file.path.lastIndexOf("") + 1) + "json/meta.json")
	}
	}))
	.pipe(ejs({
		fileKind: 'mock'
	}))
	.pipe(rename({extname: '.html'}))
	.pipe(gulp.dest('./_mock/'));
	
	var buildStg = gulp.src('./_src/**/*.ejs')
	.pipe(data(file => {
	return {
		filename: file.path,
		meta: require("./" + file.path.slice(file.path.indexOf("_src")).slice("_src",file.path.lastIndexOf("/") - file.path.lastIndexOf("") + 1) + "json/meta.json")
	}
	}))
	.pipe(ejs({
		fileKind: 'stg'
	}))
	.pipe(rename({extname: '.html'}))
	.pipe(gulp.dest('./_stg/'));
	
	return merge(buildMock, buildStg);
});

// ファイルの編集を監視
gulp.task('watch', function() {
    gulp.watch(['./_src/**/*.scss', './_src/**/*.css', './_src/**/*.ejs'], ['build-css', 'build-html'])
});

// デフォルトタスク
gulp.task('default', ['build-css','watch']);