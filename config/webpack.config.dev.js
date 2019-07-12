const paths = require( './paths' );
const autoprefixer = require( 'autoprefixer' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

const blocksCSSPlugin = new ExtractTextPlugin( {
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
			loader: 'sass-loader',
			options: {
				outputStyle: 'nested',
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
	devtool: 'cheap-eval-source-map',
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
				use: blocksCSSPlugin.extract( extractConfig ),
			},
			{
				test: /editor\.s?css$/,
				exclude: /(node_modules|bower_components)/,
				use: editBlocksCSSPlugin.extract( extractConfig ),
			},
		],
	},
	plugins: [ blocksCSSPlugin, editBlocksCSSPlugin ],
	stats: 'minimal',
};
