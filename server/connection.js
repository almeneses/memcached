'use strict';

const Constants = require("../globals/constants");
const CacheMemory = require("../cache/cacheMemory");
const CommandParser = require("../parsers/commandParser");


/**
 * A Connection context with a client.
 *
 * @class Connection
 */
class Connection {

  /**
   * Creates an instance of Connection.
   *
   * @param {*} socket The socket connection to the client.
   * @param {CacheMemory} cache  The cache this client will access.
   * @param {CommandParser} parser The parser to parse and interpret the client's commands.
   * @memberof Connection
   */
  constructor(socket, cache, parser){

    this.socket         = socket;
    this.cache          = cache;
    this.parser         = parser;
    this.receivingData  = false;
    this.dataBuffer     = null; 
    this.bytesRead      = 0;
    this.commandState   = {line:{}, data: null};

  }


  /**
   * Starts listening to the connection's events.
   *
   * @memberof Connection
   */
  start(){

    this.socket.on('data',  (data) => this.handleData(data, (line, data) => this.executeCommand(line, data)));
    this.socket.on('error', (errorData) => this._handleError(errorData));
    this.socket.on('end', () => this._handleEnd());
    
  }

  /**
   * Parses the incomming data.
   *
   * @param {Buffer | Uint8Array} byteArr The data array.
   * @param {CallableFunction} callback  Callback function.
   * @memberof Connection
   */
  handleData(byteArr, callback){

    if( this.receivingData ){

      try {
        
        this.bytesRead += this._readData(byteArr, this.bytesRead, this.commandState.line.bytes);

      } catch (error) {
        
        this.socket.write(`${Constants.RESPONSE.CLIENT_ERROR} ${error.message}\r\n`);
        this._reset();

      }
      
    } else {

      try {
        
        this.commandState = this.parser.parseCommand(byteArr);
  
        if( Constants.OPERATIONS.STORE.includes( this.commandState.line.command ) ){

          this.receivingData = true;
          this.dataBuffer = Buffer.allocUnsafe(this.commandState.line.bytes);
          this.bytesRead += this._readData(this.commandState.data, 0, this.commandState.line.bytes);
        
        }
            
      } catch (error){

        this.socket.write(`${Constants.RESPONSE.CLIENT_ERROR} ${error.message}\r\n`);
        this._reset();
            
      }

    }

    if( this.bytesRead == this.commandState.line.bytes ){
    
      callback && callback(this.commandState.line, this.dataBuffer);
      this._reset();

    }

  }

  /**
   * Runs the given line command with the given data against the cache.
   *  
   * @param {Command} line The formatted command object.
   * @param {Buffer|Uint8Array} data 
   * @memberof Connection
   */
  executeCommand(line, data){
  
    let stored;
    let record;
    
    switch(line.command){

      case "get":
        
        for (let i = 0, keysLength = line.key.length; i < keysLength; i++) {
      
          record = this.cache.get(line.key[i]);

          if ( record )
            this.socket.write(`VALUE ${line.key[i]} ${record.flags} ${record.value.length}\r\n${record.value}\r\n`);
        }

        this.socket.write("END\r\n");

        break;        

      case "gets":
        
        for (let i = 0, keysLength = line.key.length; i < keysLength; i++) {

          record = this.cache.get(line.key[i]);
          if ( record )
            this.socket.write(`VALUE ${line.key[i]} ${record.flags} ${record.value.length} ${record.casUnique}\r\n${record.value}\r\n`);
        }
        
        this.socket.write("END\r\n");

        break;
      
      case "add":
  
        stored = this.cache.add(line.key, line.flags, line.expTime, data);
        
        if( !line.noreply )
          this.socket.write( stored ? Constants.RESPONSE.STORED : Constants.RESPONSE.NOT_STORED );
        
        break;
  
      case "set":
  
        this.cache.set(line.key, line.flags, line.expTime, data);
  
        if( !line.noreply )
          this.socket.write(Constants.RESPONSE.STORED);
        
        break;

      case "replace":

        stored = this.cache.replace(line.key, line.flags, line.expTime, data);
  
        if(!line.noreply)
          this.socket.write( stored ? Constants.RESPONSE.STORED : Constants.RESPONSE.NOT_STORED );
  
        break;
  
      case "append":
  
        stored = this.cache.append(line.key, data);
  
        if(!line.noreply)
          this.socket.write( stored ? Constants.RESPONSE.STORED : Constants.RESPONSE.NOT_STORED );
  
        break;
  
      case "prepend":
  
        stored  = this.cache.prepend(line.key, data);
  
        if(!line.noreply)            
          this.socket.write( stored ? Constants.RESPONSE.STORED : Constants.RESPONSE.NOT_STORED );
  
        break;
  
      case "cas":
  
        stored = this.cache.cas(line.key, line.flags, line.expTime, data, line.casUnique);
  
        if(!this.cache.noreply){

          let finalResponse;
  
          switch(true){
          
            case stored.stored:
              finalResponse = Constants.RESPONSE.STORED;
              break;
          
            case stored.notFound:
              finalResponse = Constants.RESPONSE.NOT_FOUND;
              break;
          
            case stored.exists:
              finalResponse = Constants.RESPONSE.EXISTS;
              break;
          }
  
          this.socket.write(finalResponse);
          
        }

        break;
      
      case "quit":
        this.socket.destroy();
        break;
  
    }
  
  };

  /**
   * Reads the given data array into the interal data buffer.
   *
   * @param {Buffer|Uint8Array} byteArr The data array to read from.
   * @returns {number} The amount of bytes succesfully read.
   * @memberof Connection
   */
  _readData(byteArr){
    
    const expectedBytes = this.commandState.line.bytes + Constants.CRLN_LEN; //Include \r\n
    const incommingBytes = this.bytesRead + byteArr.length;

    if (incommingBytes < expectedBytes){

      if ( this._hasLineEnding(byteArr) ){
        throw new Error(Constants.ERRORS.BAD_DATA_CHUNK + "\r\n");
      } 

      byteArr.copy(this.dataBuffer, this.bytesRead, 0, byteArr.length);

      return byteArr.length;
    
    } else if (incommingBytes == expectedBytes){

      if ( !this._hasLineEnding(byteArr) ){
        throw new Error(Constants.ERRORS.BAD_DATA_CHUNK + "\r\n");
      }

      byteArr.copy(this.dataBuffer, this.bytesRead, 0, byteArr.length);

      return byteArr.length - Constants.CRLN_LEN;
    
    } else {

      throw new Error(Constants.ERRORS.BAD_DATA_CHUNK + "\r\n");
    }
    
  }


  /**
   *  Checks if the given data array ends with carriage return(\r) 
   *  and new line(\n) characters.
   *
   * @param {Buffer|Uint8Array} byteArr
   * @returns true if the given data array ends with 
   *          the carriage return(\r) and new line(\n) characters.
   * @memberof Connection
   */
  _hasLineEnding(byteArr){

    //13 and 10 are ASCII byte codes for \r and \n respectively.
    return byteArr[byteArr.length - 2] == 13 && byteArr[byteArr.length - 1] == 10;
  
  }


  /**
   * Resets the state data of this connection.
   *
   * @memberof Connection
   */
  _reset(){

    this.receivingData  = false;
    this.dataBuffer     = null; 
    this.bytesRead      = 0;
    this.commandState   = {line:{}, data: null};

  }

  _handleEnd(data){
    console.log("Connnection closed from client");
  }

  _handleError(error){
    console.log(`There was an error: ${error}`);
  }

}

module.exports = Connection;