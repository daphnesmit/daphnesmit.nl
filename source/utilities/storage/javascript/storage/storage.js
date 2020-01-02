import Cookie from 'js-cookie';

class Storage {
  constructor(storageType) {
    this.storagePrefix = '';
    this.storageType = setStorageType(storageType);
    this.supported = storageTypeIsSupported(this.storageType);
  }

  /**
   * Set storage prefix
   * @param {string} prefix
   */
  setPrefix(prefix) {
    this.storagePrefix = `${prefix}.`;
  }

  /**
   * Get storage prefix
   * @returns {string}
   */
  getPrefix() {
    return this.storagePrefix;
  }

  /**
   * Get the prefixed storage key
   * @returns {string}
   */
  getPrefixedStorageKey(key) {
    return `${this.storagePrefix}${key}`;
  }

  /**
   * Set item
   * @param {string} key Identifier of the data
   * @param {string} value The data to be stored
   */
  set(key, value) {
    let convertedValue = value;

    if (typeof convertedValue !== 'undefined' && convertedValue !== null) {
      if (typeof convertedValue === 'object') {
        convertedValue = JSON.stringify(convertedValue);
      }

      if (this.supported) {
        window[this.storageType].setItem(this.getPrefixedStorageKey(key), convertedValue);
      } else {
        Cookie.set(this.getPrefixedStorageKey(key), convertedValue, {
          expires: 30,
        });
      }
    }
  }

  /**
   * Get item
   * @param {string} key Identifier of the data we are requesting
   * @returns {string|Object}
   */
  get(key) {
    let data = null;
    const storageKey = this.getPrefixedStorageKey(key);

    if (this.supported) {
      data = window[this.storageType].getItem(storageKey);
    } else {
      data = Cookie.get(storageKey);
    }

    try {
      data = JSON.parse(data);

      if (data && typeof data === 'object') {
        return data;
      }
    } catch (e) {
      return data;
    }
  }

  /**
   * Remove item
   * @param {string} key Identifier of the data we are removing
   */
  remove(key) {
    const storageKey = this.getPrefixedStorageKey(key);

    if (this.supported) {
      window[this.storageType].removeItem(storageKey);
    } else {
      Cookie.remove(storageKey);
    }
  }
}

/**
 * Set storage type
 * @param {string('localStorage'|'sessionStorage')} storageType
 * @returns {string('localStorage'|'sessionStorage')}
 */
function setStorageType(storageType) {
  if (['localStorage', 'sessionStorage'].indexOf(storageType) !== -1) {
    return storageType;
  } else {
    return 'localStorage';
  }
}

/**
 * Check if given storage type is supported
 * @param {string} storageType
 * @returns {Boolean}
 */
function storageTypeIsSupported(storageType) {
  try {
    window[storageType].x = 1;
    window[storageType].removeItem('x');
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if localStorage is supported
 * @returns {Boolean}
 */
function localStorageIsSupported() {
  return storageTypeIsSupported('localStorage');
}
/**
 * Check if sessionStorage is supported
 * @returns {Boolean}
 */
function sessionStorageIsSupported() {
  return storageTypeIsSupported('sessionStorage');
}

const LocalStorage = new Storage();
const SessionStorage = new Storage('sessionStorage');

export { localStorageIsSupported, sessionStorageIsSupported, LocalStorage, SessionStorage };
