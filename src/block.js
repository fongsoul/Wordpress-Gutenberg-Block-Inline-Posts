import './styles/render.scss';
import './styles/editor.scss';

import { PostSelector } from './components/PostSelector';

const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const { Component, createElement } = wp.element;

const icon = createElement( 'svg', { width: 20, height: 20 },
	createElement( 'path', {
		d: 'M1.5,0.3h16.9c0.4,0,0.7,0.3,0.7,0.7v18c0,0.4-0.3,0.7-0.7,0.7H1.5c-0.4,0-0.7-0.3-0.7-0.7V1 C0.8,0.6,1.1,0.3,1.5,0.3z',
		fill: '#fff',
	} ),
	createElement( 'path', {
		d: 'M18.7,20H1.3c-0.4,0-0.8-0.3-0.8-0.8V0.8C0.5,0.3,0.9,0,1.3,0h17.4c0.4,0,0.8,0.3,0.8,0.8v18.5 C19.5,19.7,19.1,20,18.7,20z M2.8,18.5h14.5c0.4,0,0.8-0.3,0.8-0.8V2.2c0-0.4-0.3-0.8-0.8-0.8H2.8C2.3,1.5,2,1.8,2,2.2v15.6 C2,18.2,2.3,18.5,2.8,18.5z',
		fill: '#333',
	} ),
	createElement( 'path', {
		d: 'M5.7,3.4h8.8c0.8,0,1.4,0.6,1.4,1.4v3.5c0,0.8-0.6,1.4-1.4,1.4H5.7c-0.8,0-1.4-0.6-1.4-1.4V4.9 C4.3,4.1,4.9,3.4,5.7,3.4z',
		fill: '#F4CE26',
	} ),
	createElement( 'path', {
		d: 'M14.5,9.8H5.7c-0.8,0-1.4-0.6-1.4-1.4V4.9c0-0.8,0.6-1.4,1.4-1.4h8.8c0.8,0,1.4,0.6,1.4,1.4v3.6 C15.9,9.2,15.3,9.8,14.5,9.8z M5.7,4.9v3.6h8.8V4.9H5.7z M5,14.7h10.2c0.4,0,0.7,0.3,0.7,0.7c0,0.4-0.3,0.7-0.7,0.7H5 c-0.4,0-0.7-0.3-0.7-0.7C4.3,15,4.6,14.7,5,14.7z M7.8,11.6h4.4c0.4,0,0.7,0.3,0.7,0.7S12.6,13,12.2,13H7.8c-0.4,0-0.7-0.3-0.7-0.7 C7.1,11.9,7.4,11.6,7.8,11.6z',
		fill: '#333',
	} )
);
/**
 * 注册古腾堡“内链帖子”块
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string} name     块名
 * @param  {object} settings 块设置
 */
registerBlockType( 'mousin/inline-posts', {
	title: __( '内链帖子' ),
	icon: icon,
	category: 'common',
	keywords: [
		__( '内链帖子' ),
		__( '帖子引用' ),
	],
	supports: {
		html: false,
	},
	attributes: {
		selectedPosts: {
			type: 'array',
			default: [],
		},
		className: {
			type: 'string',
			default: '',
		},
	},
	/**
	 * 当块在编辑器中将会呈现什么
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: class extends Component {
		constructor( props ) {
			super( ...arguments );
			this.props = props;
			this.updateSelectedPosts = this.updateSelectedPosts.bind( this );
		}

		updateSelectedPosts( selectedPosts ) {
			this.props.setAttributes( { selectedPosts } );
		}

		render() {
			const { className, isSelected } = this.props;
			return (
				<div className={ className }>
					<PostSelector
						selectedPosts={ this.props.attributes.selectedPosts }
						show={ isSelected }
						updateSelectedPosts={ this.updateSelectedPosts }
					/>
				</div>
			);
		}
	},
	save: () => {
		return null;
	},
} );
