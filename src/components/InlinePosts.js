import InlinePost from './InlinePost';
const { __ } = wp.i18n;

/**
 * InlinePosts 组件
 * @param {object} props - 组件属性
 * @returns {*} HTML 或 组件
 */
const InlinePosts = props => {
	const { filtered = false, loading = false, posts = [], action = () => { }, icon = null } = props;

	if ( loading ) {
		return <p className="padding-x-20">{ __( '加载文章中' ) }</p>;
	}

	if ( filtered && ( ! posts || posts.length < 1 ) ) {
		return '';
	}

	if ( ! posts || posts.length < 1 ) {
		return <p className="padding-x-20">{ __( '请选择文章' ) }</p>;
	}

	return (
		<div className="inline-posts">
			{ posts.map( ( post ) => <InlinePost key={ post.id } clickHandler={ action } icon={ icon } post={ post } /> ) }
		</div>
	);
};

export default InlinePosts;
