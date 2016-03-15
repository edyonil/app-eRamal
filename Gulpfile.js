

'use strict';

var childProcess = require('child_process');
var electron = require('electron-prebuilt');
var gulp = require('gulp');
var jetpack = require('fs-jetpack');
var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var os = require('os');


var releaseForOs = {
    osx: require('./tasks/release/osx'),
    linux: require('./tasks/release/linux'),
    windows: require('./tasks/release/windows')
};

var projectDir = jetpack;
var srcDir = projectDir.cwd('./app');
var destDir = projectDir.cwd('./build');

// -------------------------------------
// Tasks
// -------------------------------------

gulp.task('clean', function (callback) {
    return destDir.dirAsync('.', { empty: true });
});

gulp.task('copy', ['clean'], function () {
    return projectDir.copyAsync('app', destDir.path(), {
        overwrite: true,
        matching: [
            './node_modules/**/*',
            '*.html',
            '*.css',
            'main.js',
            'package.json'
        ]
    });
});

gulp.task('build', ['copy'], function () {
    return gulp.src('./app/index.html')
        .pipe(usemin({
            js: [uglify()]
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('run', function () {
    childProcess.spawn(electron, ['./app'], { stdio: 'inherit' });
    //gulp.watch(['./app/index.html'], ['run']);
});

gulp.task('release', function () {
    //return release.build();

    switch (os.platform()) {
        case 'darwin':
             return releaseForOs['osx'].build();
            break;
        case 'linux':
            return releaseForOs['linux'].build();
            break;
        case 'win32':
            return releaseForOs['windows'].build();
    }
});
