// include plug-ins
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var typedoc = require('gulp-typedoc');
var tslint = require('gulp-tslint');
var del = require('del');

// File output
var map = require('map-stream');
var concat = require('gulp-concat');

const baseFolder = '../DracoolaArt.Bot.Kartwars/';
const baseBuildFolder = '../../build/';
const baseDocFolder = '../../doc/';
const projectBuildFolder = `${baseFolder}build/`;
const baseScriptPath = `${baseFolder}lib/`;

var config = {
	//Include all js files but exclude any min.js files
	//src: [
	//	'lib/**/*.js',
	//	'!lib/Logging.js',
	//	'!lib/**/*.min.js',
	//	'!lib/html/**/*.js'
	//]
	src: [
		`${baseFolder}dist/MethodDecorations/bound.js`,
		`${baseFolder}bower_components/density-clustering/dist/clustering.min.js`,
		`${baseFolder}bower_components/victor/build/victor.min.js`,
		`${baseFolder}node_modules/dat.gui/build/dat.gui.js`,
		`${baseFolder}dist/lib/FizzyText/FizzyText.js`,
		`${baseFolder}dist/lib/kd-tree-javascript/kdTree.js`,

		`${baseScriptPath}Logging.js`,
		`${baseScriptPath}MethodDecorations/intercept.js`,
		`${baseScriptPath}MethodDecorations/registers.js`,
		`${baseScriptPath}MethodDecorations/sealed.js`,
		`${baseScriptPath}MethodDecorations/trace.js`,
		`${baseScriptPath}Polyfills.js`,
		`${baseScriptPath}Enums.js`,
		`${baseScriptPath}Data/CollectedGameData.js`,
		`${baseScriptPath}Structures.js`,
		`${baseScriptPath}Manager/Time/Timer.js`,
		`${baseScriptPath}Manager/Time/TimerFrame.js`,
		`${baseScriptPath}GameWrapper.js`,
		`${baseScriptPath}Utils/Functions.js`,
		`${baseScriptPath}Utils/ArrayUtils.js`,
		`${baseScriptPath}Utils/MathUtils.js`,
		`${baseScriptPath}Utils/GeometryIntersectionsUtils.js`,
		`${baseScriptPath}Utils/CanvasUtilsBase.js`,
		`${baseScriptPath}Utils/CanvasUtils.js`,
		`${baseScriptPath}WebSocket.js`,
		`${baseScriptPath}Tactics/Fight/__.js`,
		`${baseScriptPath}Tactics/Fight/ChaseClosest.js`,
		`${baseScriptPath}Tactics/Fight/ShootWhenInRange.js`,
		`${baseScriptPath}Tactics/Resource/__.js`,
		`${baseScriptPath}Tactics/Resource/FindClosestResourceBase.js`,
		`${baseScriptPath}Tactics/Resource/Food/__.js`,
		`${baseScriptPath}Tactics/Resource/Food/FindClosest.js`,
		`${baseScriptPath}Tactics/Resource/Food/FindClosestClusterOptions.js`,
		`${baseScriptPath}Tactics/Resource/Food/FindClosestCluster.js`,
		`${baseScriptPath}Tactics/Resource/Weapon/__.js`,
		`${baseScriptPath}Tactics/Resource/Weapon/FindClosest.js`,
		`${baseScriptPath}Strategy/Behaviour.js`,
		`${baseScriptPath}Strategy/__.js`,
		`${baseScriptPath}Strategy/BotStrategyBase.js`,
		`${baseScriptPath}Strategy/Default.js`,
		`${baseScriptPath}Strategy/Tests/CalculateTorqueBotStrategy.js`,
		`${baseScriptPath}Strategy/Tests/PursuitBotStrategy.js`,
		`${baseScriptPath}Strategy/Tests/PursuitAndShootBotStrategy.js`,
		`${baseScriptPath}Strategy/Tests/DrawEnemiesBotStrategy.js`,
		`${baseScriptPath}Strategy/Tests/InterconnectFoodBotStrategy.js`,
		`${baseScriptPath}Design/Circle/WarCarDesigns.js`,
		`${baseScriptPath}Design/Circle/WeaponDesigns.js`,
		`${baseScriptPath}Design/Polygon/WarCarDesigns.js`,
		`${baseScriptPath}Manager/Collision/__.js`,
		`${baseScriptPath}Manager/Collision/CollisionBaseManager.js`,
		`${baseScriptPath}Manager/Collision/CollisionCourseManager.js`,
		`${baseScriptPath}Manager/Collision/AdvancedCollisionCourseManager.js`,
		//`${baseScriptPath}Manager/Collision/UberCollisionCourseManager.js`,
		`${baseScriptPath}BotOptions.js`,
		`${baseScriptPath}BotBase.js`,
		`${baseScriptPath}Bot.js`,
		`${baseScriptPath}Utils/Interface/ContextMenu.js`,
		`${baseScriptPath}Utils/ScoreHolster.js`,
		`${baseScriptPath}Utils/Interface/Interface.js`,
		`${baseScriptPath}Utils/Interface/DeveloperInterface.js`,
		`${baseScriptPath}Utils/Interface/DatGUI.js`,
		`${baseScriptPath}Experimental/ExternalGraph.js`,
		`${baseScriptPath}Factory.js`
	]
};

//delete the output file(s)
gulp.task('clean', function () {
	//del is an async function and not a gulp plugin (just standard nodejs)
	//It returns a promise, so make sure you return that from this task function
	//  so gulp knows when the delete is complete
	return del(
		[
			`${baseBuildFolder}kartwars.io-bot.js`,
			`${baseBuildFolder}kartwars.io-bot.min.js`,
			`${projectBuildFolder}kartwars.io-bot.js`,
			`${projectBuildFolder}kartwars.io-bot.min.js`
		]
	);
});

// Combine and minify all files from the app folder
// This tasks depends on the clean task which means gulp will ensure that the 
// Clean task is completed before running the scripts task.
gulp.task('scripts', [/*'clean'*/], function () {
	//return gulp.src(config.src)
	//	.pipe(uglify())
	//	.pipe(concat('kartwars.io-bot.min.js'))
	//	.pipe(gulp.dest(baseBuildFolder));

	return gulp.src(config.src)
		.pipe(concat('kartwars.io-bot.js'))
		// This will output the non-minified version
		.pipe(gulp.dest(baseBuildFolder))
		.pipe(gulp.dest(projectBuildFolder))
		// This will minify and rename to kartwars.io-bot.min.js
		.pipe(uglify())
		.pipe(rename({ extname: '.min.js' }))
		.pipe(gulp.dest(baseBuildFolder))
		.pipe(gulp.dest(projectBuildFolder));
});

gulp.task("typedoc", function () {
	return gulp
		.src([
			`${baseFolder}lib/**/*.ts`,
			`!${baseFolder}lib/Experimental/**/*.ts`
		])
		.pipe(typedoc({
			// Base
			mode: 'file',
			out: baseDocFolder,
			json: `${baseDocFolder}to-file.json`,

			// TypeScript compiler
			module: "commonjs",
			target: "es5",

			// Source file handling
			includeDeclarations: false,
			ignoreCompilerErrors: true,
			excludeExternals: false,

			// ++
			plugins: [],

			// Content
			//media: "../../images",

			// Theming
			theme: "default",
			name: "Kartwars Bot",
			readme: '../../README.md',
			gaID: 'UA-64079204-5',

			// Miscellaneous
			version: true,
		}))
		;
});

gulp.task("generate-typedoc", ['typedoc'], function () {
	var sourceFiles = ['../../images/**/*.*'];
	var destination = `${baseDocFolder}images/`;

	return gulp
		.src(sourceFiles)
		.pipe(gulp.dest(destination));
});

// READ @ https://github.com/panuhorsmalahti/gulp-tslint
gulp.task("tslint", function () {
	return gulp
		.src([`${baseFolder}lib/**/*.ts`])
		.pipe(tslint({
			//formatter: "verbose"
			formatter: "msbuild"
		}))
		.pipe(tslint.report())
		;
});

// Example on output to file
gulp.task('tslint-to-file', function () {
	return gulp
		.src([`${baseFolder}lib/**/*.ts`])
		.pipe(tslint({
			formatter: "verbose"
		}))
		.pipe(map(function (file, done) {
			// Add the tslint errors in prose format
			if (file.tslint.output) {
				/*
				file.contents = new Buffer(
					JSON.parse(file.tslint.output)
						.map(tslint.proseErrorFormat).join('\n')
				);
				*/

				var inter = file.tslint.output;
				inter = inter.replace(/\n/g, '\r\n');
				file.contents = new Buffer(inter);
			} else {
				file.contents = new Buffer("");
			}

			done(null, file);
		}))
		// Concat and save the errors
		.pipe(concat('tslint-report.txt'))
		.pipe(gulp.dest('./'));
});

//Set a default tasks
gulp.task('default', ['scripts'], function () { });

gulp.task('watch', function () {
	return gulp.watch(config.src, ['scripts']);
});
