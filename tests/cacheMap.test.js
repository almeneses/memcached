const CacheMap = require('../server/libs/cacheMap');
const Record = require('../server/libs/record');

describe('Basic creation tests', () => {

  test('Creates with the specified size and itemsize', () => {

    let testCache = new CacheMap(200, 4);

    expect(testCache.cacheSize).toBe(200);
    expect(testCache.itemSize).toBe(4);

  });

});

describe('Test for the overriden set method', () => {

  test('Setting an item modifies the internal amountUsed property', () => {

    const key = "key";
    const testCache = new CacheMap(100, 4);
    const record = new Record(0, 0, Buffer.from("1234"), 0n);

    testCache.set(key, record);

    expect(testCache.amountUsed).toBe(record.getSize());

  });

  test("Setting an item when there is NOT enough space for it and clean() is NOT implemented should throw an exception", 
    () => {

      const key = "key";
      const key2 = "key2";
      const firstRecord = new Record(0, 0, Buffer.from("First record"), 0n);
      const secondRecord = new Record(0, 0, Buffer.from("Second record"), 0n);

      /*Cache size is 100 bytes, each item is 76 bytes in size
      * so when adding 2 items, the first one should be deleted
      * to make space for the second one, triggering the exception.
      */
      const testCache = new CacheMap(100, 4);
      
      testCache.set(key, firstRecord)

      //Tests that the exception thrown is actually the one we expect.
      try {

        testCache.set(key2, secondRecord)
      
      } catch (error) {
      
        expect(error.message).toBe("clean() method is not implemented, it must be implemented");
      
      }   

  });

});