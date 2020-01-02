class Store {
  constructor(params) {
    // Add some default objects to hold our actions, mutations and state
    // Look in the passed params object for actions and mutations
    // that might have been passed in
    this.actions = params.actions || {};
    this.mutations = params.mutations || {};
    this.state = {};
    this.prevState = {};

    // A status enum to set during actions and mutations
    this.status = 'resting';

    // We store callbacks for when the state changes in here
    this.callbacks = [];

    // Set our state to be a Proxy. We are setting the default state by
    // checking the params and defaulting to an empty object if no default
    // state is passed in
    const self = this;
    self.state = new Proxy(params.initialState || {}, {
      set(state, key, value) {
        // Set the value as we would normally
        state[key] = value;

        console.log(`stateChange: ${key}: ${value}`);

        // Fire off our callback processor because if there's listeners,
        // they're going to want to know that something has changed
        self.processCallbacks(self.state, self.prevState);

        if (self.status !== 'mutation') {
          console.warn(`You should use a mutation to set ${key}`);
        }
        // Reset the status ready for the next operation
        self.status = 'resting';

        return true;
      },
    });
  }

  /**
   * A dispatcher for actions that looks in the actions
   * collection and runs the action if it can find it
   *
   * @param {string} actionKey
   * @param {mixed} payload
   * @returns {boolean}
   * @memberof Store
   */
  dispatch(actionKey, payload) {
    // Run a quick check to see if the action actually exists
    // before we try to run it
    if (typeof this.actions[actionKey] !== 'function') {
      console.error(`Action "${actionKey}" doesn't exist.`);
      return false;
    }

    console.groupCollapsed(`ACTION: ${actionKey}`);

    // Let anything that's watching the status know that we're dispatching an action
    this.status = 'action';

    console.groupEnd();

    // Actually call the action and pass it the Store context and whatever payload was passed
    return this.actions[actionKey](this, payload);
  }

  /**
   * Look for a mutation and modify the state object
   * if that mutation exists by calling it
   *
   * @param {string} mutationKey
   * @param {mixed} payload
   * @returns {boolean}
   * @memberof Store
   */
  commit(mutationKey, payload) {
    // Run a quick check to see if this mutation actually exists
    // before trying to run it
    if (typeof this.mutations[mutationKey] !== 'function') {
      console.error(`Mutation "${mutationKey}" doesn't exist`);
      return false;
    }

    // Let anything that's watching the status know that we're mutating state
    this.status = 'mutation';

    this.prevState = Object.assign({}, this.state);

    // Get a new version of the state by running the mutation and storing the result of it
    const newState = this.mutations[mutationKey](this.state, payload);

    // Update the old state with the new state returned from our mutation
    this.state = newState;

    return true;
  }

  /**
   * Fire off each callback that's run whenever the state changes
   * We pass in some data as the one and only parameter.
   * Returns a boolean depending if callbacks were found or not
   *
   * @param {object} state
   * @param {object} prevState
   * @returns {boolean}
   */
  processCallbacks(state, prevState) {
    if (!this.callbacks.length) {
      return false;
    }

    // We've got callbacks, so loop each one and fire it off
    this.callbacks.forEach(callback => callback(state, prevState));

    return true;
  }

  /**
   * Allow an outside entity to subscribe to state changes with a valid callback.
   * Returns boolean based on wether or not the callback was added to the collection
   *
   * @param {function} callback
   * @returns {boolean}
   */
  subscribe(callback) {
    if (typeof callback !== 'function') {
      console.error('You can only subscribe to Store changes with a valid function');
      return false;
    }

    // A valid function, so it belongs in our collection
    this.callbacks.push(callback);

    return true;
  }
}

export default Store;
