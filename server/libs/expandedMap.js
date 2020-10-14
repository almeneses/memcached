'use strict';

const MAP_MAX_ITEMS = 2 ** 24;

/**
 * A map that goes beyond the V8's 2^24 item limit.
 *
 * @class ExpandedMap
 */
class ExpandedMap {

  constructor(){

    this.maps = [new Map()];

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
      return;

    } else {

      if( map.size == MAP_MAX_ITEMS ){

        let newMap = new Map().set(key,value);
        this.maps.push(newMap);
        return;
      
      }

      map.set(key, value);
    }

  }

  delete(key){
    
    let map;
    
    for (let i = 0; i < this.maps.length; i++) {
      map = this.maps[i];

      if( map.has(key) ){
        map.delete(key);
        return true;
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