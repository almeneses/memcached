'use strict';


/**
 * Parser for command line input for the memcached server.
 *
 * @class ConsoleParser
 */
class ConsoleParser {

  constructor(paramDashes, paramDivider, defaults){

    this.paramDashes = paramDashes || '--';
    this.paramDivider = paramDivider || '=';
    this.defaults = defaults || {};
  }
  
  toCamelCase(str){
  
    return str.replace(/([-][a-z])/gis , (match) => match.toUpperCase().replace('-', ''));
  
  };

  /**
   * Converts the given string array of input parameters into an object with camelCase keys.
   *
   * @param {Array} args
   * @returns {Object} {key: value} Object with all the parsed parameters.
   * @memberof ConsoleParser
   */
  getParams(args){
    
    let result = this.defaults;

    for (let i = 2; i < args.length; i++) {

      let [option, value] = args[i].split(this.paramDivider);
      option = option.slice(this.paramDashes.length, option.length);
      result[this.toCamelCase(option)] = value;     
    }

    return result;
  }

};

module.exports = ConsoleParser;
