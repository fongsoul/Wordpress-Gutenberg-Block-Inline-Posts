const paths = require( './paths' );
const webpack = require( 'webpack' );
const autoprefixer = require( 'autoprefixer' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const StyleLintPlugin = require( 'stylelint-webpack-plugin' );
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP === 'true';

const blockCSSPlugin = new ExtractTextPlugin( {
	filename: './dist/block.style.build.css',
} );

const editBlocksCSSPlugin = new ExtractTextPlugin( {
	filename: './dist/block.editor.build.css',
} );

const extractConfig = {
	use: [
		{ loader: 'raw-loader' },
		{
			loader: 'postcss-loader',
			options: {
				ident: 'postcss',
				plugins: [
					autoprefixer( {
						browsers: [
							'>1%',
							'last 4 versions',
							'Firefox ESR',
							'not ie < 9',
						],
						flexbox: 'no-2009',
					} ),
				],
			},
		},
		{
			loader: 'group-css-media-queries-loader',
		},
		{
			loader: 'sass-loader',
			options: {
				outputStyle: 'compressed',
			},
		},
	],
};

module.exports = {
	entry: {
		'./dist/block.build': paths.pluginBlockJs,
	},
	output: {
		pathinfo: true,
		path: paths.pluginDist,
		filename: '[name].js',
	},
	devtool: shouldUseSourceMap ? 'source-map' : false,
	module: {
		rules: [
			{
				test: /\.(js|jsx|mjs)$/,
				exclude: /(node_modules|bower_components)/,
				use: [ {
					loader: 'babel-loader',
					options: {
						babelrc: true,
						cacheDirectory: true,
					},
				}, {
					loader: 'eslint-loader',
					options: {
						fix: true,
					},
				} ],
			},
			{
				test: /render\.s?css$/,
				exclude: /(node_modules|bower_components)/,
				use: blockCSSPlugin.extract( extractConfig ),
			},
			{
				test: /editor\.s?css$/,
				exclude: /(node_modules|bower_components)/,
				use: editBlocksCSSPlugin.extract( extractConfig ),
			},
		],
	},
	// Add plugins.
	plugins: [
		blockCSSPlugin,
		editBlocksCSSPlugin,
		StyleLintPlugin(
			{
				files: [ 'src/**/*.scss' ],
				fix: true,
			}
		),
		new webpack.optimize.UglifyJsPlugin( {
			compress: {
				warnings: false,
				comparisons: false,
			},
			mangle: {
				safari10: true,
				except: [ '__', '_n', '_x', '_nx' ],
			},
			output: {
				comments: false,
				ascii_only: true,
			},
			sourceMap: shouldUseSourceMap,
		} ),
	],
	stats: 'minimal',
};
