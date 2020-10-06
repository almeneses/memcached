'use strict';

const Record = require('./record');

/**
 * In-memory cache.
 *
 * @param {number} memSize Cache size in MegaBytes.
 * @param {number} dataMaxSize Maximum size of data blocks, in MegaBytes.
 * @class CacheMemory Creates a cache memory object.
 */

 /*
  * Note: Creo que esta clase en realidad debería extender Map e implementar los checks ahi
  * facilitaría también el control del tamaño y LRU de la memoria, ¿o quizá otra clase tipo service?
  */
class CacheMemory {

  constructor(memSize = 0, dataMaxSize = 1) {
    this.records = new Map();
    this.memSize = memSize * 1024 * 1024;
    this.memUsed = 0;
    this.dataMaxSize = dataMaxSize * 1024 * 1024;
  }

  /**
   * Gets the value from the cache.
   *
   * @param {string} key the record's key.
   * @returns {Record} The value corresponding to the key, undefined if not in the cache.
   * @memberof CacheMemory
   */
  get(key) {

    const record = this.records.get(key);
    
    if (record){

      if( record.isExpired() ){
        this.records.delete(key);
        return undefined;
      }

      this.records.delete(key);
      this.records.set(key, record);
    }

    return record;
    
  }

  /**
   * Gets the value from the cache including its cas_unique value.
   *
   * @param {string} key The record's key.
   * @returns {Array} The array with all the values including casUnique, undefined if key is 
   * not in the cache.
   * @memberof CacheMemory
   */
  gets(key) {

    const record = this.records.get(key);
    
    if (record){
      if(record.isExpired()){
        this.records.delete(key);

        return undefined;
      }

      this.records.delete(key);
      this.records.set(key, record);
    }

    return record;

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
    
    let record = this.records.get(key);

    if( record ){

      this.records.delete(key);
      record.update(flags, expTime, value);
    
    } else {
    
      record = new Record(flags, expTime, value);
    
    }

    this.records.set(key, record);
  
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

    if (this.records.has(key)) 
      return false;

    this.records.set(key, new Record(flags, expTime, value));

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

    let record = this.records.get(key);

    if( record ){
      record.update(flags, expTime, value);
      this.records.delete(key);
      this.records.set(key, record);

      return true;
    }

    return false;
  }


  /**
   * Appends the given value to an existing value in the cache with the given key.
   *
   * @param {string} key The record's key.
   * @param {string} appendValue The value to append.
   * @returns true if there was existing data to append to, false otherwise.
   * @memberof CacheMemory
   */
  append(key, appendValue){

    let record = this.records.get(key);

    if( record ){
      //This it to prevent falsy values to be appended and do unnecessary work
      if( appendValue ){
        record.update(null, null, Buffer.concat([record.value, appendValue]));
        this.records.delete(key);
        this.records.set(key, value);
      }

      return true;
    }

    return false;

  }

  /**
   * Prepends the given value to an existing value in the cache with the given key.
   *
   * @param {string} key The record's key
   * @param {string} prependValue The value to prepend.
   * @returns true if there was existing data to prepend to, false otherwise.
   * @memberof CacheMemory
   */
  prepend(key, prependValue){

    let record = this.records.get(key);

    if( record ){
      //This it to prevent falsy values to be prepended and do unnecessary work
      if( prependValue ){
        record.update(null, null, Buffer.concat([prependValue, record.value]));
        this.records.delete(key);
        this.records.set(key, value);
      }

      return true;
    }

    return false;
  }

  
  
  /**
   * Stores the given data but only if no other store operation has been
   * issued since the last time it was fetched.
   *
   * @param {string} key The record's key.
   * @param {*} flags The record's flags.
   * @param {*} expTime The time in which the record will be valid, in seconds.
   * @param {*} value The value to store.
   * @param {*} casUnique Unique 64-bit value, usually from a gets operation.
   * @returns {{stored: true}}  If the value was stored.
   * @returns {{exitsts: true}}  If the value has been altered by a previous store operation.
   * @returns {{notFound: boolean}} If the key does not exists within the cache.
   * @memberof CacheMemory
   */
  cas(key, flags, expTime, value, casUnique){

    let result = {};
    let record = this.records.get(key);
    
    if( record ){

      if( casUnique == record.casUnique ){

        record.update(flags, expTime, value);
        this.records.delete(key);
        this.records.set(key, record);
        result.stored = true;
      
      } else {
        result.exists = true;
      }

    } else {

      result.notFound = true;
    
    }

    return result;

  }

  /**
   * Checks the entire cache memory for expired keys and deletes them.
   *
   * @param {number} [interval = -1] Time between checks for expired keys, in miliseconds.
   * if interval is negative it won't do any purging.
   * @memberof CacheMemory
   */
  async purgeExpired(interval = -1){
    
    if( interval >= 0 ){
      setInterval(() => {
        
        for( let [key, record] of this.records){

          if( record.isExpired() )
            this.records.delete(key);
            this.memUsed -= record.getSize();
        }

      }, interval);
    }
  }

  /**
   * Clears the entire cache memeory.
   *
   * @memberof CacheMemory
   */
  clear(){
    this.records.clear();
    this.memUsed = 0;
  }

  
  /**
   * Gets the key of the Least Recently Used item in the cache.
   *
   * @returns The key of the least recently used item.
   * @memberof CacheMemory
   */
  makeSpaceIfFull(bytes){

    while( (this.memUsed + bytes) >= this.memSize ){
      this.deleteLRU();
    }

  }
  
  deleteLRU(){
    const [key, record] = this.records.entries().next().value; 
    this.records.delete(key);
    this.memUsed -= record.getSize();
  }
  
  updateCacheData({record: record}){
    this.memUsed += sizeOf(record);
  }



}

module.exports = CacheMemory;
