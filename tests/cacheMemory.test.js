const CacheMemory = require('../server/libs/cacheMemory');
const Record = require('../server/libs/record');

const cache = new CacheMemory(250);

//This constant is for making testing easier since expiration
//time is calculated using Date.now(),  but it can change between tests.
const EXP_TIME_TEST = Date.now() + (60*60*24*30); // a month in the future, in seconds.


function fillCacheWithData(numberOfRecords){

  const baseKey = "key";
  const baseValue = "Test value number "; 
  const flag = 0;

  for(let i = 0; i < numberOfRecords; i++){

    const casUnique = Math.random() * Math.random() * 100;
    cache.records.set(baseKey + i, new Record(flag, EXP_TIME_TEST, Buffer.from(baseValue + i)));

  }

}

const numberOfRecords = 10;

beforeEach(() => cache.records.clear());
afterAll(() => cache.records.clear());  

describe('Retrieval tests', () => {

  beforeEach(() => fillCacheWithData(numberOfRecords));
  afterEach(() => cache.records.clear());


  describe("Tests for get command", () => {

    test('Gets a single record from the cache (get command)', () => {

      const testKey = "key0";
      const funcResult = cache.get(testKey);
      const expectedValue = new Record(0, EXP_TIME_TEST, Buffer.from('Test value number 0'));
  
      expect(funcResult).toEqual(expectedValue);
    
    });
  
    test('Get 5 records from cache (get command)', () => {
      let testKeys = ["key0", "key1", "key2", "key5", "key8"];
  
      const expectedValues = [
        new Record(0, EXP_TIME_TEST, Buffer.from("Test value number 0")),
        new Record(0, EXP_TIME_TEST, Buffer.from("Test value number 1")),
        new Record(0, EXP_TIME_TEST, Buffer.from("Test value number 2")),
        new Record(0, EXP_TIME_TEST, Buffer.from("Test value number 5")),
        new Record(0, EXP_TIME_TEST, Buffer.from("Test value number 8")),
      ];
  
      for (let index = 0; index < testKeys.length; index++) {
        expect(cache.get(testKeys[index])).toEqual(expectedValues[index]);
      }
  
    });
  
    test('Get 5 keys but some of them do not exist (get command)', () => {
      let testKeys = ["key20", "key1", "e2", "key5", "key11"];
  
      const expectedValues = [
        undefined,
        new Record(0, EXP_TIME_TEST, Buffer.from("Test value number 1")),
        undefined,
        new Record(0, EXP_TIME_TEST, Buffer.from("Test value number 5")),
        undefined,
      ];
  
      for (let index = 0; index < testKeys.length; index++) {
        expect(cache.get(testKeys[index])).toStrictEqual(expectedValues[index]);
      }
  
    })

  });
  
  describe("Tests for gets command", () => {

    test('Gets a single record from the cache (gets)', () => {

      const testKey = "key0";
      const funcResult = cache.gets(testKey);
      const expectedValue = new Record(0, EXP_TIME_TEST, Buffer.from('Test value number 0'), 0n);
  
      expect(funcResult).toEqual(expectedValue);
    
    });

    test('Gets a single record from the cache with different casUnique (gets)', () => {

      const testKey = "key9";
      const funcResult = cache.gets(testKey);
      const expectedValue = new Record(0, EXP_TIME_TEST, Buffer.from('Test value number 9'), 1n);
  
      expect(funcResult).not.toEqual(expectedValue);
    
    });
  
    test('Gets 5 records from cache (gets)', () => {
      let testKeys = ["key0", "key1", "key2", "key5", "key8"];
  
      const expectedValues = [
        new Record(0, EXP_TIME_TEST, Buffer.from("Test value number 0")),
        new Record(0, EXP_TIME_TEST, Buffer.from("Test value number 1")),
        new Record(0, EXP_TIME_TEST, Buffer.from("Test value number 2")),
        new Record(0, EXP_TIME_TEST, Buffer.from("Test value number 5")),
        new Record(0, EXP_TIME_TEST, Buffer.from("Test value number 8")),
      ];
  
      for (let index = 0; index < testKeys.length; index++) {
        expect(cache.get(testKeys[index])).toEqual(expectedValues[index]);
      }
  
    });
  
    test('Gets 5 keys but some of them do not exist (gets)', () => {
      let testKeys = ["key20", "key1", "e2", "key5", "key11"];
  
      const expectedValues = [
        undefined,
        new Record(0, EXP_TIME_TEST, Buffer.from("Test value number 1"), 0n),
        undefined,
        new Record(0, EXP_TIME_TEST, Buffer.from("Test value number 5"), 0n),
        undefined,
      ];
  
      for (let index = 0; index < testKeys.length; index++) {
        expect(cache.get(testKeys[index])).toStrictEqual(expectedValues[index]);
      }
  
    })

  });

})


describe('Storage tests', () => {

  beforeEach(() => fillCacheWithData(numberOfRecords));
  afterEach(() => cache.records.clear());

  describe('Tests for add command', () => {

    test('Adds record to the cache with a no previously existing key (add)', () =>{

      [flags, expTime, value] = [0, EXP_TIME_TEST, 'Testing add function'];
      const testKey = "addKey";
    
      const funcResult = cache.add(testKey, flags, expTime, value);
      const expectedValue = true;
    
      expect(funcResult).toBe(expectedValue);
    
      const expectedStoredValue = new Record(0, EXP_TIME_TEST,'Testing add function');
      const storedValue = cache.records.get(testKey);
    
      expect(storedValue).toEqual(expectedStoredValue);
    
    });
  
    test('Tries to add record to the cache with an existing key (add)', () => {
  
      [flags, expTime, value] = [0, EXP_TIME_TEST, 'Testing add function'];
      
      const testKey = "addKey";
      let funcResult = cache.add(testKey, flags, expTime, value);
      let expectedValue = true;
      
      //Making sure the value is stored in cache
      expect(funcResult).toBe(expectedValue);
      
      //Now, it'll try to add another value with the same key.
      [flags, expTime, value] = [0, EXP_TIME_TEST, 'Different test value'];
  
      funcResult = cache.add(testKey, flags, expTime, value);
      expectedValue = false
      
      // cache.add should return false when trying to add data to an existing key.
      expect(funcResult).toBe(expectedValue);
  
      const expectedStoredValue = new Record(0, expTime, 'Testing add function');
      
      // Checks if the previous value was left untouched, which should happen.
      expect(cache.records.get(testKey)).toEqual(expectedStoredValue);
    
    });

  });
  
  describe('Tests for set command', () => {

    test('Sets a record to cache with a NO previously existing key (set)', () => {

      [flags, expTime, value] = [0, EXP_TIME_TEST, 'value for set command'];
      const testKey = "testKey"; 
      const expectedValue = new Record(0, expTime, 'value for set command');
      
      cache.set(testKey, flags, expTime, value);
    
      expect(cache.records.get(testKey)).toEqual(expectedValue);
    
    });
  
    test('Sets a record to cache with a previously existing key (set)', () => {
  
      const testKey = "key1"; 
      const expectedStoredValue = new Record(0, EXP_TIME_TEST, Buffer.from('Test value number 1'));
      const storedValue = cache.records.get(testKey);
  
      //Make sure a value for the given testKey exists in cache.
      expect(storedValue).toEqual(expectedStoredValue);
  
      //Set a new value with the given key.
      [flags, expTime, value, casUnique] = [0, EXP_TIME_TEST, Buffer.from('value for set command'), 1n];
      const expectedValue = new Record(flags, EXP_TIME_TEST, value, casUnique);
  
      cache.set(testKey, flags, expTime, value);
    
      expect(cache.records.get(testKey)).toEqual(expectedValue);
    
    });

  });  

  describe('Tests for replace command', () => {

    test('Replaces an existing record with a new one (replace)', () => {

      const testKey = "key2";
      [flags, expTime, value, casUnique] = [10, EXP_TIME_TEST, Buffer.from('New value for replace test'), 1n];
      const funcResult = cache.replace(testKey, flags, expTime, value);
      const expectedValue = true;
      const expectedNewStoredValue = new Record(flags, expTime, value, casUnique);
      
      expect(funcResult).toEqual(expectedValue);
      expect(cache.records.get(testKey)).toEqual(expectedNewStoredValue);
  
    });
  
    test('Tries to replace a non-existing record with a new one (replace)', () => {
  
      const testKey = "nonExistingKey";
      [flags, expTime, value] = ['10', '5', 'New value for replace test'];
      const funcResult = cache.replace(testKey, flags, expTime, length, value);
      const expectedValue = false;
  
      expect(funcResult).toBe(expectedValue);
    });
  

  });

  describe('Tests for append command', () => {

    test('Appends a value to an existing record (append)', () => {

      const testKey = "key1";
      const dataToAppend = Buffer.from(" with additional appended data");
      const funcResult = cache.append(testKey, dataToAppend);
      const expectedValue = true;
  
      //Test if the function returns the expected value.
      expect(funcResult).toBe(expectedValue);
  
      const expectedStoredValue = new Record(0, 0, Buffer.from("Test value number 1 with additional appended data"), 1n);
      const storedValue = cache.records.get(testKey);
  
      //Test if the record was modified and has the expected value.
      expect(storedValue).toEqual(expectedStoredValue);
  
    });
  
    test('Tries to append value to a non-existing record (append)', () => {
  
      const testKey = "nonExistingKey";
      const dataToAppend = Buffer.from(' more data to be appended');
      const funcResult = cache.append(testKey, dataToAppend);
      const expectedValue = false;
  
      expect(funcResult).toBe(expectedValue);
    });

  });
  
  describe("Tests for prepend command", () => {

    test('Prepends a value to an existing record (prepend)', () => {

      const testKey = "key1";
      const dataToPrepend = Buffer.from("Some data to be prepended with ");
      const funcResult = cache.prepend(testKey, dataToPrepend);
      const expectedValue = true;
  
      //Test if the function returns the expected value.
      expect(funcResult).toBe(expectedValue);
  
      const expectedStoredValue = new Record(0, 0, Buffer.from("Some data to be prepended with Test value number 1"), 1n);
      const storedValue = cache.records.get(testKey);
  
      //Test if the record was modified and has the expected value.
      expect(storedValue).toEqual(expectedStoredValue);
  
    });
  
    test('Tries to prepend value to a non-existing record (prepend)', () => {
  
      const testKey = "nonExistingKey";
      const dataToPrepend = ' more data to be prepended';
      const funcResult = cache.prepend(testKey, dataToPrepend);
      const expectedValue = false;
  
      expect(funcResult).toBe(expectedValue);
    });

  });
  
  describe('Tests for cas command', () => {

    test('Stores a value with cas (STORED)', () => {
      
      const testKey = "key0";
      const expectedReturnValue = {stored: true};
      const funcResult = cache.cas(testKey, 0, EXP_TIME_TEST, 'new value to store with cas', 0);
      const expectedNewStoredValue = new Record(0, EXP_TIME_TEST, 'new value to store with cas', 1n);

      expect(funcResult).toEqual(expectedReturnValue);
      expect(cache.records.get(testKey)).toEqual(expectedNewStoredValue);

    });


    test('Tries to store a value to a previously modified key (EXISTS)', () => {
      
      const testKey = "key0";
      const expectedReturnValue = {exists: true};
      const funcResult = cache.cas(testKey, 0, EXP_TIME_TEST, Buffer.from('new value to store with cas'), 1n);
      const expectedNewStoredValue = new Record(0, EXP_TIME_TEST, Buffer.from('Test value number 0'), 0n);

      expect(funcResult).toEqual(expectedReturnValue);
      expect(cache.records.get(testKey)).toEqual(expectedNewStoredValue);

    });

    test('Tries to store a value to an unexisting key (NOT_FOUND)', () => {
      
      const testKey = "key100";
      const expectedReturnValue = {notFound: true};
      const funcResult = cache.cas(testKey, 0, EXP_TIME_TEST, Buffer.from('new value to store with cas'), 0);
      const expectedNewStoredValue = undefined;

      expect(funcResult).toEqual(expectedReturnValue);
      expect(cache.records.get(testKey)).toEqual(expectedNewStoredValue);

    });

  });
  
});