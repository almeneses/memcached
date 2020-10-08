'use strict';

/*
* Config object used for the memcached server initial configuration.
*
*/
let Config = {
  port : 11211,
  dataMaxSize : 1024 * 1024,
  memsize: 100 * 1024 * 1024,
  purgeKeys : -1,

  loadConfig: function (options){
    
    this.port = (options.port) > 0 ? +options.port : this.port;
    this.dataMaxSize = (options.dataMaxSize) > 0 ? +options.dataMaxSize *1024*1024 : this.dataMaxSize;
    this.memsize = (options.memsize) > 0 ?  +options.memsize *1024*1024 : this.memsize;
    this.purgeKeys = +options.purgeKeys ? +options.purgeKeys : this.purgeKeys;
      
  }
}

module.exports = Config;