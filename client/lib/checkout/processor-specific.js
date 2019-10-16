/**
 * External dependencies
 *
 */
import { translate } from 'i18n-calypso';
import { isUndefined, isEmpty, pick } from 'lodash';
import { CPF, CNPJ } from 'cpf_cnpj';

/**
 * Internal dependencies
 */
import { PAYMENT_PROCESSOR_COUNTRIES_FIELDS } from 'lib/checkout/constants';
import { isPaymentMethodEnabled } from 'lib/cart-values';
import CartStore from 'lib/cart/store';

/**
 * Returns whether we should Ebanx credit card processing for a particular country
 * @param {String} countryCode - a two-letter country code, e.g., 'DE', 'BR'
 * @returns {Boolean} Whether the country code requires ebanx payment processing
 */
export function isEbanxCreditCardProcessingEnabledForCountry( countryCode = '' ) {
	return (
		! isUndefined( PAYMENT_PROCESSOR_COUNTRIES_FIELDS[ countryCode ] ) &&
		isPaymentMethodEnabled( CartStore.get(), 'ebanx' )
	);
}

/**
 * Returns whether
 * @param {String} countryCode - a two-letter country code, e.g., 'DE', 'BR'
 * @returns {Boolean} Whether the country requires additional fields
 */
export function shouldRenderAdditionalCountryFields( countryCode = '' ) {
	return (
		isEbanxCreditCardProcessingEnabledForCountry( countryCode ) &&
		! isEmpty( PAYMENT_PROCESSOR_COUNTRIES_FIELDS[ countryCode ].fields )
	);
}

/**
 * CPF number (Cadastrado de Pessoas Físicas) is the Brazilian tax identification number.
 * Total of 11 digits: 9 numbers followed by 2 verification numbers . E.g., 188.247.019-22
 *
 * @param {String} cpf - a Brazilian tax identification number
 * @returns {Boolean} Whether the cpf is valid or not
 */
export function isValidCPF( cpf = '' ) {
	return CPF.isValid( cpf );
}

/**
 * CNPJ number (Cadastro Nacional da Pessoa Jurídica ) is the Brazilian tax identification number for companies.
 * Total of 14 digits: 8 digits identify the company, a slash, 4 digit to identify the branch, followed by 2 verification numbers . E.g., 67.762.675/0001-49
 *
 * @param {String} cnpj - a Brazilian company tax identification number
 * @returns {Boolean} Whether the cnpj is valid or not
 */
export function isValidCNPJ( cnpj = '' ) {
	return CNPJ.isValid( cnpj );
}

export function fullAddressFieldsRules() {
	return {
		'street-number': {
			description: translate( 'Street Number' ),
			rules: [ 'required', 'validStreetNumber' ],
		},

		'address-1': {
			description: translate( 'Address' ),
			rules: [ 'required' ],
		},

		state: {
			description: translate( 'State' ),
			rules: [ 'required' ],
		},

		city: {
			description: translate( 'City' ),
			rules: [ 'required' ],
		},

		'postal-code': {
			description: translate( 'Postal Code' ),
			rules: [ 'required' ],
		},
	};
}

/**
 * Returns country/processor specific validation rule sets for defined fields.
 *
 * @param {string} country two-letter country code to determine the required fields
 * @returns {object} the ruleset
 */
export function countrySpecificFieldRules( country ) {
	const countryFields = PAYMENT_PROCESSOR_COUNTRIES_FIELDS[ country ].fields || [];

	return pick(
		Object.assign(
			{
				document: {
					description: translate( 'Taxpayer Identification Number' ),
					rules: [ 'validBrazilTaxId' ],
				},

				'phone-number': {
					description: translate( 'Phone Number' ),
					rules: [ 'required' ],
				},
				name: {
					description: translate( 'Your Name' ),
					rules: [ 'required' ],
				},
				pan: {
					description: translate( 'PAN - Permanent account number' ),
					rules: [ 'validIndiaPan' ],
				},
				'postal-code': {
					description: translate( 'Postal Code' ),
					rules: [ 'required' ],
				},
			},
			fullAddressFieldsRules()
		),
		countryFields
	);
}

export function translatedEbanxError( error ) {
	let errorMessage = translate(
		'Your payment was not processed this time due to an error, please try to submit it again.'
	);

	switch ( error.status_code ) {
		case 'BP-DR-55':
			errorMessage = { message: { cvv: translate( 'Invalid credit card CVV number' ) } };
			break;
		case 'BP-DR-51':
		case 'BP-DR-95':
			errorMessage = { message: { name: translate( 'Please enter your name.' ) } };
			break;
	}

	return errorMessage;
}
