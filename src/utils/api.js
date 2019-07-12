import axios from 'axios';

/**
 * 构建基于一个对象的查询字符串并发送 GET 请求
 *
 * @param {object} args 参数
 * @returns {promise} AxiosPromise
 */
export const getPosts = ( { ...args } ) => {
	const queryString = Object.keys( args ).map( arg => `${ arg }=${ args[ arg ] }` ).join( '&' );
	return axios.get( `/wp-json/wp/v2/posts?${ queryString }&_embed` );
};

