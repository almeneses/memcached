'use strict';

const Net = require('net');

const Globals = require('./globals/globals');
const Config = require('./globals/config');
const CacheMemory = require('./memcached/cacheMemory');
const Parser = require('./parser/parser');
const Record = require('./memcached/record');

const server = new Net.Server();
const cache = new CacheMemory(Config.MEMSIZE, Config.DATA_MAX_SIZE);
const parser = new Parser();

function handleConnection(socket){

  let context = {
    receivingData : false,
    line : {
      command: null,
      key: null,
      flags: 0,
      expTime: 0,
      bytes: 0,
      casUnique: 0,
      noreply : false,
    },
    data: null,
    bytesRead: 0,
    buffer: null,
    reset: function(){

    context.receivingData = false;
    context.line = {
      command: null,
      key: null,
      flags: 0,
      expTime: 0,
      bytes: 0,
      casUnique: 0,
      noreply : false,
    };
    context.data = null;
    context.bytesRead = 0;
    context.buffer= null;

    }
  }

  function handleData(chunk){

    if( context.receivingData ){
      
      if( context.bytesRead < context.line.bytes ){
        
        
        readData(chunk, context);
  
      } 
      
      if( context.bytesRead = context.line.bytes ) {

        context.receivingData = false;
        context.bytesRead = 0;
        context.bytes = 0;
        
        executeCommand(context);
      }
  
    } else {
  
      try {
  
        context.line = parser.parseCommand(chunk);
      
      } catch (error) {
        
        socket.write( Globals.RESPONSE.CLIENT_ERROR + " " + error.message + "\r\n" );
        return;
      }
  
      
  
      if( Globals.OPERATIONS.STORE.includes(context.line.command) ){
        
        if( context.line.bytes > Config.DATA_MAX_SIZE ){
          socket.write(Globals.RESPONSE.SERVER_ERROR + " object too large for cache, max size is " + Config.DATA_MAX_SIZE + "\r\n");
          return;
        }
        
        context.data = Buffer.allocUnsafe(context.line.bytes);
        context.receivingData = true;
      }
  
      if( Globals.OPERATIONS.RETRIEVE.includes(context.line.command) ){
  
        executeCommand(context);
  
      }
    
    }
  
  }

  function readData(chunk, context){

    for(let i = 0; i < chunk.length; i++){
  
      if( context.bytesRead < context.line.bytes ){
        context.data[context.bytesRead] = chunk[i];
        context.bytesRead++;
      }
  
    }
  
  }

  function executeCommand(context){
  
    let stored;
    let record;

    switch(context.line.command){

      case "get":
        
        context.line.key.forEach((key) =>{

          record = cache.get(key);
          if ( record )
            socket.write("VALUE " + key + " " + record.flags + " " + record.value.length + "\r\n" + record.value + "\r\n");

        });

        socket.write("END\r\n");

        break;        

      case "gets":
        
        context.line.key.forEach((key) =>{

          record = cache.get(key);
          if ( record )
            socket.write("VALUE " + key + " " + record.flags + " " + record.value.length +  " " + record.casUnique + "\r\n" + record.value + "\r\n");

        });
        
        socket.write("END\r\n");

        break;
      
      case "add":
  
        stored = cache.add(context.line.key, context.line.flags, context.line.expTime, context.data);
        
        if( !context.line.noreply )
          socket.write( stored ? Globals.RESPONSE.STORED : Globals.RESPONSE.NOT_STORED );
        
        break;
  
      case "set":
  
        cache.set(context.line.key, context.line.flags, context.line.expTime, context.data)
  
        if( !context.line.noreply )
          socket.write(Globals.RESPONSE.STORED);
        
        break;
  
      case "append":
  
        stored = cache.append(context.line.key, context.data);
  
        if(!cache.noreply)
          socket.write( stored ? Globals.RESPONSE.STORED : Globals.RESPONSE.NOT_STORED );
  
        break;
  
      case "prepend":
  
        stored  = cache.prepend(context.line.key, context.data);
  
        if(!context.line.noreply)            
          socket.write( stored ? Globals.RESPONSE.STORED : Globals.RESPONSE.NOT_STORED );
  
        break;
  
      case "cas":
  
        stored = cache.cas(context.line.key, context.line.flags, context.line.expTime, context.line.data, context.line.casUnique);
  
        if(!cache.noreply){
          let finalResponse;
  
          switch(stored){
          
            case stored.stored:
              finalResponse = Globals.RESPONSE.STORED;
              break;
          
            case stored.notFound:
              finalResponse = Globals.RESPONSE.NOT_FOUND;
              break;
          
            case stored.exists:
              finalResponse = Globals.RESPONSE.EXISTS;
              break;
          }
  
          socket.write(finalResponse);
          
        }
  
    }
  
    context.reset();
  
  }

  socket.on('data', handleData);
  socket.on('end', function() {
    console.log('Dont forget to close connection');
  });

}

cache.purgeExpired(Config.purgeKeys);

server.listen(Config.PORT);
server.on('connection', handleConnection);