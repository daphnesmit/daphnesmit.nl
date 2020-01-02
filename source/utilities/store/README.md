# Store utility for state management

## Table of contents

1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)

## What does it do

Build a state management system with vanilla JavaScript.
Inspired by this [css tricks article](https://css-tricks.com/build-a-state-management-system-with-vanilla-javascript/).

## Install

## Add polyfill
This store utility makes use of the [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) Class which is not supported in IE11.
If you want to use the store in IE11 make sure you install the [Polyfill](https://github.com/GoogleChrome/proxy-polyfill)

How to:
- In polyfills ```import './proxy-polyfill'```

## Import the utilities

Import modules in your component/class

```javascript
import Component from '@utilities/store/lib/component';
import store from '@utilities/store';
```

## How to use

### Add a component

Extend the base component for each new component you make that needs to use the store.
Below you will find an example component.
This is a list of items, you can remove an item

```javascript
class MyComponent extends Component {
    // Pass our store instance and the HTML element up to the parent Component
    // The element you already have through moduleInit of MyComponent
    constructor(element) {
        super({
            store,
            element
        });
    }

    // Find all the buttons in the list and when they are clicked, we dispatch a
    // `clearItem` action which we pass the current item's index to
    bindEvents() {
        this.element.querySelectorAll('button').forEach((button, index) => {
            button.addEventListener('click', () => {
                store.dispatch('clearItem', { index });
            });
        });
    }

    updateElement(html) {
        this.element.innerHTML = html;
    }

     /**
     * Render the state changes
     *
     * @params {Object} state - the store state
     * @returns {void}
     */
    render(state) {
        // If there are no items to show, render a little status instead
        if (state.items.length === 0) {
            return this.updateElement(`<p>You've done nothing yet 😢</p>`);
        }

        // Loop the items and generate a list of elements
        return this.updateElement(`
            <ul>
                ${state.items
                    .map(item => `<li>${item} <button aria-label="Delete this item">×</button></li>`);
                    .join('')}
            </ul>
        `);
    }

    /**
     * React to state changes
     *
     * @returns {void}
     */
    stateChanged() {
        const { state, prevState } = store;
        this.renderItems(state);
        this.bindEvents();
    }
}

export default MyComponent;
```

### Adding an action

You can mutate the state by dispatching an action and create a mutation in mutations.js.
Example use case:
You want to add an item to the list from an input in HTML.

-   add an 'addItem' action in actions.js
-   add an 'addItem' mutation in mutations.js
-   On form submit dispatch the action with the value of the input.
-   TADA! you will see the list of items updated in the above component.

```javascript
store.dispatch('addItem', value);
```

## Dependencies

Optional:
[Proxy Polyfill](https://github.com/GoogleChrome/proxy-polyfill)

## Developers

-   [Daphne Smit](mailto:daphne.smit@deptagency.com)
