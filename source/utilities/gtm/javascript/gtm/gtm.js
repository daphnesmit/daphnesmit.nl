import Events from '@utilities/events';

class GTM {
  constructor() {
    this._bindEvents();
  }

  _bindEvents() {
    Events.$on('gtm::push', (event, data) => this.push(data));
  }

  push(data) {
    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push(data);
  }
}

export default new GTM();
