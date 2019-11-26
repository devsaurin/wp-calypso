/* eslint-disable import/no-extraneous-dependencies */
/**
 * External dependencies
 */
import { addFilter } from '@wordpress/hooks';
import { __ } from '@wordpress/i18n';

// Change the block name through of the `registerBlockType` hook.
addFilter( 'blocks.registerBlockType', 'a8c/renaming-homepage-posts-blocks', ( settings, name ) =>
	'newspack-blocks/homepage-articles' !== name
		? settings
		: {
				...settings,
				name: 'a8c/homepage-posts',
				title: __( 'Homepage Posts' ),
				category: 'layout',
		  }
);