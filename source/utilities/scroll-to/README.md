
# Javascript Scroll To libary

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* Scrolls to any given element id

## Install
```javascript
import '@utilities/scroll-to';
```

## How to use

### Default

When initialising `scroll-to` it will automatically search for all `<a>` tags where the `href` starts with an `#` and find the matching `id` in the DOM.
```html
<a href="#top">
    Go to top
</a>
```

### Custom

#### As an Event

For custom usage you can use the scroll-to event, without the need on an id.

__NOTE: This will not be accessible.__
```javascript
Events.$trigger('scroll-to::scroll', {
    data: {
        target: document.querySelector('footer'),
        scrollElement: false, // Optional, only needed when scrolling inside an element
        offset: false, // Optional, will default to ST_OFFSET
        duration: false // Optional, will default to ST_DURATION
    }
});
```

#### As a Promise

For custom usage you can use the scroll-to class, without the need on an id.

__NOTE: This will not be accessible.__
```javascript
import ScrollTo from '@utilities/scroll-to';

ScrollTo.scrollTo(document.querySelector('footer'))
    .then(() => doStuff)
    .catch(() => doStuff);
```


## Dependencies
* [RAF](https://www.npmjs.com/package/raf)
* [Events library](/utilities/events/)

## Developers
* [Danillo Tuhumury](mailto:danillo.tuhumury@tamtam.nl)
* [Adrian Klingen (co author)](mailto:adrian.klingen@deptagency.com)
