/**
 * External dependencies
 */
import { store, getContext } from '@woocommerce/interactivity';

/**
 * Internal dependencies
 */
import { navigate } from '../../utils';

type ActiveFiltersContext = {
	queryId: number;
	params: string[];
};

store( 'woocommerce/collection-active-filters', {
	actions: {
		clearAll: () => {
			const { params } = getContext< ActiveFiltersContext >();
			const url = new URL( window.location.href );
			const { searchParams } = url;

			params.forEach( ( param ) => searchParams.delete( param ) );
			navigate( url.href );
		},
	},
} );