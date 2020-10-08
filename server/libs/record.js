'use strict';

const MAX_OFFSET_TIME = 60*60*24*30;

class Record{


  /**
   *Creates an instance of a Record.
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

    return this.value.length + 10 + (
    //data_type + sizeOf object property
      14 +//flags
      18 +//exptime 
      30//casUnique
    )
  }



}

module.exports = Record;