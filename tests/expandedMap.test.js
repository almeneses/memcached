'use strict';

const ExpandedMap = require("../server/libs/expandedMap");

describe('Tests for expanded behavior in the ExpandedMap', () => {
  
  let expandedMap;
  
  beforeEach(() => { expandedMap = new ExpandedMap() });

  describe('Tests for get functionality', () => {

    test('ExpandedMap with one initial internal Map, should return a previously set item', () => {

      const testKey = "key0";
      const testValue = 1;
      
      expandedMap.maps[0].set(testKey, testValue);

      expect(expandedMap.get(testKey)).toEqual(testValue);

    });

    test('ExpandedMap with two internal maps, both with the same key but return value should be the one of the later internal map.', () => {
      
      const testKey = "key0";
      const testValueMap1 = "Value in the first map";
      const testValueMap2 = "Value in the second map";

      expandedMap.maps[0].set(testKey, testValueMap1);
      expandedMap.maps.push(new Map());
      expandedMap.maps[1].set(testKey, testValueMap2);
      
      expect(expandedMap.get(testKey)).toEqual(testValueMap2);
 
    });

  });


  describe('Tests for set functionality', () => {

    test('Empty ExpandedMap, item should be stored in the first internal Map', () => {

      const testKey = "key0";
      const testValue = "Test value for set";
      let internalMaps = expandedMap.maps;
      let firstInternalMap = internalMaps[0];
      
      expandedMap.set(testKey, testValue);

      const storedValue = firstInternalMap.get(testKey);

      expect(internalMaps.length).toBe(1);
      expect(firstInternalMap.size).toBe(1);
      expect(storedValue).toEqual(testValue);

    });

    test('ExpandedMap with 2 internal maps, items should be stored in the second internal map even if the first map has space',  () => {

      const firstKey = "keyFirstMap";
      const secondKey = "keySecondMap";
      const firstValue = "Value in first map";
      const secondValue = "Value in second map";
      
      expandedMap.maps.push(new Map());

      let firstMap = expandedMap.maps[0];
      let secondMap = expandedMap.maps[1];

      expandedMap.set(firstKey, firstValue);
      expandedMap.set(secondKey, secondValue);

      expect(firstMap.size).toBe(0);
      expect(secondMap.size).toBe(2);
      expect(secondMap.get(firstKey)).toEqual(firstValue);
      expect(secondMap.get(secondKey)).toEqual(secondValue);

    });

  });

  test('ExpandedMap should create a new map when the V8 Map size limit is reached (limit: 2**24 - 1 or 16777216 entries) ', () => {

    const totalNumberOfMaps = 2;
    const totalNumberOfFirstMap = 16777216;
    const totalNumberOfSecondMap = 1;
    let n = 2**24 + 1;

    for (let i = 0; i < n; i++) {
      expandedMap.set(i, i + 1);
    }

    expect(expandedMap.maps.length).toBe(totalNumberOfMaps);
    expect(expandedMap.maps[0].size).toBe(totalNumberOfFirstMap);
    expect(expandedMap.maps[1].size).toBe(totalNumberOfSecondMap);

  });
  
  


});