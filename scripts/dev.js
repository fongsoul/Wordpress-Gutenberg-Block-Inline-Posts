'use strict';

// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

process.on( 'unhandledRejection', err => {
	throw err;
} );

const ora = require( 'ora' );
const chalk = require( 'chalk' );
const webpack = require( 'webpack' );
const config = require( '../config/webpack.config.dev' );
const consoleClear = require( 'console-clear' );
const formatWebpackMessages = require( 'webpack-format-messages' );

const currentNodeVersion = process.versions.node;
const semver = currentNodeVersion.split( '.' );
const major = semver[ 0 ];

if ( major < 8 ) {
	console.error(
		chalk.red(
			'你现在运行的是 Node ' +
				currentNodeVersion +
				' 版本。\n' +
				'编译需要 Node 8 或更高版本，请升级 Node。 \n'
		)
	);
	process.exit( 1 );
}

consoleClear();

const spinner = new ora( { text: '' } );

async function build( webpackConfig ) {
	// Compiler Instance.
	const compiler = await webpack( webpackConfig );
	spinner.start(
		chalk.green( '正在编译文件....' )
	);
	// Run the compiler.
	compiler.watch( {}, ( err, stats ) => {
		consoleClear();

		if ( err ) {
			return console.log( err );
		}

		// Get the messages formatted.
		const messages = formatWebpackMessages( stats );

		// If there are errors just show the errors.
		if ( messages.errors.length ) {
			// Only keep the first error. Others are often indicative
			// of the same problem, but confuse the reader with noise.
			if ( messages.errors.length > 1 ) {
				messages.errors.length = 1;
			}

			// Clear success messages.
			consoleClear();

			// Formatted errors.
			console.log( '\n😟 ', chalk.black.bgRed( ' 编译失败! \n' ) );
			const logErrors = console.log( '👉 ', messages.errors.join( '\n\n' ) );
			console.log( '\n' );
			spinner.start(
				`${ chalk.green( '正在监听文件更改…（可按 ctrl + c 停止）。' ) }`
			);
			return logErrors;
		}

		// Start the build.

		console.log( '😃 ', chalk.black.bgHex( '#66c18c' )( ' 编译文件成功! \n' ) );
		console.log(
			chalk.white( '请注意，现在是开发环境构建，并没有优化项。' ),
		);
		console.log(
			chalk.white( '线上生产请使用' ),
			chalk.red( 'npm run prod \n' )
		);
		return spinner.start(
			`${ chalk.green( '正在监听文件更改…（可按 ctrl + c 停止）。' ) }`
		);
	} );
}

build( config );
