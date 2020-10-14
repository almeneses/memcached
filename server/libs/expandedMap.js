'use strict';

const MAP_MAX_ITEMS = 2 ** 24;

/**
 * A map that goes beyond the V8's limit of 2^24 items.
 *
 * @class ExpandedMap
 */
class ExpandedMap {

  constructor(){

    this.maps = [new Map()];
    this.size = 0;

  }

  get(key){

    let map;
    let value;

    //There's a higher chance the item needed has been
    // stored recently (in a LIFO fashion).
    for (let i = this.maps.length - 1; i >= 0; --i) {
      
      map = this.maps[i]
      value = map.get(key);

      if( value != undefined ){
        return value;
      }
      
    }

    return undefined;

  }

  set(key, value){
    
    let map = this.maps[this.maps.length - 1];
    
    if( map.has(key) ){
      
      map.set(key, value);

    } else {

      if( map.size == MAP_MAX_ITEMS ){

        map = new Map().set(key,value);
        this.maps.push(map);
      
      }

      map.set(key, value);
    }

    return this;

  }

  delete(key){
    
    let map;
    
    for (let i = this.maps.length - 1; i >= 0; --i) {
      
      map = this.maps[i];

      if( map.has(key) ){
        
        return map.delete(key);
      }
      
    }

    return false;

  }

  has(key){
    
    let map;
    
    for (let i = this.maps.length - 1; i >= 0; --i) {
    
      map = this.maps[i];
    
      if( map.has(key) ){
        return true;
      }
      
    }

    return false;
  }

}

module.exports = ExpandedMap;