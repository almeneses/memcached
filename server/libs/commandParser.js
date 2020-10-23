'use strict';

const Constants = require('../../globals/constants');


/* Note: 
* Creo que se puede omitir incluir el \r\n en el string
* podria ahorrarse algo de tiempo tanto al convertir a string como
* en el match de la expresión regular y no habría necesidad de slice()
* en el _format(), que ahorraria mas tiempo de procesamiento.
*
* Usar una RegExp es bastante cómodo y útil pero tiene un precio en performance,
* Quizá considerar optimizar la RegExp o una manera de parsear el comando sin eso.
*/

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
   * @returns { { command: Command, data: }} 
   *        The command object with all the given values.  
   * @memberof CommandParser
   */
  parseCommand(byteArr){

    let command;
    let data;

    for (let i = 0, length = byteArr.length - 1; i < length; i++) {
      
      if(byteArr[i] == 13 && byteArr[i + 1] == 10){

        command = byteArr.slice(0, i + 2).toString();
        data    = byteArr.slice(i + 2, byteArr.length);
        
        break;
      }      
    }

    if( !this._isValid(command)){

      throw new Error(Constants.ERRORS.COMMAND_IN_BAD_FORMAT);
              
    } 

    return {
      command: this._format( command.slice(0, command.length - 2).split(" ") ),
      data: data
    };
  
  }


  _format(arr){
    let result = {command: null, key: null, flags: null, expTime: null, bytes: 0, casUnique: null, noreply: false};
    
    result.command = arr[0];

    if( Constants.OPERATIONS.RETRIEVE.includes( result.command ) ){
      result.key = [];
      for (let i = 1; i < arr.length; i++) {
        result.key.push(arr[i]);
      }
    }

    if( Constants.OPERATIONS.STORE.includes(result.command) ){

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

module.exports = new CommandParser();
