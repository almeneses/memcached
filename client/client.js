'use strict';

const Readline = require('readline');
const Memcached = require('memcached');
const CommandParser = require('../server/libs/commandParser');
const Globals = require('../globals/globals');


const commandParser = new CommandParser(
  /^((\b(add|replace|append|prepend|set)\b(\s[^\s\r\n]{1,255})(\s\d+){3}(\snoreply)?)|(\b(get|gets)\b(\s[^\s\r\n]{1,255})+)|(\b(quit)\b))/, 
  Globals.OPERATIONS
  );

let memcached = new Memcached('localhost:11212');

const inputLine = Readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

let client = {
  add: (key, data) => {
  
  console.log(`Adding the given data ${data} to the key: ${key}...`);
  
  memcached.add(key, data, 0, function (err) { 

    if( err ){

      console.log(`There was an error: ${err}`);

    } else {
      
      console.log("Data successfully added!");
    }

   });
  },

  set: (options = {key, data, expTime: 0}) => {

    console.log(`Setting the given data ${options.data} to the key: ${options.key}, expTime: ${options.expTime}...`);
    
    memcached.set(options.key, options.data, options.expTime, function(err) { 

      if( err ){

        console.log(`There was an error: ${err}`);

      } else {
        
        console.log("Data successfully set!");
      }

    });
    
  },

  append: (options = {key, data}) => {

    console.log(`Appending the given data ${data} to the key: ${key}...`);

    memcached.append(key, data, function(err){

      if( err ){

        console.log(`There was an error: ${err}`);

      } else {
        
        console.log("Data successfully appended!");
      }

    });

  },

  prepend: (key, data) => {

    console.log(`Prepending the given data ${data} to the key: ${key}...`);

    memcached.prepend(key, data, function(err){

      if( err ){

        console.log(`There was an error: ${err}`);

      } else {
        
        console.log("Data successfully prepended!");
      }

    });

  },

  cas: (key, data, expTime, casUnique) => {

    console.log(`Cassing the data for key: ${key}...`);

    memcached.cas(key, data, casUnique, expTime, function (err, stored){

      if( err ){

        console.log(`There was an error: ${err}`);

      } else {
        
        if( stored )
          console.log("STORED");
      }

    });


  },

  get: (key) => {

    console.log(`Getting the data for keys: ${key}...`);

    memcached.getMulti(key, function (err, data){

      if( err ){

        console.log(`There was an error: ${err}`);

      } else {
        
        console.log(`Got the data: ${data}`);
      }

    });
    
  },

  gets: (keys) => {

    console.log(`Getting the data for keys: ${keys}...`);

    keys.forEach( k => {

      memcached.gets(key, function (err, data){

        if( err ){
    
          console.log(`There was an error: ${err}`);
    
        } else {
          
          console.log(`Got the data: ${data}`);
        }
    
      });
      
    });
    

  }
};

inputLine.prompt();
inputLine.on('line', (inputData) => {
  
  let command = {};
  
  try {
  
    command = commandParser.parseCommand(inputData);
    client[command.command]();
  
  } catch (error) {
    console.log(error);
    
  }

  inputLine.prompt();

  

});



