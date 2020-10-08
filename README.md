# Memcached

A memcached server implemented in NodeJS.

## Features

- TCP ASCII protocol.
- Parameterized cache size and data size.
- Purges expired keys.
- Makes space when needed (using the Least Recently Used criteria).

## Usage

The server does not have any external dependencies, you can just run it.

Basic usage with default values:

```bash
node server/server.js
```
### Options

The server can be started specifying some options:

| Option              | Description                                                            |
|---------------------|------------------------------------------------------------------------|
| --port              | The port for accepting connections, **default:** 11211.                |
| --memsize           | Size of the Cache Memory in Megabyte, **default:** 100.                |
| --data-max-size     | The maximum allowed size for stored data in Megabytes, **default:** 1. |
| --purge-expired-keys| Time (in millis) between checks for expired keys to purge them, 0 means check as fast as possible. **default:** disabled|


An example:
```bash
node server/server.js --data-max-size=2 --port=11200 --memsize=500
```
### Notes

- Keep in mind that **memsize** and **data-max-size** are not directly related, this means that a memsize of 100MB will **NOT** be able to store 100 items of 1MB of data since the cache needs to store additional data information like expiration time, flags, cas, etc. The approximate overhead is 72 bytes per data.

- JavaScript has fixed size limit that prevents the cache to have more than 134 million entries so this first version has this limitation too. An improvement/workaround to this limitation might come in the future.

- This is still a work in progress. 

## Tests

There's 1 testing dependencies:

- Jest.

Before running tests, install the dependencies:

```bash
npm install
```

To run all the unit tests:


```bash
npm test
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[Beerware](https://spdx.org/licenses/Beerware.html)