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
    this.size = 0n;

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
    
    let map = _findKeyMap(key);

    if( map ){
      map.set(key, value);
    }
    
    for (let i = 0; i < this.maps.length; i++) {
      
      map = this.maps[i];
    
      if( map.has(key) ){
        
        return map.set(key, value);
      }
    } 
      
    if( map.size == MAP_MAX_ITEMS ){

        map = new Map();
        this.maps.push(map);
      
      }

      map.set(key, value);
      this.size++;
    }

      return this;
  }

  delete(key){
    
    let map;
    
    for (let i = this.maps.length - 1; i >= 0; --i) {
      
      map = this.maps[i];

      if( map.has(key) ){
        
        map.delete(key);
        this.size--;
        
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

  _findKeyMap(key){
    
    const length = this.maps.length;
    let map;

    while (length--) {

      map = this.maps[length];

      if(map.has(key))
        return map;
    }

    return null;
  }
}

module.exports = ExpandedMap;