/**
 * Build
 *
 * The create-guten-block CLI builds here.
 */

'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on( 'unhandledRejection', err => {
	throw err;
} );

// Modules.
const fs = require( 'fs' );
const path = require( 'path' );
const ora = require( 'ora' );
const chalk = require( 'chalk' );
const webpack = require( 'webpack' );
const fileSize = require( 'filesize' );
const gzipSize = require( 'gzip-size' );
const config = require( '../config/webpack.config.prod' );
const consoleClear = require( 'console-clear' );
const formatWebpackMessages = require( 'webpack-format-messages' );

// Build file paths.
const theCWD = process.cwd();
const fileBuildJS = path.resolve( theCWD, './dist/block.build.js' );
const fileEditorCSS = path.resolve( theCWD, './dist/block.editor.build.css' );
const fileStyleCSS = path.resolve( theCWD, './dist/block.style.build.css' );

const getFileSize = filePath => {
	return fileSize( gzipSize.sync( fs.readFileSync( filePath ) ) );
};

consoleClear();

const spinner = new ora( { text: '' } );
async function build( webpackConfig ) {
	const compiler = await webpack( webpackConfig );
	spinner.start(
		chalk.green( '正在构建文件....' )
	);
	compiler.run( ( err, stats ) => {
		consoleClear();
		spinner.stop();
		if ( err ) {
			return console.log( err );
		}
		const messages = formatWebpackMessages( stats );

		if ( messages.errors.length ) {
			if ( messages.errors.length > 1 ) {
				messages.errors.length = 1;
			}

			consoleClear();

			console.log( '😟 ', chalk.black.bgRed( ' 编译构建失败！\n' ) );
			console.log( '\n👉 ', messages.errors.join( '\n\n' ) );
			console.log( '\n' );

			return;
		}

		console.log( '😃 ', chalk.black.bgGreen( ' 构建成功！' ) );

		console.log(
			'\n\n',
			'构建后文件大小',
			'\n\n',
			getFileSize( fileBuildJS ),
			`${ chalk.dim( '— ./dist/' ) }`,
			`${ chalk.green( 'blocks.build.js' ) }`,
			'\n',
			getFileSize( fileEditorCSS ),
			`${ chalk.dim( '— ./dist/' ) }`,
			`${ chalk.green( 'blocks.editor.build.css' ) }`,

			'\n',
			getFileSize( fileStyleCSS ),
			`${ chalk.dim( '— ./dist/' ) }`,
			`${ chalk.green( 'blocks.style.build.css' ) }`,

			'\n\n'
		);

		return true;
	} );
}

build( config );
