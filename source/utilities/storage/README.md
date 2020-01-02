# Storage utility

## Table of contents
1. [What does it do](#markdown-header-what-does-it-do)
2. [Install](#markdown-header-install)
3. [How to use](#markdown-header-how-to-use)
4. [Dependencies](#markdown-header-dependencies)
5. [Developers](#markdown-header-developers)


## What does it do
* Storage handling with localStorage / sessionStorage with cookie fallback.
* localStorage / sessionStorage supported check.

## Install
Import module
```javascript
// Import all exports
import * as Storage from '@utilities/storage';

// Import specific module
import { LocalStorage } from '@utilities/storage';
import { SessionStorage } from '@utilities/storage';
import { localStorageIsSupported } from '@utilities/storage';
import { sessionStorageIsSupported } from '@utilities/storage';
```

## How to use

### Detection
```javascript
// Detect localStorage
import { localStorageIsSupported } from '@utilities/storage';

// Detect sessionStorage
import { sessionStorageIsSupported } from '@utilities/storage';
```

### Storage types
You can use either localStorage or sessionStorage
```javascript
// Use localStorage
import { LocalStorage } from '@utilities/storage';

// Use sessionStorage
import { SessionStorage } from '@utilities/storage';

// Use both
import { LocalStorage, SessionStorage } from '@utilities/storage';
```

### Set prefix
It can be handy to prefix your storage objects for easier backtracing later on. This is completely optional.
```javascript
LocalStorage.setPrefix('projectX');
```

### Set data
You can set any kind of data
```javascript
LocalStorage.set('data', { foo : "bar" });
```

### Get data
```javascript
LocalStorage.get('data');
```

## Dependencies
This package doest not have any dependencies.

## Developers
* [Adrian Klingen](mailto:adrian.klingen@deptagency.com)
