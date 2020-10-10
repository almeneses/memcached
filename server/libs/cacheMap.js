'use strict';

const Record = require('./record');

const CLEANER = Symbol();


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


  set(key, value){
    
    this[ CLEANER ](value);
    super.set(key, value);
    this.amountUsed += value.getSize();
    
  }

  delete(key){
    
    let value = super.get(key);
    
    if( value ){
      
      super.delete(key);
      this.amountUsed -= value.getSize();

    }

  }

  clean(){
    this.delete(this.keys().next().value);
  }

  [ CLEANER ](value){
    
    const recordSize = value.getSize();
    
    while( (this.amountUsed + recordSize) > this.cacheSize ){
      this.clean();
    }
  

  }


  
};

module.exports = CacheMap;