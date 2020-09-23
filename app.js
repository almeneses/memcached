const CacheMemory = require('./memcached/cacheMemory');
const Net = require('net');

const server = new Net.Server();
let cache = new CacheMemory(250);

function handleCommand(state, commandParams){

  state.command = commandParams[0];
  state.key = commandParams[1];
  state.flags = commandParams[2];
  state.exptime = commandParams[3];
  state.bytes = commandParams[4];
  state.noreply = commandParams.length == 6;



};

function handleStore(state, chunk/*, callbackFunc*/){

  receivingData = false;
  state.data = chunk.slice(0, chunk.length - 2).toString();
  //callbackFunc(state.key, state.flags, state.exptime, state.value);

};


server.listen({port: 1111}, function(){
  console.log("Server working...");
});




server.on('connection', function(socket){
  
  console.log("New connection from: " + socket.remoteAddress + " Port: " + socket.remotePort);
  
  let state = {command: null, key: null, flags: 0, exptime: 0, bytes: 0, noreply: false, casUnique: null, data: null, receivingData:false, handle: null};
  let test = 0;

  socket.on('data', function(chunk){
    
    if( state.receivingData ){

      state.receivingData = false;
      handleStore(state, chunk);

      if(state.command == "add"){

        if ( cache.add(state.key, state.flags, state.exptime, state.data) ){
         
          if( !state.noreply )
            socket.write("STORED\r\n");
        
        } else {
        
          socket.write("NOT_STORED\r\n");
        
        }
        
      }

      if( state.command == "set" ){
        if ( cache.set(state.key, state.flags, state.exptime, state.value) ){
        
          if( !state.noreply ){
            socket.write("STORED\r\n");
          }
        
        } else{
          socket.write("NOT_STORED\r\n");
        }
      }

      if( state.command == "append" ){
        if( cache.append(state.key, state.value) ){
          if(!cache.noreply){
            socket.write("STORED\r\n");
          }

        } else {
          socket.write("NOT_STORED\r\n");
        }
      }

      if( state.command == "prepend" ){
        if( cache.prepend(state.key, state.value) ){
          if(!cache.noreply){
            socket.write("STORED\r\n");
          }

        } else {
          socket.write("NOT_STORED\r\n");
        }

      }

      if( state.command == "cas" ){

        if( cache.cas(state.key, state.flags, state.exptime, state.value, state.casUnique) ){
          if(!cache.noreply){
            socket.write("STORED\r\n");
          }

        } else {
          socket.write("NOT_STORED\r\n");
        }

      }


      

    } else {

      const splittedData = chunk.slice(0, chunk.length - 2).toString().split(" ");
      handleCommand(state, splittedData);

      if( state.command == "get" ){
        let val = null;
        for(let i = 1; i < splittedData.length; i++){

          val = cache.get(splittedData[i]);
          if ( val )
            socket.write("VALUE " + splittedData[i] + " " + val[0] + " " + Buffer.byteLength(val[2]) + "\r\n" + val[2] + "\r\n");
        }
        socket.write("END\r\n");
        
      }

      if( state.command == "gets" ){
        let val = null;
        for(let i = 1; i < splittedData.length; i++){
          val = cache.gets(splittedData[i]);
          if ( val )
            socket.write("VALUE " + splittedData[i] + " " + val[0] + " " + Buffer.byteLength(val[2]) + " " + val[3] +"\r\n" + val[2] + "\r\n");
        }
      }

      if( ["add", "set", "cas", "replace", "append", "preprend"].includes(state.command) ){
        state.receivingData = true;
        
        
      }


      
    }

    console.log(chunk);
    console.log(chunk.toString().slice(0,chunk.length - 1).split(" "));
    console.log(`Data from client: ${chunk.toString()}`);
    console.log(cache.records.values());
    
  });

  socket.on('end', function() {
    console.log('Dont forget to close connection');
  });

});