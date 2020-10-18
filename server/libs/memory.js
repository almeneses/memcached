'use strict';


/**
 * A Map with additional internal storage controls.
 *
 * @class Memory
 * @extends {Map}
 */
class Memory extends Map {

  constructor(memSize, recordSize){
    
    super();
    this.memSize = memSize;
    this.recordSize = recordSize;
    this.usedMemory = 0;
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
    
    if( this.has(key) ){
      this.delete(key);
    }

    this._makeSpaceIfFull(record);
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
   * @param {number} bytes
   * @memberof Memory
   */
  _makeSpaceIfFull(bytes){

    let key;
    let value;

    while( (this.usedMemory + bytes) > this.memSize ){
      this.delete(this.keys().next().value);
    }

  }

}

module.exports = Memory;