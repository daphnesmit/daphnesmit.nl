import raf from 'raf';
import Events from '@utilities/events';

const ST_HOOK = 'a[href^="#"]';
const ST_DURATION = 500;
const ST_OFFSET = 50;

class ScrollTo {
  constructor() {
    this._bindEvents();
    this._initElements();
  }

  /**
   * Bind event
   */
  _bindEvents() {
    Events.$on('scroll-to::scroll', (event, data) => {
      if (!data) return;

      const { target, duration = ST_DURATION, offset = ST_OFFSET, scrollElement = false } = data;

      if (!target) return;

      const scrollConfig = {
        position: target.getBoundingClientRect(),
        duration,
        offset: parseInt(offset, 10),
        scrollElement,
      };

      scrollTo(scrollConfig);
    });
  }

  _initElements() {
    this.elements = getElements();

    Array.from(this.elements).forEach(element => {
      if (element.scrollToisInitialised) return;

      element.addEventListener('click', event => {
        const target = element.getAttribute('href').split('#');
        const targetEl = target[1] !== '' ? document.querySelector(`#${target[1]}`) : false;
        if (targetEl) {
          event.preventDefault();
          const scrollConfig = {
            position: targetEl.getBoundingClientRect(),
            duration: element.dataset.scrollDuration
              ? parseInt(element.dataset.scrollDuration, 10)
              : ST_DURATION,
            offset: element.dataset.scrollOffset
              ? parseInt(element.dataset.scrollOffset, 10)
              : ST_OFFSET,
            scrollElement: element.dataset.scrollElement,
          };
          scrollTo(scrollConfig);
        }
      });

      element.scrollToisInitialised = true;
    });
  }

  scrollTo(target, duration, offset, scrollElement) {
    const scrollConfig = {
      position: target.getBoundingClientRect(),
      duration: typeof duration !== 'undefined' ? parseInt(duration, 10) : ST_DURATION,
      offset: typeof offset !== 'undefined' ? parseInt(offset, 10) : ST_OFFSET,
      scrollElement: scrollElement,
    };

    return scrollTo(scrollConfig);
  }
}

/**
 * Gets all elements matching the ST_HOOK
 * @returns {NodeList} All matching HTMLElements
 */
function getElements() {
  return document.querySelectorAll(ST_HOOK);
}

/**
 * Scrolls the window to the top
 */
function scrollTo({ position, duration, offset, scrollElement }) {
  return new Promise(resolve => {
    const scrollPosition = scrollElement
      ? scrollElement.scrollTop
      : window.scrollY || window.pageYOffset;
    const to = parseInt((position.top + scrollPosition - offset).toFixed(0), 10);
    const start = scrollElement
      ? scrollElement.scrollTop
      : Math.max(document.body.scrollTop, document.documentElement.scrollTop);
    const change = to - start;
    let currentTime = 0;
    const increment = 10;
    const direction = to > start ? 1 : 0;

    const animate = () => {
      currentTime += increment;
      const val = parseInt(easeInOutQuad(currentTime, start, change, duration).toFixed(0), 10);

      if (scrollElement) {
        scrollElement.scrollTop = val;
      } else {
        document.body.scrollTop = val;
        document.documentElement.scrollTop = val;
      }

      if ((val >= to && direction === 1) || (val <= to && direction === 0)) {
        resolve();
      } else {
        raf(animate);
      }
    };

    animate();
  });
}

function easeInOutQuad(t, b, c, d) {
  t /= d / 2;
  if (t < 1) {
    return (c / 2) * t * t + b;
  }
  t--;
  return (-c / 2) * (t * (t - 2) - 1) + b;
}

export default new ScrollTo();
