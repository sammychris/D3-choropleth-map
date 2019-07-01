const { src, dest, watch } = require('gulp');
const sass = require('gulp-sass');

function defaultTask(cb) {
	src('app/sass/**/*.scss')
		.pipe(sass())
		.pipe(dest('app/css'));
	cb();
}

exports.default = function () {
	watch('app/sass/**/*.scss', defaultTask);
}





