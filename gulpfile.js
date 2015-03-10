
/**
 * Load Plugins
 */
var gulp		= require('gulp');
var del			= require('del');
var plugins	= require('gulp-load-plugins')();


/**
 * Config Options
 */
var config = {
	path : {
		build : {
			root	: 'build',
			img		: 'build/img'
		},
		dev : {
			root	: 'dev',
			css		: 'dev/css',
			scss	: 'dev/css/src',
			img		: 'dev/img',
			js		: 'dev/js',
			assets: 'dev/assets'
		}
	}
};


/**
 * Development Tasks
 */
gulp.task('css', function() {
	return gulp.src(config.path.dev.scss + '/*.scss')
		.pipe(plugins.sass({ style: 'expanded', errLogToConsole: true }))
		.pipe(plugins.autoprefixer('last 2 version', 'safari 5', 'ie 8',
			'ie 9', 'opera 12.1'))
		.on('error',plugins.util.log)
		.pipe(gulp.dest(config.path.dev.css));
});

gulp.task('js', function() {
	return gulp.src(config.path.dev.js + '/*.js')
		.on('error',plugins.util.log)
		.pipe(plugins.jshint());
});

gulp.task('images', function() {
	gulp.src(config.path.dev.assets + '/imgs/**/*')
		.pipe(plugins.imagemin({
			optimizationLevel: 7
		}))
		.pipe(gulp.dest(config.path.dev.assets + '/imgs'));
	gulp.src(config.path.dev.img + '/**/*')
		.pipe(plugins.imagemin({
			optimizationLevel: 7
		}))
		.pipe(gulp.dest(config.path.dev.img));
});

gulp.task('watch', function() {
	plugins.livereload.listen();
	gulp.watch([config.path.dev.root + '/**/*.html',config.path.dev.root + '/**/*.php'])
		.on('change', plugins.livereload.changed);
	gulp.watch(config.path.dev.root + '/**/*.js', ['js']).on('change', plugins.livereload.changed);
	gulp.watch(config.path.dev.root + '/**/*.scss', ['css']).on('change', plugins.livereload.changed);
});



/**
 * Build/Production Tasks
 */
gulp.task('build:clean', function(cb) {
	del([ config.path.build.root + '/*',
				config.path.build.root + '/.*' ], cb);
});

gulp.task('build:move', function() {
	return gulp.src([
			config.path.dev.root + '/*.*',
			config.path.dev.root + '/.*',
			config.path.dev.root + '/img/*.*',
			config.path.dev.root + '/partials/**/*.*',
			config.path.dev.assets + '/**/*.*'
		], {base: config.path.dev.root})
		.pipe(gulp.dest(config.path.build.root));
});

gulp.task('build:main', function() {
	return gulp.src(config.path.dev.root + '/index.html')
		.pipe(plugins.replace(/<!--\s*replace:ga\s*[\[\('"]?(.[^\s]*)?[\]\)"']?\s*-->/gi, 
					function(string, p1) {
						return '<script>\n\t\t(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;'+
							'b[l]||(b[l]=\n\t\tfunction(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l='+
							'+new Date;\n\t\te=o.createElement(i);r=o.getElementsByTagName(i)[0];\n\t\t'+
							'e.src=\'//www.google-analytics.com/analytics.js\';\n\t\t'+
							'r.parentNode.insertBefore(e,r)}(window,document,\'script\',\'ga\'));\n\t\t'+
							'ga(\'create\',\''+p1+'\');ga(\'send\',\'pageview\');\n\t</script>';
					}
		))
		.pipe(plugins.usemin({
			css: [
				plugins.minifyCss(),
				'concat',
				plugins.rev()
			],
			js: [
				plugins.uglify(),
				plugins.rev()
			]
			// ,html: [plugins.minifyHtml({conditionals:true,empty:true,cdata:true,comments:true})],
		}))
		.pipe(plugins.cdnizer({
			allowRev: false,
			fallbackScript: '',
			fallbackTest: 
				'\n\t<script>try{${ test }} catch(e) {document.write("\\x3Cscript'+
				' src=\'${ filepath }\'>\\x3C/script>")}</script>',
			files: [
				{	test: 'jQuery',
					cdn: 'google:jquery' },
				{ test: 'angular',
					cdn: 'google:angular' },
				{ test: 'Modernizr',
					cdn: 'cdnjs:modernizr' },
				{ test: 'angular.module(\'ngResource\')',
					cdn: 'cdnjs:angular.js:angular-resource.min.js' },
				{ test: 'angular.module(\'ngRoute\')',
					cdn: 'cdnjs:angular.js:angular-route.min.js' }
			]
		}))
		.pipe(gulp.dest(config.path.build.root));
});


/**
 * Command Liners
 */
gulp.task('default', ['css', 'js', 'watch']);
gulp.task('build', ['build:clean', 'build:move', 'css', 'build:main']);

