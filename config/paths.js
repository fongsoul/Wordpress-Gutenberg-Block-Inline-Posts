/**
 * Paths
 *
 * Project related paths.
 */

const path = require( 'path' );
const fs = require( 'fs' );

// Make sure any symlinks in the project folder are resolved:
const pluginDir = fs.realpathSync( process.cwd() );
const resolvePlugin = relativePath => path.resolve( pluginDir, relativePath );

module.exports = {
	pluginSrc: resolvePlugin( 'src' ),
	pluginBlockJs: resolvePlugin( 'src/block.js' ),
	pluginDist: resolvePlugin( '.' ),
};
