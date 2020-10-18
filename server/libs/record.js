'use strict';

// Max time in seconds in which expTime will be considered as offset time in seconds, 
// any value higher than this will be considered an UNIX epoch time.
const MAX_OFFSET_TIME = 60*60*24*30;

/* These constants define an aproximate size in bytes 
 * for each type of data (size of the key + size of the value).
 * E.G. {flags : 130} = 2 bytes for value(16-bit int) + 10 bytes 
 * for "flags" key (2 bytes per character) = 12 bytes.
*/
const FLAGS_SIZE = 12; 
const EXPTIME_SIZE = 18;
const CAS_SIZE = 30;
const VALUE_SIZE = 10;

class Record{


  /**
   * Creates an instance of a Record.
   *
   * @param {number} flags The record's flags.
   * @param {number} expTime The record's expiration time.
   * @param {Buffer} value The record's value to store.
   * @memberof Record
   */
  constructor(flags, expTime, value, casUnique){

    this.flags = flags || 0;
    this.casUnique = casUnique ? BigInt.asUintN(64, casUnique) : 0n;
    this.value = value;
    this.expTime = this._assignExpTime(expTime);

  }

  /**
   * Helper method that returns the time in which the
   * record will expire.
   * 
   * @param {*} expTime
   * @returns The time of expiration of the record.
   * @memberof Record
   */
  _assignExpTime(expTime){

    let result = 0;
    
    if(expTime == 0)
      result = 0;
      
    if(expTime > 0){

      if( expTime > MAX_OFFSET_TIME )
        result = expTime;
      else
        result = (Date.now() / 1000) + expTime;
    }

    return result;
  }

  /**
   * Updates the value of the record. It should really be
   * used for operations involving casUnique or any store update.
   *
   * @param {number} flags
   * @param {number} expTime
   * @param {Buffer} value
   * @memberof Record
   */
  update(flags, expTime, value){
    
    this.flags = flags || this.flags;
    this.expTime = this._assignExpTime(expTime);
    this.value = value || this.value;
    this.casUnique++;

  }


  /**
   * Checks if the expiration date of this record is due.
   *
   * @returns {boolean}
   * @memberof Record
   */
  isExpired(){
    return this.expTime ? (Date.now() / 1000 > this.expTime) : false;
  }

  
  /**
   * An aproximation of the Record's size in memory
   *
   * @returns The aproximated value in bytes of this record.
   * @memberof Record
   */
  getSize(){
    return this.value.length + VALUE_SIZE + FLAGS_SIZE + EXPTIME_SIZE + CAS_SIZE;
  }

}

module.exports = Record;