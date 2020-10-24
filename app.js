'use strict';

const Config = require('./globals/config');
const CacheMemory = require('./cache/cacheMemory');
const CommandParser = require('./parsers/commandParser');
const ConsoleParser = require('./parsers/consoleParser');
const MemcachedServer = require('./server/memcachedServer');


const consoleParser = new ConsoleParser();

//Loads the command line parameters into the global Config object.
Config.loadConfig( consoleParser.getParams(process.argv) );

const cache         = new CacheMemory(Config);
const commandParser = new CommandParser();

//Starts the server.
new MemcachedServer(Config, cache, commandParser).start();