import InlinePosts from './InlinePosts';
import * as api from '../utils/api';
import { uniqueById } from '../utils/useful-funcs';
const { __ } = wp.i18n;
const { Component } = wp.element;

/**
 * PostSelector Component
 */
export class PostSelector extends Component {
	/**
	 * PostSelector 组件的构造函数，设置状态,并创建绑定功能
	 * @param {object} props - 当前的组件属性
	 */
	constructor( props ) {
		super( ...arguments );
		this.props = props;
		this.state = {
			posts: [],
			loading: false,
			type: 'post',
			filter: '',
			filterLoading: false,
			filterPosts: [],
			page: 0,
			totalPages: false,
			paging: false,
			initialLoading: false,
		};

		this.addPost = this.addPost.bind( this );
		this.removePost = this.removePost.bind( this );
		this.handleInputFilterChange = this.handleInputFilterChange.bind( this );
		this.doPostFilter = this.doPostFilter.bind( this );
		this.doPagination = this.doPagination.bind( this );
	}

	/**
	 * 第一次渲染后调用，设置加载状态，获取已经选择的文章，获取后加载状态
	 */
	componentDidMount() {
		this.setState( {
			loading: true,
			initialLoading: true,
		} );
		this.retrieveSelectedPosts()
			.then( () => {
				this.setState( {
					initialLoading: false,
					loading: false,
				} );
			} );
	}

	/**
	* 生成基于请求参数传递的参数，调用 WP REST API 获取相关文章。
	* @param {object} args 所需参数，可以为空
	* @returns {promise} Promise
	*/
	getPosts( args = {} ) {
		const defaultArgs = {
			per_page: 10,
			type: this.state.type,
			search: this.state.filter,
			page: this.state.currentPage || 1,
		};

		const requestArguments = {
			...defaultArgs,
			...args,
		};

		return api.getPosts( requestArguments )
			.then( response => {
				const { data } = response;
				const posts = data.map( post => {
					if ( ! post.featured_media || post.featured_media < 1 ) {
						return {
							...post,
							featured_image: false,
						};
					}

					return {
						...post,
						featured_image: post._embedded[ 'wp:featuredmedia' ][ 0 ].source_url || false,
					};
				} );

				return {
					...response,
					data: posts,
				};
			} )
			.then( response => {
				if ( requestArguments.search ) {
					this.setState( {
						filterPosts: requestArguments.page > 1 ? uniqueById( [ ...this.state.filterPosts, ...response.data ] ) : response.data,
						currentPage: requestArguments.page,
						totalPages: response.headers[ 'X-WP-TotalPages' ],
					} );
					return response;
				}

				this.setState( {
					posts: uniqueById( [ ...this.state.posts, ...response.data ] ),
				} );
			} );
	}

	/**
	 * 从状态对象中的 posts 中按ID获取所选文章，并按它们在所选数组中的位置对其进行排序
	 * @returns {array} 文章数组
	 */
	getSelectedPosts() {
		const { selectedPosts } = this.props;
		return this.state.posts
			.filter( ( { id } ) => selectedPosts.indexOf( id ) !== -1 )
			.sort( ( a, b ) => {
				const aIndex = this.props.selectedPosts.indexOf( a.id );
				const bIndex = this.props.selectedPosts.indexOf( b.id );

				if ( aIndex > bIndex ) {
					return 1;
				}

				if ( aIndex < bIndex ) {
					return -1;
				}

				return 0;
			} );
	}

	/**
	 * 检索已选择的文章
	 * @returns {promise} Promise
	 */
	retrieveSelectedPosts() {
		const selected = this.props.selectedPosts;

		const { type } = this.state;
		if ( ! selected.length > 0 ) {
			// return a fake promise that auto resolves.
			return new Promise( ( resolve ) => resolve() );
		}

		return this.getPosts( {
			include: this.props.selectedPosts.join( ',' ),
			per_page: 100,
			type,
		} );
	}

	/**
	 * 添加文章 ID 到 SelectedPosts 列表。
	 * @param {integer} postID 文章 ID
	 */
	addPost( postID ) {
		if ( this.state.filter ) {
			const post = this.state.filterPosts.filter( p => p.id === postID );
			const posts = uniqueById( [
				...this.state.posts,
				...post,
			] );

			this.setState( {
				filterPosts: this.state.filterPosts.filter( function( p ) {
					return postID !== p.id;
				} ),
			} );

			this.setState( {
				posts,
			} );
		}

		this.props.updateSelectedPosts( [
			...this.props.selectedPosts,
			postID,
		] );
	}

	/**
	 * 移除文章 ID 到 SelectedPosts 列表。
	 * @param {integer} postID 文章 ID
	 */
	removePost( postID ) {
		this.props.updateSelectedPosts( [
			...this.props.selectedPosts,
		].filter( id => id !== postID ) );
	}

	/**
	 * 处理搜索框输入值
 	 * @param {string} - 来自目标事件的对象
	 */
	handleInputFilterChange( { target: { value: filter = '' } = {} } = {} ) {
		this.setState( {
			filter,
		} );
	}

	/**
	 * 调用 API 搜索查询
	 */
	doPostFilter() {
		const { filter = '' } = this.state;

		if ( ! filter ) {
			this.setState( {
				filterPosts: [],
			} );
			return;
		}

		this.setState( {
			filtering: true,
			filterLoading: true,
		} );

		this.getPosts( { page: 1 } )
			.then( () => {
				this.setState( {
					filtering: false,
					filterLoading: false,
				} );
			} );
	}

	/**
	 * 调用 API 分页搜索查询
	 */
	doPagination() {
		this.setState( {
			paging: true,
		} );

		const page = this.state.currentPage + 1;

		this.getPosts( { page } )
			.then( () => this.setState( {
				paging: false,
			} ) );
	}

	/**
	 * 渲染
	 * @returns {*} HTML 或 组件
	 */
	render() {
		const postList = ! this.state.filterLoading ? this.state.filterPosts : [];
		const show = this.props.show; // 块当前是否是处于编辑的活动焦点
		const addIcon = '+';
		const removeIcon = '-';
		const canPaginate = ( this.state.currentPage < ( this.state.totalPages || 1 ) ) && this.state.currentPage !== 0 && ! this.state.filterLoading;
		return (
			<div className="inline-post-edit">
				<InlinePosts
					posts={ this.getSelectedPosts() }
					loading={ this.state.initialLoading }
					action={ this.removePost }
					icon={ removeIcon }
				/>
				<div className="post-selector" style={ show === false ? { display: 'none' } : {} }>
					<div className="post-selector-header">
						<div className="searchbox">
							<input
								id="searchinput"
								type="search"
								placeholder={ __( '搜索文章' ) }
								value={ this.state.filter }
								onChange={ this.handleInputFilterChange }
							/>
							<button onClick={ this.doPostFilter } disabled={ this.state.filterLoading }>{ this.state.filterLoading ? __( '搜索中....' ) : __( '搜索' ) }</button>
						</div>
					</div>
					<div className="post-selector-container">
						<InlinePosts
							posts={ postList }
							filtered={ true }
							action={ this.addPost }
							icon={ addIcon }
						/>
					</div>
					{ canPaginate && postList.length > 0 ? ( <button className={ [ 'components-button is-button is-primary', this.state.paging ? 'is-busy' : '' ].join( ' ' ) } onClick={ this.doPagination } disabled={ this.state.paging }>{ this.state.paging ? 'Loading...' : 'Load More' }</button> ) : null }
				</div>
			</div>
		);
	}
}
