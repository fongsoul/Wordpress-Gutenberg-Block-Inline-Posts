const { __ } = wp.i18n;
/**
 * Inline Post 组件
 *
 * @param {function} clickHandler - 这是处理功能的添加/删除功能
 * @param {string} icon 添加/删除图标
 * @param {object} post 文章对象
 * @returns {*} Post HTML.
 */
const InlinePost = ( {
	clickHandler,
	icon,
	post,
} ) => (

	<div className="wp-block-inline-post">
		<div className="block-inline-post">
			{ post.featured_image && <div className="block-inline-post-media" style={ { backgroundImage: `url(${ post.featured_image })` } }></div> }
			<div className="block-inline-post-wrapper">
				<div className="block-inlie-post-title">
					{ post.title.rendered }
				</div>
				<div className="block-inline-post-excerpt">
					{ post.excerpt.rendered }
				</div>
				<div className="block-inline-post-read-more">
					{ __( '阅读更多' ) }
				</div>
			</div>
		</div>
		<button className="icon-button" onClick={ () => clickHandler( post.id ) }>{ icon }</button>
	</div>

);

export default InlinePost;
