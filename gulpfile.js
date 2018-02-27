var gulp = require('gulp'),
minifyCss = require('gulp-clean-css'),
rename = require('gulp-rename'),
prefixer = require('gulp-autoprefixer'),
connect = require('browser-sync'),
plumber = require('gulp-plumber'),
sass = require('gulp-sass'),
sourcemaps = require('gulp-sourcemaps'),
cssmin = require('gulp-clean-css'),
spritesmith = require('gulp.spritesmith'),
imagemin = require('gulp-imagemin'),
concat = require('gulp-concat'),
uglify = require('gulp-uglify'),
concatCss = require('gulp-concat-css');



// server connect
gulp.task('connect', function() {
  connect({
    server:{
        baseDir:"./public"
    },
    host:"localhost", port:9000
  })
});

// html
gulp.task('html', function() {
	gulp.src('./src/index.html')
	.pipe(gulp.dest('./public'))
	.pipe(connect.reload({stream: true}));
})

// styles
gulp.task('style', function () {
    gulp.src('./src/styles/main.scss')
        .pipe(sass())
        .pipe(prefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
        
        .pipe(sourcemaps.init())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'))
        .pipe(connect.reload({stream: true}));
});
// js
gulp.task('js', function () {
    gulp.src([
        './node_modules/jquery/dist/jquery.js',
        './src/js/index.js'
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('index.js'))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/js'))
        .pipe(connect.reload({stream: true}));
});

// sprites
gulp.task('sprite', function () {
    var spriteData = gulp.src('./src/image/sprites/*.png')
        .pipe(spritesmith({
            imgName: 'sprite.png',
            cssName: 'sprite.scss'
        }));
    return spriteData.img.pipe(gulp.dest('./src/image'));
    
});

// image
gulp.task('image', function () {
    gulp.src('./src/image/**/*.*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            interlaced: true
        }))
        .pipe(gulp.dest('./public/image'))
        .pipe(connect.reload({stream: true}));
});
// fonts
gulp.task('fonts', function() {
    gulp.src('./src./fonts')
        .pipe(gulp.dest('./public/fonts'))
});
// build
gulp.task('build', [
    'html',
    'js',
    'style',
    'fonts',
    'image'
    
]);

// watch
gulp.task('watch', function(){
    gulp.watch('./src/**/*.html', function() {
        gulp.start('html');
    });
    gulp.watch('./src/styles/**/*.scss', function() {
        gulp.start('style');
    });
    gulp.watch('./src/js/**/*.js', function() {
        gulp.start('js');
    });
    gulp.watch('./src/image/**/*.*', function() {
        gulp.start('image');
    });
    gulp.watch('./src/fonts/**/*.*', function() {
        gulp.start('fonts');
    });
});


// default
gulp.task('default', ['build', 'connect', 'watch']);