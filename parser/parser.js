'use strict';
const Globals = require('../globals/globals');

class Parser {

  constructor (regExp){
    this.regExp = regExp ? new RegExp(regExp) :
    new RegExp("(\\b(add|replace|append|prepend|set)\\b(\\s[^\\s\\r\\n]{1,255})(\\s\\d+){3}(\snoreply)?(\\r\\n))|(\\b(get|gets)\\b(\\s[^\\s\\r\\n]{1,255})+)|(quit)", "gs");
  }

  /**
   * Checks if the given input complies with the initial regular expression.
   *
   * @param {string} command
   * @returns true if the string complies with the initial regular expression, false otherwise.
   * @memberof Parser
   */
  _isValid(command){
    return this.regExp.test(command);
  }

  parseCommand(chunk){

    let command = chunk.toString();

    if( !this._isValid(command) ){

      throw new Error("The given command or arguments don't comply with the memcached protocol");
              
    } 

    return this._format( command.slice(0, chunk.length - 2).split(" ") );
  
  }


  _format(arr){
    let result = {};
    
    result.command = arr[0];

    if( Globals.OPERATIONS.RETRIEVE.includes( result.command ) ){
      result.key = [];
      for (let i = 1; i < arr.length; i++) {
        result.key.push(arr[i]);
      }
    }

    if( Globals.OPERATIONS.STORE.includes(result.command) ){

      result.key = arr[1];
      result.flags = parseInt(arr[2]);
      result.expTime = parseInt(arr[3]);
      result.bytes = parseInt(arr[4]);
      result.noreply = arr.length == 6;

    }

    return result;

  }

  
}

module.exports = Parser;
