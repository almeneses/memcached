const CacheMemory = require('../memcached/cacheMemory');
const cache = new CacheMemory(250);

function fillCacheWithData(numberOfRecords){

  const baseKey = "key";
  const baseValue = "Test value number "; 
  const flag = "0";
  const exptime = "0";

  for(let i = 0; i < numberOfRecords; i++){

    const casUnique = Math.random() * Math.random() * 100;
    cache.records.set(baseKey + i, [flag, exptime, baseValue + i/*, casUnique*/]);

  }

}

const numberOfRecords = 10;

beforeEach(() => cache.clear());
afterAll(() => cache.clear());  

describe('Retrieval tests', () => {

  beforeEach(() => fillCacheWithData(numberOfRecords));
  afterEach(() => cache.clear());

  test('Gets a single record from the cache (get command)', () => {

    const testKey = "key0";
    const funcResult = cache.get(testKey);
    const expectedValue = ['0', '0', 'Test value number 0'];
  
    expect(funcResult).toEqual(expectedValue);
  
  });

  test('Get 5 records from cache (get command)', () => {
    let testKeys = ["key0", "key1", "key2", "key5", "key8"];

    const expectedValues = [
      ["0", "0", "Test value number 0"],
      ["0", "0", "Test value number 1"],
      ["0", "0", "Test value number 2"],
      ["0", "0", "Test value number 5"],
      ["0", "0", "Test value number 8"],
    ];

    for (let index = 0; index < testKeys.length; index++) {
      expect(cache.get(testKeys[index])).toEqual(expectedValues[index]);
    }

  });

  test('Get 5 keys but some of them do not exist (get command)', () => {
    let testKeys = ["key20", "key1", "e2", "key5", "key11"];

    const expectedValues = [
      null,
      ["0", "0", "Test value number 1"],
      null,
      ["0", "0", "Test value number 5"],
      null,
    ];

    for (let index = 0; index < testKeys.length; index++) {
      expect(cache.get(testKeys[index])).toEqual(expectedValues[index]);
    }

  })

})


describe('Storage tests', () => {

  beforeEach(() => fillCacheWithData(numberOfRecords));
  afterEach(() => cache.clear());

  test('Adds record to the cache with a no previously existing key (add)', () =>{

    [flags, expTime, length, value] = ['0', '5', '40', 'Testing add function'];
    const testKey = "addKey";
  
    const funcResult = cache.add(testKey, flags, expTime, value);
    const expectedValue = true;
  
    expect(funcResult).toBe(expectedValue);
  
    const expectedStoredValue = ['0', '5','Testing add function']
    const storedValue = cache.records.get(testKey);
  
    expect(storedValue).toEqual(expectedStoredValue);
  
  });

  test('Tries to add record to the cache with an existing key (add)', () => {

    [flags, expTime, length, value] = ['0', '5', '40', 'Testing add function'];
    
    const testKey = "addKey";
    let funcResult = cache.add(testKey, flags, expTime, value);
    let expectedValue = true;
    
    //Making sure the value is stored in cache
    expect(funcResult).toBe(expectedValue);
    
    //Now, it'll try to add another value with the same key.
    [flags, expTime, length, value] = ['0', '5', '40', 'Different test value'];

    funcResult = cache.add(testKey, flags, expTime, value);
    expectedValue = false
    
    // cache.add should return false when trying to add data to an existing key.
    expect(funcResult).toBe(expectedValue);

    const expectedStoredValue = ['0', '5', 'Testing add function'];
    
    // Checks if the previous value was left untouched, which should happen.
    expect(cache.records.get(testKey)).toEqual(expectedStoredValue);
  
  });

  test('Sets a record to cache with a NO previously existing key (set)', () => {

    [flags, expTime, length, value] = ['0', '5', '42', 'value for set command'];
    const testKey = "testKey"; 
    const expectedValue = ['0', '5', 'value for set command'];
    
    cache.set(testKey, flags, expTime, value);
  
    expect(cache.records.get(testKey)).toEqual(expectedValue);
  
  });

  test('Sets a record to cache with a previously existing key (set)', () => {

    const testKey = "key1"; 
    const expectedStoredValue = ['0', '0', 'Test value number 1'];
    const storedValue = cache.records.get(testKey);

    //Make sure a value for the given testKey exists in cache.
    expect(storedValue).toEqual(expectedStoredValue);

    //Set a new value with the given key.
    [flags, expTime, length, value] = ['0', '5', '42', 'value for set command'];
    const expectedValue = ['0', '5', 'value for set command'];

    cache.set(testKey, flags, expTime, value);
  
    expect(cache.records.get(testKey)).toEqual(expectedValue);
  
  });

  

});







