'use strict';

const Constants = require('../globals/constants');


/* Note: 
* Creo que se puede omitir el \r\n en el string
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
   * @memberof CommandParser
   */
  constructor (regExp){
    this.regExp = regExp || /^((\b(add|replace|append|prepend|set)\b(\s[^\s\r\n]{1,255})(\s\d+){3}(\snoreply)?)|(\b(get|gets)\b(\s[^\s\r\n]{1,255})+)|(\bcas\b)((\s[^\s\r\n]{1,255})(\s\d+){4}(\snoreply)?)|(\b(quit)\b))/s;

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
   * @property {Array} key - An array of key of the command.
   * @property {number} flags - The commmand flags, undefined if not flags provided.
   * @property {number} expTime - The commmand expiration time, undefined if not provided.
   * @property {number} bytes  - The bytes of the incomming data, undefined if not provided.
   * @property {number} casUnique  - The casUnique id of the incomming data, undefined if not provided.
   * @property {boolean} noreply  - true if "noreply" is provided in the command, false otherwise.
   */

  /**
   * Parses a command instruction from the given Buffer.
   *
   * @param {Buffer} byteArr The buffer of bytes to parse.
   * @throws Error If the given input is not a valid command.
   * @returns { {line: Command, data: Buffer} } The command object 
   *          with all the given values and a buffer
   *          with the reamining data.  
   * @memberof CommandParser
   */
  parseCommand(byteArr){

    let command;
    let data;

    for (let i = 0, length = byteArr.length - 1; i < length; i++) {
      
      if(byteArr[i] == 13 && byteArr[i + 1] == 10){

        command = byteArr.toString('utf8', 0, i);
        data    = byteArr.slice(i + Constants.CRLN_LEN, byteArr.length);
        
        break;
      }      
    }

    if( !this._isValid(command)){

      throw new Error(Constants.ERRORS.BAD_COMMAND_FORMAT);
              
    } 

    return {
      line: this._format( command.split(" ") ),
      data: data
    };


  }


  /**
   * Formats the given string array into an object command with
   * its parameters.
   *
   * @param {Array} commandArr String array of command and parameters. 
   * @returns {Command} Object with the command's parameters.
   * @memberof CommandParser
   */
  _format(commandArr){
    let result = {command: null, key: null, flags: null, expTime: null, bytes: 0, casUnique: null, noreply: false};
    
    result.command = commandArr[0];

    if( Constants.OPERATIONS.RETRIEVE.includes( result.command ) ){
      
      result.key = commandArr.slice(1, commandArr.length);
      
      return result;
    }

    if( Constants.OPERATIONS.STORE.includes(result.command) ){

      result.key = commandArr[1];
      result.flags = parseInt(commandArr[2]);
      result.expTime = parseInt(commandArr[3]);
      result.bytes = parseInt(commandArr[4]);
      result.noreply = commandArr[5] == "noreply";

      if( result.command == "cas" ){
        result.casUnique = BigInt.asUintN(64, commandArr[5]);
        result.noreply = commandArr[6] == "noreply";
      }

    }

    return result;

  }

}

module.exports = CommandParser;
