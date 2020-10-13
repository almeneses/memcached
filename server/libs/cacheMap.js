'use strict';

const Record = require('./record');

const MAP_MAX_ALLOWED_ITEMS = 2 ** 24;
/**
 * A Map sorted by the Least Recently Used items.
 *
 * @class CacheMap
 * @extends {Map}
 */
class LRUSortedMap extends Map {

  constructor(){
    super();
  }

  /**
   * Gets the value stored with the given key.
   *
   * @param {*} key The item's key.
   * @returns The key's value if exists, undefined if not.
   * @memberof CacheMap
   */
  get(key){

    const record = super.get(key);
    
    if( record ){

      super.delete(key);
      super.set(key, record);

      return record;
    }

    return undefined;

  }

  /**
   * Stores a value with the given key.
   *
   * @param {*} key The value's key.
   * @param {Record} value The value to store.
   * @memberof CacheMap
   */
  set(key, value){
    
    if( this.isFull() ){
      super.delete(this.keys().next().value);
    }

    super.set(key, value);
    
  }

  isFull(){
    return this.size == MAP_MAX_ALLOWED_ITEMS;
  }
}

module.exports = LRUSortedMap;