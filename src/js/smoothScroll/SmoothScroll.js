import animation from './animateScroll';
import validateParams, { isWindow } from './validateParams';
import {
  DEFAULT_ANIMATION,
  DEFAULT_DURATION,
  FRAME,
  IS_CHANGE_LOCATION_HASH,
  DURATION_WITH_PREFER_REDUCED_MOTION,
  SCROLL_DIRECTIONS,
  HEADER_OFFSET,
  EASING
} from './config';

const DEFAULT_DIRECTION = SCROLL_DIRECTIONS[0];

class SmoothScroll {
  constructor({
    links,
    customEasing = EASING,
    headerOffset = HEADER_OFFSET,
    scrollDirection = DEFAULT_DIRECTION,
    isChangeLocationHash = IS_CHANGE_LOCATION_HASH,
    scrollContainer = window,
    duration = DEFAULT_DURATION,
    animationName = DEFAULT_ANIMATION }) {

    validateParams({
      scrollContainer,
      duration,
      animationName,
      links,
      scrollDirection,
      headerOffset,
      customEasing
    });

    duration = ( iSReducedMotion() ) ? DURATION_WITH_PREFER_REDUCED_MOTION : duration;
    this.scrollOffset = setScrollOffset( scrollContainer, scrollDirection );

    this.headerOffset = headerOffset;
    this.links = links;
    this.scrollDirection = scrollDirection;
    this.isChangeLocationHash = isChangeLocationHash;
    this.scrollContainer = scrollContainer;
    this.scrollPoints = []
    this.scrollTo = scrollTo.getScrollFn( scrollContainer, scrollDirection );
    this.requestID;

    this._animation = animation({
      easing: customEasing,
      steps: duration / FRAME,
      animationName
    });

    this.clickHandler = this.clickHandler.bind( this );
    this.scrollToBookmark = this.scrollToBookmark.bind( this );
    this.hotkeyChangedHistory = this.hotkeyChangedHistory.bind( this );

    this.links.forEach( link => link.addEventListener('click', this.clickHandler));
    window.addEventListener('popstate', this.hotkeyChangedHistory );

    history.replaceState({ anchor: null }, document.title );
  }

  setHistory( state, title ) {

    if( this.isChangeLocationHash ) {
      history.pushState( state, title, state.anchor );
    }
  }

  getScrollPoints( anchor ) {

    if( this.requestID ) cancelAnimationFrame( this.requestID );

    const startScroll = this.scrollContainer[this.scrollOffset];
    let endScroll = 0;

    if( anchor ) {

      if( anchor !== '#' ) anchor = anchor.replace( '#', '' );

      const bookmark = document.getElementById( anchor );
      endScroll = ( this.scrollDirection === DEFAULT_DIRECTION ) ?
         bookmark.offsetTop - this.headerOffset : bookmark.offsetLeft - this.headerOffset;
    }

    const height = ( startScroll < endScroll ) ?
      endScroll - startScroll : startScroll - endScroll;
    const isIncrease = ( startScroll < endScroll ) ? true : false;

    this.scrollPoints = this._animation( height, startScroll, isIncrease );
    this.scrollToBookmark();
  }

  clickHandler( event ) {
    event.preventDefault();

    const href = event.target.getAttribute('href');
    this.setHistory({ anchor: href }, document.title );
    this.getScrollPoints( href );
  }

  scrollToBookmark() {

    if( this.scrollPoints.length ) {
      this.scrollTo( this.scrollContainer, this.scrollPoints.shift() );
      this.requestID = requestAnimationFrame( this.scrollToBookmark );
    }
  }

  hotkeyChangedHistory( event ) {
    const { state } = event;
    if( state ) {
      event.preventDefault();
      this.getScrollPoints( state.anchor );
    }
  }

  destroy() {
    this.links.forEach( link => link.removeEventListener('click', this.clickHandler));
    window.removeEventListener('popstate', this.hotkeyChangedHistory );
    if( this.requestID ) cancelAnimationFrame( this.requestID );
    this._animation = null;
    this.links = null;
    this.scrollContainer = null;
  }
};

const iSReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const setScrollOffset = ( container, direction ) => {
  if( direction === DEFAULT_DIRECTION ) {
    return ( isWindow( container ) ) ? 'pageYOffset' : 'scrollTop';
  } else{
    return ( isWindow( container ) ) ? 'pageXOffset' : 'scrollLeft';
  }
};

const scrollTo = (() => {
  const scrollFn = {
    vertical: ( element, point ) => element.scroll( 0, point ),
    horizontal: ( element, point ) => element.scroll( point, 0 ),
    verticalWithoutFn: ( element, point ) => element.scrollTop = point,
    horizontallWithoutFn: ( element, point ) => element.scrollLeft = point,
  };

  return {
    getScrollFn( element, direction ) {
      if( direction === DEFAULT_DIRECTION ) {
        return ( element.scroll ) ? scrollFn.vertical : scrollFn.verticalWithoutFn;
      } else{
        return ( element.scroll ) ? scrollFn.horizontal : scrollFn.horizontallWithoutFn;
      }
    }
  }

})();

export default SmoothScroll;