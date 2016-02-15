var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    webserver = require('gulp-webserver');

var dir = {
    src: {
        images: 'src/images/*',
        templates: 'src/templates/**/*',
        js: 'src/js/**/*',
        scss: 'src/styles/**/*.scss',
        bower: 'src/bower_components/**/*'
    },
    dest: {
        images: 'dist/images',
        html: 'dist/html',
        js: 'dist/js',
        css: 'dist/style',
        bower: 'bower_components'
    }
};

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src(dir.src.scss)
        .pipe(concat('all.scss'))
        .pipe(sass())
        .pipe(gulp.dest(dir.dest.css));
});

// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src(['src/js/app.js', dir.src.js])
        .pipe(concat('all.js'))
        .pipe(gulp.dest(dir.dest.js))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(dir.dest.js));
});

gulp.task('html', function() {
    return gulp.src(dir.src.templates)
        .pipe(gulp.dest(dir.dest.html))
})

gulp.task('images', function() {
    return gulp.src(dir.src.images)
        .pipe(gulp.dest(dir.dest.images))
})

gulp.task('watch', function() {
    gulp.watch(dir.src.js, ['scripts']);
    gulp.watch(dir.src.scss, ['sass']);
    gulp.watch(dir.src.templates, ['html']);
    gulp.watch(dir.src.images, ['images']);
});

gulp.task('clean', function() {
    return gulp.src([dir.dest.html, dir.dest.css, dir.dest.images, dir.dest.js], {
            read: false
        })
        .pipe(clean());
});

gulp.task('serve', function() {
    return gulp.src('./')
        .pipe(webserver({
            livereload: true,
            port: 8080,
            open: true
        }));
});

gulp.task('build', ['sass', 'scripts', 'images', 'html']);

gulp.task('default', ['sass', 'scripts', 'images', 'html', 'watch', 'serve']);

gulp.task('deploy', ['sass', 'scripts', 'html', 'images', 'bower']);
