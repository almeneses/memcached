'use strict';

class ConsoleParser {

  constructor(paramDashes, paramDivider, defaults){

    this.paramDashes = paramDashes || '--';
    this.paramDivider = paramDivider || '=';
    this.defaults = defaults || {};
  }
  
  toCamelCase(str){
  
    return str.replace(/([-][a-z])/gis , (match) => match.toUpperCase().replace('-', ''));
  
  };

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
