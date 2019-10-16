/**
 * External dependencies
 */
import { translate } from 'i18n-calypso';
import { startsWith } from 'lodash';

/**
 * Internal dependencies
 */
import getRawSite from 'state/selectors/get-raw-site';
import getSiteSlug from './get-site-slug';

/**
 * Returns true if the site has unchanged site title
 *
 * @param {Object} state Global state tree
 * @param {Object} siteId Site ID
 * @return {Boolean} True if site title is default, false otherwise.
 */
export default function hasDefaultSiteTitle( state, siteId ) {
	const site = getRawSite( state, siteId );
	if ( ! site ) {
		return null;
	}
	const slug = getSiteSlug( state, siteId );
	// we are using startsWith here, as getSiteSlug returns "slug.wordpress.com"
	return site.name === translate( 'Site Title' ) || startsWith( slug, site.name );
}
