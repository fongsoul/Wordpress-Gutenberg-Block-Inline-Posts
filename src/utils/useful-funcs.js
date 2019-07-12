/**
 * 基于所需的关键返回一个独特的数组对象
 * @param {array} arr - 数组对象.
 * @param {string|number} key - 指定的键
 * @returns {array} 过滤后的数组对象
 */
export const uniqueBy = function uniqueBy( arr, key ) {
	const keys = [];
	return arr.filter( function( item ) {
		if ( keys.indexOf( item[ key ] ) !== -1 ) {
			return false;
		}

		return keys.push( item[ key ] );
	} );
};

/**
 * 使数组项唯一
 * @param {array} arr - 准备要过滤的数组
 * @returns {array} 一个基于 id 属性独特的数组对象。
 */
export const uniqueById = function uniqueById( arr ) {
	return uniqueBy( arr, 'id' );
};
