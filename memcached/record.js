'use strict';

const MAX_OFFSET_TIME = 60*60*24*30;

class Record{


  /**
   *Creates an instance of a Record.
   *
   * @param {number} flags The record's flags.
   * @param {number} expTime The record's expiration time.
   * @param {} value The record's value to store.
   * @memberof Record
   */
  constructor(flags, expTime, value, casUnique){

    this.flags = flags || 0;
    this.casUnique = casUnique || 0;
    this.value = value;

    if(expTime){

      if( expTime > MAX_OFFSET_TIME )
        this.expTime = expTime ;
      else
        this.expTime = (Date.now() / 1000) + expTime;
    }

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
    this.expTime = expTime || this.expTime;
    this.value = value || this.value;
    this.casUnique++;

  }

  isExpired(){
    return this.expTime ? (Date.now() / 1000 > this.expTime) : false;
  }



}

module.exports = Record;