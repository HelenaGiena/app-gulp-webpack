//common
const gulp = require("gulp");
const plumber = require("gulp-plumber");
const gulpIf = require("gulp-if");

//clear
const del = require("del");

//templates
const pug = require("gulp-pug");

//styles
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const minifyCss = require("gulp-clean-css");

const isProduction = process.env.NODE_ENV === "production";

//scripts
const webpack = require("webpack");
const gulpWebpack = require("webpack-stream");
const webpackConfig = require("./webpack.config.js");//в отличие от пакетов подключаемых ранее - указываем путь до файла

//imagies
const imagemin = require("gulp-imagemin");

//server
const browserSync = require("browser-sync").create();

const PATHS = {
    app: "./app",
    dist: ".dist"
}

//tasks
gulp.task('clear', () => {return del(PATHS.dist)});
gulp.task('templates', () => {return gulp
    .src(`${PATHS.app}/pages/**/*.pug`, {
        since: gulp.lastRun("templates")
    })
    .pipe(plumber())
    .pipe(pug({ pretty: true}))
    .pipe(gulp.dest(PATHS.dist))
});
gulp.task('styles', () => {return gulp
    .src(`${PATHS.app}/common/styles/**/*.scss`, {
        since: gulp.lastRun("styles")
    })
    .pipe(plumber())
    .pipe(gulpIf(!isProduction, sourcemaps.init()))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulpIf(isProduction, minifyCss()))
    .pipe(gulpIf(!isProduction, sourcemaps.write()))
    .pipe(gulp.dest(`${PATHS.dist}/assets/styles`));
});
gulp.task('scripts', () => {
    return gulp.src(`${PATHS.app}/common/scripts/**/*.js`,{
        since: gulp.lastRun("scripts")
    })
    .pipe(gulpWebpack(webpackConfig, webpack))
    .pipe(gulp.dest(`${PATHS.dist}/assets/scripts`))
});
gulp.task('images', () => {
    return gulp
        .src(`${PATHS.app}/common/images/**/*.+(png|jpg|jpeg|gif|svg|ico)`, {
            since: gulp.lastRun("images")
        })
        .pipe(plumber())
        .pipe(gulpIf(isProduction, imagemin()))
        .pipe(gulp.dest(`${PATHS.dist}/assets/images`));

});
gulp.task('copy', () => {
    return gulp.src(`${PATHS.app}/common/fonts/**/*.+(ttf|otf|otc|ttc|fnt|fon|eot)`, {
        since: gulp.lastRun("copy")
    })
    .pipe(gulp.dest(`${PATHS.dist}/assets/fonts`))
});
gulp.task('server', () => {
    browserSync.init({
        server: PATHS.dist
    });
    browserSync.watch(PATHS.dist + "/**/*.*", browserSync.reload);
});
gulp.task('watch', () => {
    gulp.watch(`${PATHS.app}/**/*.pug`, gulp.series("templates"));
    gulp.watch(`${PATHS.app}/**/*.scss`, gulp.series("styles"));
    gulp.watch(`${PATHS.app}/**/*.js`, gulp.series("scripts"));
    gulp.watch(
        `${PATHS.app}/common/images/**/*.+(png|jpg|jpeg|gif|svg|ico)`,
        gulp.series("images")
    );
});

gulp.task('default',
    gulp.series(
        gulp.parallel("templates", "styles", "scripts", "images"),
        gulp.parallel("watch", "server")
    )
);

gulp.task('production',
    gulp.series(
        "clear",
        gulp.parallel("templates", "styles", "scripts", "images")
    )
)
