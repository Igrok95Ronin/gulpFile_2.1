const { src, dest, parallel, watch } = require('gulp');//gulp
const del = require('del');/* удаляет каталог */
const cleanCSS = require('gulp-clean-css');//min css
const uglify = require('gulp-uglify');/* минификация js */
const sass = require('gulp-sass')(require('sass'));/* припроцессор sass/scss */
const autoprefixer = require('gulp-autoprefixer');/* web префиксы для старых браузеров */
const concat = require('gulp-concat');/* объединяет несколько файлов в один и меняет название */
const browserSync = require('browser-sync').create();/* обновляет браузер */
const sourcemaps = require('gulp-sourcemaps');/* карта */
const imagemin = require('gulp-imagemin');/* минификация изображений */
const newer = require('gulp-newer')/* позволяет отслеживать новые файлы */


function clean() {
    return del(['app/assets/*', '!app/assets/img'])/* удалит все данные кроме img */
}


function index() {
    return src('src/index.*')
        .pipe(browserSync.stream())/* обновление браузера */
        .pipe(dest('app/'))
}


function style() {
    return src('src/assets/scss/*.scss')
        .pipe(sourcemaps.init())/* начала карты */
        .pipe(concat('style.min.css'))
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 10 version'],/* префиксы для старых версий последние 10 версий браузеров */
            grid: true
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write())/* конец карты */
        .pipe(browserSync.stream())/* обновление браузера */
        .pipe(dest('app/assets/css'))
}


function script() {
    return src('src/assets/js/main.js')
        .pipe(concat("main.min.js"))
        .pipe(uglify())
        .pipe(browserSync.stream())/* обновление браузера */
        .pipe(dest('app/assets/js'))
}


function images() {
    return src('./src/assets/img/*')
        .pipe(newer('app/assets/img'))
        .pipe(browserSync.stream())
        .pipe(imagemin(/* минификация */
            [
                imagemin.gifsicle({ interlaced: true }),
                imagemin.mozjpeg({ quality: 75, progressive: true }),
                imagemin.optipng({ optimizationLevel: 5 }),
                imagemin.svgo({
                    plugins: [
                        { removeViewBox: true },
                        { cleanupIDs: false }
                    ]
                })
            ]
        ))
        .pipe(dest('app/assets/img/'))
}


function fonts() {
    return src('./src/assets/fonts/*')
        .pipe(browserSync.stream())
        .pipe(dest('app/assets/fonts'))
}


function icons() {
    return src('./src/assets/icons/*')
        .pipe(browserSync.stream())
        .pipe(dest('app/assets/icons'))
}


function watches() {
    browserSync.init({/* инициализация browserSync */
        server: {
            baseDir: "./app"/* дириктория где находиться проект */
        }
    })
    watch('./src/index.*', index);/* обновляет браузер при изминении index.* */
    watch('src/assets/scss/*.scss', style);
    watch('src/assets/js/main.js', script);
    watch('src/assets/img/*', images);
    watch('src/assets/fonts/*', fonts);
    watch('src/assets/icons/*', icons);
}

exports.clean = clean;

exports.default = parallel(index, style, script, images, fonts, icons, watches);