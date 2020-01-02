import Store from '../store/store';

class Component {
  constructor(props = {}) {
    this.watch = Component.watch || function() {};
    this.watchCollection = Component.watchCollection || function() {};
    this.stateChanged = this.stateChanged || function() {};
    if (props.store instanceof Store) {
      // This fires every time the state updates
      props.store.subscribe((state, prevState) => {
        this.stateChanged(state, prevState);
      });
    }

    if (props.element) {
      this.element = props.element;
    }
  }

  static watchCollection(store, prop, callback) {
    const { state: newState, prevState } = store;
    const previousPropState = idx(prevState, _ => _[prop]);
    const newPropState = idx(newState, _ => _[prop]);
    if (array.isArray(previousPropState)) {
      if (
        previousPropState &&
        previousPropState.length &&
        newPropState.length !== previousPropState.length
      ) {
        // Make sure the callback is a function
        if (typeof callback === 'function') {
          return callback();
        }
      }
    }
    return undefined;
  }

  static watch(store, prop, callback) {
    const { state: newState, prevState } = store;
    const previousPropState = idx(prevState, _ => _[prop]);
    const newPropState = idx(newState, _ => _[prop]);
    if (
      typeof newPropState === 'boolean' ||
      typeof newPropState === 'string' ||
      typeof newPropState === 'number'
    ) {
      if (previousPropState && newPropState !== previousPropState) {
        // Make sure the callback is a function
        if (typeof callback === 'function') {
          return callback();
        }
      }
    }
    return undefined;
  }
}
export default Component;
