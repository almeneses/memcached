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

  test('ExpandedMap should create a new map when the V8 Map size limit is reached (limit: 2**24 - 1 or 16777216 entries) ', () => {

    const totalNumberOfMaps = 2;
    const totalNumberOfFirstMap = 16777216;
    const totalNumberOfSecondMap = 16777216;
    let n = 2**25;

    for (let i = 0; i < n; i++) {
      expandedMap.set(i, i + 1);
    }

    expect(expandedMap.maps.length).toBe(totalNumberOfMaps);
    expect(expandedMap.maps[0].size).toBe(totalNumberOfFirstMap);
    expect(expandedMap.maps[1].size).toBe(totalNumberOfSecondMap);

  });
  
  


});