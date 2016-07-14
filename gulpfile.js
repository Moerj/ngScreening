var gulp = require('gulp');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var uglify = require('gulp-uglify'); //js压缩
var rename = require('gulp-rename'); //文件更名
var sass = require('gulp-sass'); //sass编译
var less = require('gulp-less'); //less
var autoprefixer = require('gulp-autoprefixer'); //css自动浏览器前缀

gulp.task('sass', function() {
    gulp.src('sass/*.scss')
        // .pipe(plumber({
        //     errorHandler: notify.onError('Error: <%= error.message %>')
        // }))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0']
        }))
        // .pipe(rename({
        //     suffix: '.min' //将处理后的文件加上.min后缀,代表该文件是压缩的
        // }))
        // .pipe(minifycss())
        .pipe(gulp.dest('css/'))
        .pipe(reload({
            stream: true //改变页面上的样式而不刷新页面
        }));
});

gulp.task('less', function() {
    gulp.src('less/*.less')
        // .pipe(plumber({
        //     errorHandler: notify.onError('Error: <%= error.message %>')
        // }))
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0']
        }))
        // .pipe(rename({
        //     suffix: '.min' //将处理后的文件加上.min后缀,代表该文件是压缩的
        // }))
        // .pipe(minifycss())
        .pipe(gulp.dest('css/'))
        .pipe(reload({
            stream: true //改变页面上的样式而不刷新页面
        }));
});

gulp.task('js-compress', function(){
	return gulp.src(['js/**/*.js','!js/index.js','!js/*.min.js'])
		.pipe(uglify({
            preserveComments: 'license'
        }))
        .pipe(rename({
            suffix : '.min'
        }))
		.pipe(gulp.dest('js/'));
});

gulp.task('default',  function() {

    browserSync.init({
        // port : 9000,
        // files: "**",
        files: ["./css/*.css", "./**/*.html", "./js/*.js"],

        // 静态站点
        server: {
            baseDir: "./",
            index: "index.html"
        }
    });

    gulp.watch('sass/**/*.scss', ['sass']);
    gulp.watch('less/**/*.less', ['less']);
});
