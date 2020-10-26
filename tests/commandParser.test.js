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

    const incorrectCommand1 = Buffer.from(" get 12\r\n");
    const incorrectCommand2 = Buffer.from("key get\r\n");
    const incorrectCommand3 = Buffer.from("get\r\n");
    const incorrectCommand4 = Buffer.from("get \r\n\r\n");
    const incorrectCommand5 = Buffer.from("get key \r\n key\r\n");
    const incorrectCommand6 = Buffer.from("get  \r\n");
    const incorrectCommand7 = Buffer.from("get\r\n");
    const incorrectCommand8 = Buffer.from("get 12\r\n ");

    expect(commandParser.parseCommand(incorrectCommand1)).toThrowError('Bad command format');
    expect(commandParser.parseCommand(incorrectCommand2)).toThrowError('Bad command format');
    expect(commandParser.parseCommand(incorrectCommand3)).toThrowError('Bad command format');
    expect(commandParser.parseCommand(incorrectCommand4)).toThrowError('Bad command format');
    expect(commandParser.parseCommand(incorrectCommand5)).toThrowError('Bad command format');
    expect(commandParser.parseCommand(incorrectCommand6)).toThrowError('Bad command format');
    expect(commandParser.parseCommand(incorrectCommand7)).toThrowError('Bad command format');
    expect(commandParser.parseCommand(incorrectCommand8)).toThrowError('Bad command format');

    


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

  test("'add' command", () => {

    const command = Buffer.from("add key 20 20 20\r\n");
    const expectedResult = {
      line: {command:"add", key:"key", flags:20, expTime:20, bytes:20, casUnique: null, noreply:false},
      data: Buffer.from("")
    };

    const result = commandParser.parseCommand(command);

    expect(result).toEqual(expectedResult);
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

  test("'prepend' command", () => {

    const command = Buffer.from("prepend key 20 20 20\r\n");
    const expectedResult = {
      line: {command:"prepend", key:"key", flags:20, expTime:20, bytes:20, casUnique: null, noreply:false},
      data: Buffer.from("")
    };

    const result = commandParser.parseCommand(command);

    expect(result).toEqual(expectedResult);
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

  test("'cas' command", () => {

    const command = Buffer.from("cas key 20 20 20 1\r\n");
    const expectedResult = {
      line: {command:"cas", key:"key", flags:20, expTime:20, bytes:20, casUnique: 1n, noreply:false},
      data: Buffer.from("")
    };

    const result = commandParser.parseCommand(command);

    expect(result).toEqual(expectedResult);
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


})