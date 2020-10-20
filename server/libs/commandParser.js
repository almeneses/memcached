'use strict';

const Globals = require('../../globals/globals');


/**
 * Parser for memcached commands.
 *
 * @class CommandParser
 */
class CommandParser {


  /**
   * Creates an instance of CommandParser.
   * 
   * @param {RegExp} regExp Regular expression to check for the incoming command to parse.
   * @param {Object} [operations={}] Operations object with the supported operation types { RETRIEVE: Array, STORE: Array, QUIT: Array}.
   * @memberof CommandParser
   */
  constructor (regExp, operations = {}){
    this.regExp = regExp || /^((\b(add|replace|append|prepend|set)\b(\s[^\s\r\n]{1,255})(\s\d+){3}(\snoreply)?)|(\b(get|gets)\b(\s[^\s\r\n]{1,255})+)|(\bcas\b)((\s[^\s\r\n]{1,255})(\s\d+){4}(\snoreply)?)|(\b(quit)\b))(\r\n)/s;
    this.operations = operations;
  }

  /**
   * Checks if the given input complies with the initial regular expression.
   *
   * @param {string} command
   * @returns true if the string complies with the initial regular expression, false otherwise.
   * @memberof CommandParser
   */
  _isValid(command){
    return this.regExp.test(command);
  }

  /**
   * @typedef {Object} Command
   * @property {string} command - The commmand to execute.
   * @property {Array} key - The key(s) of the command.
   * @property {number} flags - The commmand flags, undefined if not flags provided.
   * @property {number} expTime - The commmand expiration time, undefined if not provided.
   * @property {number} bytes  - The bytes of the incomming data, undefined if not provided.
   * @property {number} casUnique  - The casUnique id of the incomming data, undefined if not provided.
   * @property {boolean} noreply  - true if "noreply" is provided in the command, false otherwise.
   */

  /**
   * Parses a command instruction from the given Buffer.
   *
   * @param {Buffer} byteArr 
   *        The buffer of bytes to parse.
   * @throws {Error}
   *        If the given input is not a valid command.
   * @returns {Command} 
   *        The command object with all the given values.  
   * @memberof CommandParser
   */
  parseCommand(byteArr){

    let command = byteArr.toString();

    if( !this._isValid(command) ){

      throw new Error(Globals.ERRORS.COMMAND_IN_BAD_FORMAT);
              
    } 

    return this._format( command.slice(0, byteArr.length - 2).split(" ") );
  
  }


  _format(arr){
    let result = {};
    
    result.command = arr[0];

    if( this.operations.RETRIEVE.includes( result.command ) ){
      result.key = [];
      for (let i = 1; i < arr.length; i++) {
        result.key.push(arr[i]);
      }
    }

    if( this.operations.STORE.includes(result.command) ){

      result.key = arr[1];
      result.flags = parseInt(arr[2]);
      result.expTime = parseInt(arr[3]);
      result.bytes = parseInt(arr[4]);
      result.noreply = arr[5] == "noreply";

      if( result.command == "cas" ){
        result.casUnique = BigInt.asUintN(64, arr[5]);
        result.noreply = arr[6] == "noreply";
      }

    }

    return result;

  };
  
}

module.exports = CommandParser;
