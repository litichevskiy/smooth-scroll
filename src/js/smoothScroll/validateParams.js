import { SCROLL_DIRECTIONS, EASING } from './config';

const WRONG_TYPE_LINKS = '"links" must be Array';
const WRONG_TYPE_SCROLL_CONTAINER = '"scrollContainer" must be HTML element or "window"';
const WRONG_TYPE_DURATION = '"duration" must be number more than 0 less Infinity';
const WRONG_ANIMATION_NAME = `"animationName" can be one of`;
const WRONG_SCROLL_DIRECTION = `"direction" can be one of: "${SCROLL_DIRECTIONS.join(', ')}"`;
const WRONG_TYPE_LINKS_ITEM = '"links" item must be HTML element';
const LINK_HREF_IS_REQUIRED = 'attribute of link "href" is required and must have value';
const BOOKMARK_NOT_FOUND = 'Can not find bookmark with id';
const CUSTOM_EASING_NOT_CONTAIN_METHOD = 'must be function';
const WRONG_TYPE_HEADER_OFFSET = '"headerOffset" must be Number';

export const isWindow = ( el ) => el instanceof window.constructor;

export default ({
  links,
  scrollContainer,
  duration,
  animationName,
  scrollDirection,
  headerOffset,
  customEasing }) => {

  if( !isArray( links ) ) throw new Error( WRONG_TYPE_LINKS );
  if( isValidScrollContainer( scrollContainer ) ) throw new Error( WRONG_TYPE_SCROLL_CONTAINER );
  if( !isValidDuration( duration ) ) throw new Error( WRONG_TYPE_DURATION );
  if( !isMatchValue( SCROLL_DIRECTIONS, scrollDirection ) ) throw new Error( WRONG_SCROLL_DIRECTION );
  if( !isNumber( headerOffset ) ) throw new Error( WRONG_TYPE_HEADER_OFFSET );

  validateLinksAndBookmarks( links );
  validateCustomEasing( customEasing, animationName );
};

const validateLinksAndBookmarks = ( links ) => {

  links.forEach( link => {
    if( !isHTMLElement( link ) ) throw new Error( WRONG_TYPE_LINKS_ITEM );
  });

  links.forEach( link => {
    const href = link.getAttribute('href');
    if( !href ) throw new Error( LINK_HREF_IS_REQUIRED );
    let hrefValue = href.trim();
    if( hrefValue !== '#' ) hrefValue = hrefValue.replace('#', '');
    if( !hrefValue ) throw new Error( LINK_HREF_IS_REQUIRED );

    const bookmark = document.getElementById( hrefValue );
    if( !bookmark ) throw new Error(`${BOOKMARK_NOT_FOUND} "${href}"`);
  });
};

const isNumber = ( value ) => typeof value === 'number' && isFinite(value);

const isPositiveNumber = ( num ) => num >= 1 && num < Infinity;

const isHTMLElement = ( el ) => el instanceof Element;

const isArray = ( array ) => Array.isArray( array );

const isValidScrollContainer = ( container ) => ( !isWindow( container ) && !isHTMLElement( container ) );

const isValidDuration = ( duration ) => {
  return ( !isPositiveNumber( duration ) || !isNumber( duration ) ) ? false : true;
};

const isMatchValue = ( array, value ) => array.includes( value );

const validateCustomEasing = ( easing, animationName ) => {
  const animationNames = Object.keys( easing );
  if ( !isMatchValue( animationNames, animationName ) )
    throw new Error( `${WRONG_ANIMATION_NAME} "${animationNames.join(', ')}"` );

  if ( easing !== EASING ) {
    const animationFn = easing[animationName];
    if( !( animationFn instanceof Function ) )
      throw new Error( `"${animationName}" ${CUSTOM_EASING_NOT_CONTAIN_METHOD}` );
  }
};