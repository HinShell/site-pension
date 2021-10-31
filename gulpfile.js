const {
    src,
    dest,
    parallel,
    series,
    watch,
    task
} = require('gulp')

const imgwebp = require('gulp-webp');
const minify = require('gulp-clean-css');
const include = require('gulp-html-tag-include');
const htmlmin = require('gulp-htmlmin');
const sass = (require('gulp-sass'))(require('sass'));
const concat = require('gulp-concat');
const del = require('del');
const rename = require('gulp-rename');

function deleteDistFolder() {
    return del(['./dist']);
}
function deleteTmpFolder() {
    return del('./src/tmp');
}
function minifyHtml() {
    return src('./src/tmp/index.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(dest('./dist'));
}
function processScss() {
    return src('./src/assets/scss/main.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(dest('./src/tmp'));
}
function htmlTemplate() {
    return src('./src/index.html')
        .pipe(include())
        .pipe(dest('./src/tmp'))
}
function copyImg() {
    return src('./src/assets/images/**/*')
        .pipe(dest('./dist/assets/images'))
}
function copyFonts() {
    return src('./src/assets/fonts/**/*')
        .pipe(dest('./dist/assets/fonts'))
}
function concatCss() {
    return src(['./src/assets/css/bulma.min.css', './src/tmp/main.css', './src/tmp/fonts.css'])
        .pipe(concat('main.css'))
        .pipe(dest('./dist/assets/css/'));
};
function minifyCss() {
    return src('./src/assets/css/fonts.css')
        .pipe(minify())
        .pipe(dest('./src/tmp'))
}
function imagesWebp() {
    return src(['./src'+'/assets/images/*.{gif,png,jpg}'])
        .pipe(imgwebp({quality: 65,method: 6}))
        .pipe(rename({extname: '.png.webp'}))
        .pipe(dest('./dist'))

}

exports.default =   task(deleteDistFolder)
                    task(minifyHtml)
                    task(processScss)
                    task(htmlTemplate)
                    task(copyImg)
                    task(concatCss)
                    task(deleteTmpFolder)
                    task(copyFonts)
                    task(minifyCss)
                    task(imagesWebp)
exports.build =     series(deleteDistFolder, htmlTemplate, minifyHtml, minifyCss, processScss, concatCss, imagesWebp, copyImg, copyFonts, deleteTmpFolder) 