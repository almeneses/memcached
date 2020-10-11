'use strict';

const Record = require('./record');

/**
 * A Map that behaves similarly to a cache memory.
 *
 * @class CacheMap
 * @extends {Map}
 */
class CacheMap extends Map {

  constructor(cacheSize, itemSize){

    super();
    this.cacheSize = cacheSize;
    this.itemSize = itemSize;
    this.amountUsed = 0;

  }

  get(key, value){

    const record = super.get(key);
    
    if( record ){

      super.delete(key);
      super.set(key, value);

      return record;
    }

    return undefined;

  }

  set(key, value){
    
    _clean(value);
    super.set(key, value);
    this.amountUsed += value.getSize();
    
  }


  /**
   * Removes an item by it's key.
   *
   * @param {Object} key
   * @memberof CacheMap
   */
  delete(key){
    
    let value = super.get(key);
    
    if( value ){
      
      super.delete(key);
      this.amountUsed -= value.getSize();

    }

  }

  /**
   * Makes space in the CacheMap for a new Record (if needed) by removing the Least Recently Used items.
   *
   * @param {Record} record The record to make space to
   * @memberof CacheMap
   */
  _clean(record){
    
    const recordSize = record.getSize();

    while( (this.amountUsed + recordSize ) > this.cacheSize ){

      this.delete(this.keys().next().value);

    }
  }

}
