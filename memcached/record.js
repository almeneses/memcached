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
  constructor(flags, expTime, value){

    this.flags = flags;
    this.casUnique = 0;
    this.value = value;

    if(expTime){

      if( expTime > MAX_OFFSET_TIME )
        this.value = value * 1000;
      else
        this.expTime = Date.now() + (expTime * 1000);
    }

  }

  /**
   * 
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
    return this.expTime ? (Date.now() > this.expTime) : true;
  }



}

module.exports = Record;