const Memory = require("../server/libs/memory");
const Record = require("../server/libs/record");

let memory;

function initializeMemory(memory, numberOfRecords){

  const flags   = 0;
  const expTime = 0;
  const cas     = 0n;
  const value   = "Test value";

  for (let i = 0; i < numberOfRecords; i++) {
    memory.set("key" + i, new Record(flags, expTime, Buffer.from(value + " " + i), cas));
  }

  return memory;

}

describe('Tests for Memory initialization', () => {

  test('Initialize Memory with 50MB memSize & 1MB recordSize', () => {

    const memory = new Memory(50, 1);

    expect(memory.memSize).toBe(50 * 1024 * 1024);
    expect(memory.recordMaxSize).toBe(1 * 1024 * 1024);
    expect(memory.usedMemory).toBe(0);

  });

});


describe('Tests for STORAGE functions', () => {

  beforeEach(() => {

    memory = new Memory(100, 1);

  });

  test('Should store the item in the memory', () => {
    
    const key = "newKey";
    const newValue = new Record(0, 0, Buffer.from("New test value"), 0n);

    memory.set(key, newValue);
    
    expect(memory.get(key)).toEqual(newValue);

  });

  test('Storing a Record should add the size of the record to the usedMemory property of the Memory', () => {

    const key = "key";
    const value = new Record(0, 0, Buffer.from("Test value"), 0n);
    const valueSize = value.getSize();

    memory.set(key, value);

    expect(memory.usedMemory).toBe(valueSize);

  });

  test('Storing a new Record to a full Memory should delete 1 item to free enough space to store it', () => {

    const smallMemory = new Memory((300 / 1024 / 1024), 50 /1024/1024); //Memory of 300 bytes, so it can be filled fast.

    const key0 = "key0";
    const key1 = "key1";
    const key2 = "key2";

    //Each record has a total size of 120 bytes(50 bytes from the value + 70 bytes overhead).
    const record0 = new Record(0, 0, Buffer.from("Test value number 1 which has the size of 50 bytes"), 0n);
    const record1 = new Record(0, 0, Buffer.from("Test value number 2 which has the size of 50 bytes"), 0n);
    const record2 = new Record(0, 0, Buffer.from("Value number 3 which is the size of 44 bytes"), 0n);

    smallMemory.set(key0, record0);
    smallMemory.set(key1, record1);

    expect(smallMemory.usedMemory).toBe(240);
    expect(smallMemory.has(key0)).toBe(true);
    expect(smallMemory.has(key1)).toBe(true);

    smallMemory.set("key2", record2);

    expect(smallMemory.usedMemory).toBe(234);
    expect(smallMemory.has(key0)).toBe(false);
    expect(smallMemory.has(key1)).toBe(true);
    expect(smallMemory.has(key2)).toBe(true);

  });

  test('Storing a new Record to a full Memory should delete 2 items to free enough space to store the third one', () => {
    
    //Memory of 300 bytes, so it can be filled fast.
    //recordMaxSize is 100 bytes, remember that each record has a overhead of 70 bytes.
    const smallMemory = new Memory((300 / 1024 / 1024), 100 /1024/1024); 

    const key0 = "key0";
    const key1 = "key1";
    const key2 = "key2";

    //Each record has a total size of 150 bytes(80 bytes from the value + 70 bytes overhead).
    const record0 = new Record(0, 0, Buffer.from("Test value number 1 that has the size of 80 bytes, needed to test memory release"), 0n);
    const record1 = new Record(100, 5, Buffer.from("Test value number 2 that has the size of 80 bytes, needed to test memory release"), 0n);
    const record2 = new Record(0, 0, Buffer.from("Test value number 3 that has the size of 100 bytes, needed to test memory release & should release 2"), 0n);
    
    smallMemory.set(key0, record0);
    smallMemory.set(key1, record1);

    expect(smallMemory.usedMemory).toBe(300);
    expect(smallMemory.has("key0")).toBe(true);
    expect(smallMemory.has("key1")).toBe(true);

    smallMemory.set(key2, record2);

    expect(smallMemory.usedMemory).toBe(170);
    expect(smallMemory.has("key0")).toBe(false);
    expect(smallMemory.has("key1")).toBe(false);
    expect(smallMemory.has("key2")).toBe(true);

  });


});


describe('Tests for RETRIEVAL functions', () => {
  
  beforeEach(() => {

    const numberOfRecords = 10;
    memory = new Memory(100, 1);
    memory = initializeMemory(memory, numberOfRecords);

  });

  test('Simply retrieve a value', () => {

    const expectedValue = new Record(0, 0, Buffer.from("Test value 0"), 0n);
    const storedValue = memory.get("key0");

    expect(storedValue).toEqual(expectedValue);

  });

  // test('Retrieving a value should make that value the most recently used item (must be the last inserted value)', () => {

    

  // });

})