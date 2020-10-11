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


  set(key, value){
    
    _clean(value);
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

  _clean(record){
    
    const recordSize = record.getSize();

    while( (this.amountUsed + recordSize ) > this.cacheSize ){

      this.delete(this.keys().next().value);

    }
  }

}
