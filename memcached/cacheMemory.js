'use strict';

/**
 * In-memory cache.
 *
 *@param {number} memSize Cache size in MB.
 * @class CacheMemory Creates a cache memory object.
 */
class CacheMemory {

  constructor(memSize = 0) {
    this.records = new Map();
    this.memSize = memSize;
  }

  /**
   * Gets the value from the cache.
   *
   * @param {string} key the record's key.
   * @returns The value corresponding to the key, null if not in the cache.
   * @memberof CacheMemory
   */
  get(key) {
    if (!this.records.has(key)) return null;

    return this.records.get(key);
  }

  /**
   * Gets the value from the cache including its cas_unique value.
   *
   * @param {string} key the record's key.
   * @memberof CacheMemory
   */
  gets(key) {

    //Still in development

  }

   /**
   * Stores the given value to the given key, replaces it if
   * a key -> value already exists.
   * 
   * @param {string} key The record's key.
   * @param {number} flags The record's flags.
   * @param {number} expTime The time in which the record will be valid, in seconds.
   * @param {string} value the value to store.
   * @memberof CacheMemory
   */
  set(key, flags, expTime, value) {
    this.records.set(key, [flags, expTime, value]);
  }

  /**
   * Stores the given data, but only if the cache does not already
   * hold data for the given key.
   *
   * @param {String} key The record's key.
   * @param {number} flags The record's flags.
   * @param {number} expTime The time in which the record will be valid, in seconds.
   * @param {string} value The value to store.
   * @returns true if a previous value with the given key
   * does not exist, false otherwise.
   * @memberof CacheMemory
   */
  add(key, flags, expTime, value) {

    if (this.records.has(key)) {
      return false;
    }

    this.records.set(key, [flags, expTime, value]);
    return true;
  }
  
  /**
   * Stores the given data, but only if the cache does
   * already hold data for the given key.
   *
   * @param {string} key The record's key.
   * @param {number} flags The record's flags.
   * @param {number} expTime The time in which the record will be valid, in seconds.
   * @param {string} value the value to store.
   * @memberof CacheMemory
   */
  replace(key, flags, expTime, value){
    
    if( this.records.has(key) ){
      this.records.set(key, [flags, expTime, value]);
      return true;
    }

    return false;
  }


  /**
   * Appends the given value to an existing value in the cache with the given key.
   *
   * @param {string} key The record's key.
   * @param {string} appendValue The value to append.
   * @returns true if there was existing data to append to.
   * @memberof CacheMemory
   */
  append(key, appendValue){

    if( this.records.has(key) ){
      let newValue = this.records.get(key);
      newValue[2] += appendValue;
      this.records.set(key, newValue);

      return true;
    }

    return false;

  }

  /**
   * Prepends the given value to an existing value in the cache with the given key.
   *
   * @param {string} key The record's key
   * @param {string} value The value to prepend.
   * @returns true if there was existing data to prepend to.
   * @memberof CacheMemory
   */
  prepend(key, value){

    if( this.records.has(key) ){
      let newValue = this.records.get(key);
      newValue[2] = appendValue + newValue[2];
      this.records.set(key, newValue);

      return true;
    }

    return false;
  }

  
  /**
   * Stores the given data but only if no other cas operation has been
   * issued since the last time it was fetched.
   *
   * @param {string} key The record's key.
   * @param {*} flags The record's flags.
   * @param {*} expTime The time in which the record will be valid, in seconds.
   * @param {*}  The value to store.
   * @param {*} casUnique Unique 64-bit value, usually from a gets operation.
   * @returns true if
   * @memberof CacheMemory
   */
  cas(key, flags, expTime, value, casUnique){

    let storedValue = get(key);
    const storedCas = storedValue[3];

    if( casUnique == storedCas ){
      this.records.set(key, [flags, expTime, value, casUnique]);
    
      return true;

    } else {

      return false;
    }
  }
}

module.exports = CacheMemory;
