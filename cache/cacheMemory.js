'use strict';

const Constants = require('../globals/constants');
const Memory = require('./memory');
const Record = require('./record');

/*
* Note: 
* Quizá es mejor que CacheMemory sea una especie de Memcached completo
* y retorne los valores como lo haría el server (strings). El interpretador
* de los comandos sería más simple.
*
* Tal vez usar un Object como parámetro para todos los métodos.
*
* Considerar que una clase ExtendedMap que permita superar el límite de 2^24 items
* podría hacer las operaciones O(n) (con un n pequeño, pero n igualmente). 
*/


/**
 * In-memory cache.
 *
 * @param {number} memSize Cache size in MegaBytes.
 * @param {number} recordSize Maximum size of data blocks, in MegaBytes.
 * @class CacheMemory Creates a cache memory object.
 */
class CacheMemory {

  constructor({memSize = 100, recordSize = 1, purgeExpiredKeys = -1}) {
    this.records = new Memory(memSize, recordSize);
    this._purging = 0;
    this.purgeExpired(purgeExpiredKeys);
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
    
    if ( record && record.isExpired() ){

      this.records.delete(key);
      return undefined;

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
    
    let record = this.get(key);
    
    if( record ){ 

      record.update(flags, expTime, value);
    
    } else {
    
      record = new Record(flags, expTime, value);
    
    }

    this.records.set(key, record);
  }

  /**
   * Replaces the given value only if the given key is in the cache.
   *
   * @param {string} key The record's key.
   * @param {number} flags The record's flags.
   * @param {number} expTime The time in which the record will be valid, in seconds.
   * @param {string} value the value to store.
   * @returns true if the value was found and replaced, false if not found.
   * @memberof CacheMemory
   */
  replace(key, flags, expTime, value){

    let record = this.get(key);

    if( record ){

      record.update(flags, expTime, value);
      return true;

    } 

    return false;
  }


  /**
   * Stores the given data, but only if the cache does **not** hold data for the given key.
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
    
    let record = this.get(key);

    if ( record ) {
      return false;

    } else {

      this.records.set(key, new Record(flags, expTime, value, 0n));

      return true;
    }

  }

  /**
   * Appends the given value to an existing value in the cache with the given key.
   *
   * @param {string} key The record's key.
   * @param {Buffer} appendValue The value to append.
   * @returns true if there was existing data to append to, false otherwise.
   * @memberof CacheMemory
   */
  append(key, appendValue){

    let record = this.get(key);

    if( record ){
      
      record.update(null, null, Buffer.concat([record.value, appendValue]));
      this.records.set(key, record);
      
      return true;
    }

    return false;
  }

  /**
   * Prepends the given value to an existing value in the cache with the given key.
   *
   * @param {string} key The record's key
   * @param {Buffer} prependValue The value to prepend.
   * @returns true if there was existing data to prepend to, false otherwise.
   * @memberof CacheMemory
   */
  prepend(key, prependValue){

    let record = this.get(key);

    if( record ){
      
      record.update(null, null, Buffer.concat([prependValue, record.value]));
      this.records.set(key, record);
  
      return true;
    }

    return false;
  }
  
  /**
   * Stores the given data but only if no other store operation has been
   * issued since the last time it was fetched.
   *
   * @param {string} key The record's key.
   * @param {number} flags The record's flags.
   * @param {number} expTime The time in which the record will be valid, in seconds.
   * @param {Buffer} value The value to store.
   * @param {number} casUnique Unique 64-bit value, usually from a gets operation.
   * @returns {{stored: true}}  If the value was stored.
   * @returns {{exitsts: true}}  If the value has been altered by a previous store operation.
   * @returns {{notFound: boolean}} If the key does not exists within the cache.
   * @memberof CacheMemory
   */
  cas(key, flags, expTime, value, casUnique){

    let result = {};
    let record = this.get(key);
    
    if( record ){

      if( casUnique == record.casUnique ){

        record.update(flags, expTime, value);
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
   * Sets a timer that checks the entire cache memory for expired keys and deletes them.
   * Every call to this method will stop the its preceding timer.
   * 
   * @param {number} [interval = -1] Time between checks for expired keys, in miliseconds.
   * if interval is negative it won't do any purging.
   * @memberof CacheMemory
   */
  purgeExpired(interval = -1){
    
    if( interval > -1){
      
      clearInterval(this._purging);

      this._purging = setInterval(() => {

        for( let [key, record] of this.records ){

          if( record.isExpired() ){
            this.records.delete(key);
          }
        }

      }, interval);

    } else {

      clearInterval(this._purging);

    }
  }

}

module.exports = CacheMemory;
