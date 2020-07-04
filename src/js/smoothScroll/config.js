export const ANIMATIONS_NAME = ['ease-in-out', 'ease-in', 'ease-out', 'linear'];
export const SCROLL_DIRECTIONS = ['vertical', 'horizontal'];
export const DEFAULT_ANIMATION = 'linear';
export const FRAME = 1000 / 60; // frames in second
export const DEFAULT_DURATION = 450 //ms;
export const DURATION_WITH_PREFER_REDUCED_MOTION = 1 // ms;
export const IS_CHANGE_LOCATION_HASH = true // window location hash;
export const HEADER_OFFSET = 0; // px
export const EASING = {
  'linear': ( t ) => t,
  'ease-in': ( t ) => Math.pow( t, 2 ),
  'ease-out': ( t ) => 1 - Math.pow( 1 - t, 2 ),
  'ease-in-out': ( t ) => 0.5 * ( Math.sin( ( t - 0.5 ) * Math.PI ) + 1 ),
};