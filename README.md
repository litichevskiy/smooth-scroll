## smooth-scroll

This is pure JavaScript library for smooth scrolling to anchors.

### [view demo](https://litichevskiy.github.io/smooth-scroll/)

**Note:** There's a native CSS way to handle smooth scrolling
[scroll-behavior](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior)


[Getting started](#Getting-started) | [Options and settings](#Options-and-settings) | [Description](#Description) | [Easing](#Easing)

## Getting started


Include smooth-scroll on your site, code can be found in the `/dist/js` or [with polyfill](https://github.com/litichevskiy/smooth-scroll/tree/master/dist/js/smooth-scroll-polyfill.min.js) | [without polyfill](https://github.com/litichevskiy/smooth-scroll/tree/master/dist/js/smooth-scroll.min.js), `smooth-scroll.polyfill.min.js` contain `Array.from()` and `array.includes()` polyfills.

If you use this library on mobile devices, you need add in <meta ... `initial-scale=1`,  `minimum-scale=1`  />

**Note:** smooth-scroll does not add and change css, classNemes or attributes, `links` must have `href="#value"` attribute and bookmarks must contain `id="value"` attribute.


```javascript
<script src="path/to/smooth-scroll.min.js"></script>
```
or
```javascript
import SmoothScroll from 'path/to/file';

/*
  without polyfill  >  src/js/smoothScroll
  with polyfill  >  src/js/smoothScroll/index.polyfill
*/
```


### Init

```javascript
const smoothScroll = new SmoothScroll({
  links: [...document.querySelectorAll('.className')]
});
```

### Destroy

```javascript
const smoothScroll = new SmoothScroll({
  /* some parametrs */
});

smoothScroll.destroy();
/* unsubscribe from all handlers and deleted links on elements */
```

## Options and settings

required only `links`

```javascript
const smoothScroll = new SmoothScroll({
  links: [...document.querySelectorAll('.className')],
  headerOffset: (document.querySelector('.className')).offsetHeight, // or Number
  scrollContainer: document.querySelector('.className'),
  animationName: 'animation-name',
  scrollDirection: 'horizontal',
  isChangeLocationHash: false,
  duration: 450,
  customEasing: { 'animation-name': ( t ) => t },
});

```

## Description


|Name|Type|Requred|Default|values|Description|
|:-:|:-:|:-:|:-:|:-:|:-:|
|`links`|Array|+|-|-| Item must be HTMLElement and contain `href="#some-value"` attribute with value |
|`animationName`|String|-|linear|`linear`, `ease-in-out`, `ease-in`, `ease-out`|[See reduce-motion-settings](#Reduce-motion-settings)|
|`scrollDirection`|String|-|vertical|`vertical`, `horizontal`|-|
|`isChangeLocationHash`|Boolean|-|true|Boolean|add to browser history, and change `location.hash`|
|`duration`|Number|-|450|Number|time in ms, min 1 |
|`scrollContainer`|HTMLElement, window|-|window|HTMLElement, window|if `scrollContainer` not `window`, container must have `width` or `heights` depending on `scrollDirection` and correctly `overflow` |
|`customEasing`|Object|-|Object|Object|[See Easing](#Easing)|
|`headerOffset`|Number|-|0|Number|if navigation have 'fixed' or 'sticky' position, you can add `headerOffset: HTMLElement.offsetHeight`|


## Easing

`customEasing` must be Object and contain timing methods, `animationName` must match with easing['method']

[More easing functions](https://easings.net/)

```javascript
const easing = {
  'easeInCubic': ( t ) => t * t * t,
  'easeInCirc': ( t ) Math.sqrt(1 - Math.pow(t, 2)),
};

/*
  t => timeFraction;
  timeFraction will be changes from 0 to 1
 */
```


### Reduce motion settings

**warning:** If user uses [prefers-reduced-motion: reduce](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) `duration` parameter will be ignored, and used default value 1ms.