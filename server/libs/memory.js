'use strict';

const Constants = require("../../globals/constants");


/**
 * A Map with additional internal storage controls.
 *
 * @class Memory
 * @extends {Map}
 */
class Memory extends Map {


  /**
   * Creates an instance of Memory.
   * @param {number} memSize The total size of the memory, in MegaBytes.
   * @param {number} recordMaxSize The maximum size of the data to store, in MegaBytes.
   * @memberof Memory
   */
  constructor(memSize, recordMaxSize){
    
    super();
    this.memSize        = memSize ? (memSize * 1024 * 1024) : 0;
    this.recordMaxSize  = recordMaxSize ? (recordMaxSize * 1024 * 1024) : 0;
    this.usedMemory     = 0;
    this.purging        = 0;
  }


  /**
   * Retrieves the value associated with to the key.
   *
   * @param {*} key
   * @returns
   * @memberof Memory
   */
  get(key){

    let record = super.get(key);

    if ( record ){
      super.delete(key);
      super.set(key, record);
    }

    return record;
  }


  /**
   * Stores the given record with the given key. Updates the
   * amount of memory used by the record.
   * 
   * @param {*} key
   * @param {Record} record
   * @returns {Memory}
   * @memberof Memory
   */
  set(key, record){
    
    const recordSize = record.getValueSize();

    if( recordSize > this.recordMaxSize ){
      throw new Error(Constants.ERRORS.RECORD_BIGGER_THAN_ALLOWED);
    }
    
    if( this.has(key) ){
      this.delete(key);
    }

    this._makeSpaceIfFull(record.getSize());
    this.usedMemory += record.getSize();
    
    return super.set(key, record);
  }

  /**
   * Deletes the record associated to the given key. Updates the
   * amount of memory released.
   * 
   * @param {*} key
   * @returns {boolean}
   * @memberof Memory
   */
  delete(key){

    let record = super.get(key);
    
    if( record ){
      this.usedMemory -= record.getSize();
    }

    return super.delete(key);
  }


  /**
   * Creates space in the memory based on the number of bytes to store by removing the
   * Least Recently Used records.
   *
   * @param {number} bytes The amount of bytes of the record to be stored.
   * @memberof Memory
   */
  _makeSpaceIfFull(bytes){
    
    while( (this.usedMemory + bytes) > this.memSize ){
      this.delete(this.keys().next().value);
    }

  }

}

module.exports = Memory;