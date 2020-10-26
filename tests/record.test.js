'use strict';

const Record = require("../cache/record");

describe('Tests for Record initialiation', () => {
  
  beforeEach(() => {

    //Mocks the Date.now() method by always returning the same time.
    jest.spyOn(global.Date, 'now')
    .mockImplementation(() =>
      new Date('2020-01-01T00:00:0Z').valueOf()
    );
  
  });

  afterEach(() => {    
    jest.restoreAllMocks();
  });

  test('Default initialization values', () => {

    const record = new Record();
    const expectedValue = {flags: 0, expTime: 0, value: null, casUnique: 0n};
    
    expect(record).toEqual(expectedValue);

  });

  test('Initializing with given values', () => {

    const expTime = 20;
    const expectedExpTime = (Date.now() / 1000) + expTime;
    const record = new Record(10, expTime, Buffer.from("test value"), 1n);
    const expectedValue = {flags: 10, expTime: expectedExpTime, value: Buffer.from("test value"), casUnique: 1n};

    expect(record).toEqual(expectedValue);
  });

  test('Initializing with expiration time > 30 days should be taken as a UNIX epoch time (expTime * 1000)', () => {

    
    const expTime = 60*60*24*31;
    const record = new Record(10, expTime, Buffer.from("test value"), 1n);
    const expectedValue = {flags: 10, expTime: expTime*1000 , value: Buffer.from("test value"), casUnique: 1n};

    expect(record).toEqual(expectedValue);

  });

});

describe('Tests for isExpired()', () => {

  test("Record should be expired", async () => {

    const expTime = 1; //1 second.
    const record = new Record(0, expTime, Buffer.from("test value"), 1n);
    await new Promise((res) => setTimeout(() => {
      
      expect(record.isExpired()).toBe(true);
      res();

    }, expTime*1000 + 10));

  });

  test("Record should **NOT** be expired", async () => {

    const expTime = 2; //2 second2.
    const record = new Record(0, expTime, Buffer.from("test value"), 1n);
    await new Promise((res) => setTimeout(() => {
      
      expect(record.isExpired()).toBe(false);
      res();

    }, expTime*1000 - 100));

  });

  test("Record should **NOT** be expired", async () => {

    const expTime = 0; //1 second.
    const record = new Record(0, expTime, Buffer.from("test value"), 1n);
    await new Promise((res) => setTimeout(() => {
      
      expect(record.isExpired()).toBe(false);
      res();

    }, expTime*1000 - 10));

  });

});