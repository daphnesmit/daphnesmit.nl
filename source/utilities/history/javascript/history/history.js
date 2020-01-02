import Events from '@utilities/events';

class History {
  constructor() {
    prepareHistoryEvents();
    this.bindEvents();
  }

  /**
   * Bind events
   */
  bindEvents() {
    Events.$on('history::push', (e, data) => this.pushHistory(data));
    Events.$on('history::replace', (e, data) => this.replaceHistory(data));
  }

  /**
   * Create a new URL entry in your History
   * @param {Object} data
   * @param {Object} data[].state State object
   * @param {string} data[].url New url
   */
  pushHistory(data) {
    const pushOptions = {
      state: data.state || {},
      url: data.url,
    };

    window.history.pushState(pushOptions.state, document.title, pushOptions.url);
  }

  /**
   * Overwrite current URL entry in your History
   * @param {Object} data
   * @param {Object} data[].state State object
   * @param {string} data[].url New url
   */
  replaceHistory(data) {
    const replaceOptions = {
      state: data.state || {},
      url: data.url,
    };

    window.history.replaceState(replaceOptions.state, document.title, replaceOptions.url);
  }
}

/**
 * Define the events where we are adding a callback to
 */
function prepareHistoryEvents() {
  const events = [
    {
      eventName: 'pushState',
      callbackEventName: 'onpushstate',
    },
    {
      eventName: 'replaceState',
      callbackEventName: 'onreplacestate',
    },
  ];

  events.forEach(obj => addHistoryCallbackEvent(obj));

  // Add callback to all events
  window.onpopstate = history.onreplacestate = history.onpushstate = state =>
    Events.$trigger('history::update', { data: { state } });
}

/**
 * Define the events that will get a callback
 * @param {Object} obj
 * @param {string} obj[].eventName Name of history event
 * @param {string} obj[].callbackEventName Name of callback
 */
function addHistoryCallbackEvent(obj) {
  const historyEvent = history[obj.eventName];

  history[obj.eventName] = function(state) {
    if (typeof history[obj.callbackEventName] == 'function') {
      history[obj.callbackEventName]({ state });
    }

    return historyEvent.apply(history, arguments);
  };
}

export default new History();
