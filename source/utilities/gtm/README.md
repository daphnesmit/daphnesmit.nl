
# GTM utility

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* Keep your code clean by having a generic gtm utility to push `dataLayer` events to.

## Install
Import module
```javascript
import '@utilities/gtm';
```

## How to use
### Trigger push state or replace state from anywhere in your site.
```javascript
Events.$trigger('gtm::push', {
    data: { 
        'ecommerce': {
            'currencyCode': 'EUR',
            'impressions': []
        }
    }
});
```
> See the [Feyenoord GTM utility](https://bitbucket.org/tamtam-nl/feyenoord-webshop/src/develop/frontend/source/javascript/src/modules/util/gtm/?at=develop) for more usecases.

## Dependencies
* [Events utility](/utilities/events/)

## Developers
* [Adrian Klingen](mailto:adrian.klingen@deptagency.com)
