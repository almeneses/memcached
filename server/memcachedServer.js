'use strict';

const Net = require('net');
const Connection = require('./connection');
const CacheMemory = require('./libs/cacheMemory');
const CommandParser = require('./libs/commandParser');


/**
 * A memcached server.
 *
 * @class MemcachedServer
 */
class MemcachedServer {


  /**
   * Creates an instance of MemcachedServer.
   *
   * @param {Object} options The server options.
   * @param {CacheMemory} cache The cache memory to manage data. 
   * @param {CommandParser} parser The parser to read and interpret the incoming data.
   * @memberof MemcachedServer
   */
  constructor(options, cache, parser){

    this.cache          = cache;
    this._server        = null;
    this.options        = options;
    this.commandParser  = parser;  

  }

  
  /**
   * Starts the server, listens to new connections.
   *
   * @memberof MemcachedServer
   */
  start(){

    this._server = new Net.createServer((socket) => new Connection(socket, this.cache, this.commandParser).start());
    this._server.listen(this.options.port, () => console.log(`Memcached server started with port: ${this.options.port}`));
    
  }
  

  /**
   * Stops the server.
   *
   * @memberof MemcachedServer
   */
  stop(){

    if(this._server){
      
      this._server.close();
      console.log("Memcached server stopped");
    }

  }

}

module.exports = MemcachedServer;