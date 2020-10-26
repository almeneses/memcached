'use strict';

const CommandParser = require("../parsers/commandParser");


const commandParser = new CommandParser();

describe('Tests for the default Regular Expression', () => {


  test("Correct 'get' command", () => {

    const command = Buffer.from("get get key2\r\n");
    const expectedResult = {
      line: {command:"get", key:["get", "key2"], flags:null, expTime:null, bytes:0, casUnique: null, noreply:false},
      data: Buffer.from("")
    };

    const result = commandParser.parseCommand(command);

    expect(result).toEqual(expectedResult);
  });

  test("Incorrect get commands", () => {

    const error = new Error('Bad command format');

    const incorrectCommand1 = Buffer.from(" get 12\r\n");
    const incorrectCommand2 = Buffer.from("key get\r\n");
    const incorrectCommand3 = Buffer.from("get\r\n");
    const incorrectCommand4 = Buffer.from("get \r\n\r\n");
    const incorrectCommand5 = Buffer.from("");
    const incorrectCommand6 = Buffer.from("get  \r\n");
    const incorrectCommand7 = Buffer.from("get\r\n");
    const incorrectCommand8 = Buffer.from("get key");

    expect(() => commandParser.parseCommand(incorrectCommand1)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand2)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand3)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand4)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand5)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand6)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand7)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand8)).toThrowError(error);

  });

  test("'gets' command", () => {

    const command = Buffer.from("gets key\r\n");
    const expectedResult = {
      line: {command:"gets", key:["key"], flags:null, expTime:null, bytes:0, casUnique: null, noreply:false},
      data: Buffer.from("")
    };

    const result = commandParser.parseCommand(command);

    expect(result).toEqual(expectedResult);
  });

  test("Incorrect gets commands", () => {

    const error = new Error('Bad command format');

    const incorrectCommand1 = Buffer.from(" gets 12\r\n");
    const incorrectCommand2 = Buffer.from("key gets\r\n");
    const incorrectCommand3 = Buffer.from("gets\r\n");
    const incorrectCommand4 = Buffer.from("gets \r\n\r\n");
    const incorrectCommand5 = Buffer.from("");
    const incorrectCommand6 = Buffer.from("gets  \r\n");
    const incorrectCommand7 = Buffer.from("gets\r\n");
    const incorrectCommand8 = Buffer.from("gets key");

    expect(() => commandParser.parseCommand(incorrectCommand1)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand2)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand3)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand4)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand5)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand6)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand7)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand8)).toThrowError(error);
    
  });

  test("'add' command", () => {

    const command = Buffer.from("add key 20 20 20\r\n");
    const expectedResult = {
      line: {command:"add", key:"key", flags:20, expTime:20, bytes:20, casUnique: null, noreply:false},
      data: Buffer.from("")
    };

    const result = commandParser.parseCommand(command);

    expect(result).toEqual(expectedResult);
  });
  
  test("Incorrect gets commands", () => {

    const error = new Error('Bad command format');

    const incorrectCommand1   = Buffer.from(" add 12\r\n");
    const incorrectCommand2   = Buffer.from("key add\r\n");
    const incorrectCommand3   = Buffer.from("add\r\n");
    const incorrectCommand4   = Buffer.from("add \r\n\r\n");
    const incorrectCommand5   = Buffer.from("");
    const incorrectCommand6   = Buffer.from("add  \r\n");
    const incorrectCommand7   = Buffer.from("add\r\n");
    const incorrectCommand8   = Buffer.from("add key");
    const incorrectCommand9   = Buffer.from("dad key 0 r 0\r\n");
    const incorrectCommand10  = Buffer.from("0 0 2 key add\r\n");
    const incorrectCommand11  = Buffer.from("add _ _ _\r\n");
    const incorrectCommand12  = Buffer.from("add 10 30 4");
    const incorrectCommand13  = Buffer.from("add 6 9 2 \r\n");
    const incorrectCommand14  = Buffer.from("add493\r\n"); 

    expect(() => commandParser.parseCommand(incorrectCommand1)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand2)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand3)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand4)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand5)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand6)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand7)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand8)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand9)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand10)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand11)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand12)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand13)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand14)).toThrowError(error);


  });

  test("'append' command", () => {

    const command = Buffer.from("append key 20 20 20\r\n");
    const expectedResult = {
      line: {command:"append", key:"key", flags:20, expTime:20, bytes:20, casUnique: null, noreply:false},
      data: Buffer.from("")
    };

    const result = commandParser.parseCommand(command);

    expect(result).toEqual(expectedResult);
  });

  test("Incorrect append commands", () => {

    const error = new Error('Bad command format');

    const incorrectCommand1   = Buffer.from(" append 12\r\n");
    const incorrectCommand2   = Buffer.from("key append\r\n");
    const incorrectCommand3   = Buffer.from("append\r\n");
    const incorrectCommand4   = Buffer.from("append \r\n\r\n");
    const incorrectCommand5   = Buffer.from("");
    const incorrectCommand6   = Buffer.from("append  \r\n");
    const incorrectCommand7   = Buffer.from("append\r\n");
    const incorrectCommand8   = Buffer.from("append key");
    const incorrectCommand9   = Buffer.from("append key e 9 45\r\n");
    const incorrectCommand10   = Buffer.from("append key 0 r 0\r\n");
    const incorrectCommand11   = Buffer.from("append key 8 0 s\r\n");
    const incorrectCommand12  = Buffer.from("0 0 2 key append\r\n");
    const incorrectCommand13  = Buffer.from("append _ _ _\r\n");
    const incorrectCommand14  = Buffer.from("append 10 30 4");
    const incorrectCommand15  = Buffer.from("append 6 9 2 \r\n");
    const incorrectCommand16  = Buffer.from("append493\r\n"); 

    expect(() => commandParser.parseCommand(incorrectCommand1)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand2)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand3)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand4)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand5)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand6)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand7)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand8)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand9)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand10)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand11)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand12)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand13)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand14)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand15)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand16)).toThrowError(error);

  });

  test("'prepend' command", () => {

    const command = Buffer.from("prepend key 20 20 20\r\n");
    const expectedResult = {
      line: {command:"prepend", key:"key", flags:20, expTime:20, bytes:20, casUnique: null, noreply:false},
      data: Buffer.from("")
    };

    const result = commandParser.parseCommand(command);

    expect(result).toEqual(expectedResult);
  });

  test("Incorrect prepend commands", () => {

    const error = new Error('Bad command format');

    const incorrectCommand1   = Buffer.from(" prepend 12\r\n");
    const incorrectCommand2   = Buffer.from("key prepend\r\n");
    const incorrectCommand3   = Buffer.from("prepend\r\n");
    const incorrectCommand4   = Buffer.from("prepend \r\n\r\n");
    const incorrectCommand5   = Buffer.from("");
    const incorrectCommand6   = Buffer.from("prepend  \r\n");
    const incorrectCommand7   = Buffer.from("prepend\r\n");
    const incorrectCommand8   = Buffer.from("prepend key");
    const incorrectCommand9   = Buffer.from("prepend key e 9 45\r\n");
    const incorrectCommand10   = Buffer.from("prepend key 0 r 0\r\n");
    const incorrectCommand11   = Buffer.from("prepend key 8 0 s\r\n");
    const incorrectCommand12  = Buffer.from("0 0 2 key prepend\r\n");
    const incorrectCommand13  = Buffer.from("prepend _ _ _\r\n");
    const incorrectCommand14  = Buffer.from("prepend 10 30 4");
    const incorrectCommand15  = Buffer.from("prepend 6 9 2 \r\n");
    const incorrectCommand16  = Buffer.from("prepend493\r\n"); 

    expect(() => commandParser.parseCommand(incorrectCommand1)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand2)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand3)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand4)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand5)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand6)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand7)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand8)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand9)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand10)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand11)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand12)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand13)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand14)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand15)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand16)).toThrowError(error);

  });

  test("'replace' command", () => {

    const command = Buffer.from("replace key 20 20 20\r\n");
    const expectedResult = {
      line: {command:"replace", key:"key", flags:20, expTime:20, bytes:20, casUnique: null, noreply:false},
      data: Buffer.from("")
    };

    const result = commandParser.parseCommand(command);

    expect(result).toEqual(expectedResult);
  });

  test("Incorrect replace commands", () => {

    const error = new Error('Bad command format');

    const incorrectCommand1   = Buffer.from(" replace 12\r\n");
    const incorrectCommand2   = Buffer.from("key replace\r\n");
    const incorrectCommand3   = Buffer.from("replace\r\n");
    const incorrectCommand4   = Buffer.from("replace \r\n\r\n");
    const incorrectCommand5   = Buffer.from("");
    const incorrectCommand6   = Buffer.from("replace  \r\n");
    const incorrectCommand7   = Buffer.from("replace\r\n");
    const incorrectCommand8   = Buffer.from("replace key");
    const incorrectCommand9   = Buffer.from("replace key e 9 45\r\n");
    const incorrectCommand10   = Buffer.from("replace key 0 r 0\r\n");
    const incorrectCommand11   = Buffer.from("replace key 8 0 s\r\n");
    const incorrectCommand12  = Buffer.from("0 0 2 key replace\r\n");
    const incorrectCommand13  = Buffer.from("replace _ _ _\r\n");
    const incorrectCommand14  = Buffer.from("replace 10 30 4");
    const incorrectCommand15  = Buffer.from("replace 6 9 2 \r\n");
    const incorrectCommand16  = Buffer.from("replace493\r\n"); 

    expect(() => commandParser.parseCommand(incorrectCommand1)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand2)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand3)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand4)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand5)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand6)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand7)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand8)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand9)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand10)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand11)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand12)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand13)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand14)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand15)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand16)).toThrowError(error);

  });

  test("'cas' command", () => {

    const command = Buffer.from("cas key 20 20 20 1\r\n");
    const expectedResult = {
      line: {command:"cas", key:"key", flags:20, expTime:20, bytes:20, casUnique: 1n, noreply:false},
      data: Buffer.from("")
    };

    const result = commandParser.parseCommand(command);

    expect(result).toEqual(expectedResult);
  });

  test("Incorrect cas commands", () => {

    const error = new Error('Bad command format');

    const incorrectCommand1   = Buffer.from(" cas 12\r\n");
    const incorrectCommand2   = Buffer.from("key cas\r\n");
    const incorrectCommand3   = Buffer.from("cas\r\n");
    const incorrectCommand4   = Buffer.from("cas \r\n\r\n");
    const incorrectCommand5   = Buffer.from("");
    const incorrectCommand6   = Buffer.from("cas  \r\n");
    const incorrectCommand7   = Buffer.from("cas\r\n");
    const incorrectCommand8   = Buffer.from("cas key");
    const incorrectCommand9   = Buffer.from("cas key e 9 45\r\n");
    const incorrectCommand10  = Buffer.from("cas key 0 r 0\r\n");
    const incorrectCommand11  = Buffer.from("cas key 8 0 s\r\n");
    const incorrectCommand12  = Buffer.from("0 0 2 key cas\r\n");
    const incorrectCommand13  = Buffer.from("cas _ _ _\r\n");
    const incorrectCommand14  = Buffer.from("cas 10 30 4");
    const incorrectCommand15  = Buffer.from("cas 6 9 2 \r\n");
    const incorrectCommand16  = Buffer.from("cas4937\r\n");
    const incorrectCommand17  = Buffer.from("cas 0 4 56 8\r\n");

    expect(() => commandParser.parseCommand(incorrectCommand1)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand2)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand3)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand4)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand5)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand6)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand7)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand8)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand9)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand10)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand11)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand12)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand13)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand14)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand15)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand16)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand17)).toThrowError(error);

  });

  test("'set' command", () => {

    const command = Buffer.from("set key 0 10 23\r\n");
    const expectedResult = {
      line: {command:"set", key:"key", flags:0, expTime:10, bytes:23, casUnique: null, noreply:false},
      data: Buffer.from("")
    };

    const result = commandParser.parseCommand(command);

    expect(result).toEqual(expectedResult);
  });

  test("Incorrect replace commands", () => {

    const error = new Error('Bad command format');

    const incorrectCommand1   = Buffer.from(" set 12\r\n");
    const incorrectCommand2   = Buffer.from("key set\r\n");
    const incorrectCommand3   = Buffer.from("set\r\n");
    const incorrectCommand4   = Buffer.from("set \r\n\r\n");
    const incorrectCommand5   = Buffer.from("");
    const incorrectCommand6   = Buffer.from("set  \r\n");
    const incorrectCommand7   = Buffer.from("set\r\n");
    const incorrectCommand8   = Buffer.from("set key");
    const incorrectCommand9   = Buffer.from("set key e 9 45\r\n");
    const incorrectCommand10   = Buffer.from("set key 0 r 0\r\n");
    const incorrectCommand11   = Buffer.from("set key 8 0 s\r\n");
    const incorrectCommand12  = Buffer.from("0 0 2 key set\r\n");
    const incorrectCommand13  = Buffer.from("set _ _ _\r\n");
    const incorrectCommand14  = Buffer.from("set 10 30 4");
    const incorrectCommand15  = Buffer.from("set 6 9 2 \r\n");
    const incorrectCommand16  = Buffer.from("set493\r\n"); 

    expect(() => commandParser.parseCommand(incorrectCommand1)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand2)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand3)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand4)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand5)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand6)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand7)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand8)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand9)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand10)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand11)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand12)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand13)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand14)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand15)).toThrowError(error);
    expect(() => commandParser.parseCommand(incorrectCommand16)).toThrowError(error);

  });

})