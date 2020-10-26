# Memcached

A memcached server implemented in NodeJS.

## About
> Free & open source, high-performance, distributed memory object caching system, generic in nature, but intended for use in speeding up dynamic web applications by alleviating database load.

## Features

- TCP ASCII protocol.
- Parameterized cache size and data size.
- Purges expired keys.
- Makes space when needed (using the Least Recently Used criteria).
- It uses [Buffer](https://nodejs.org/api/buffer.html), so storage space is not limited by V8's heap memory size.
- The following commands are supported: 
  - **Storage:** add, set, replace, append, prepend & cas.
  - **Retrieve:** get & gets.
  - **QUIT:** quit.

For details on each of the command's parameters, see [this list](https://lzone.de/cheat-sheet/memcached) of commands or [refer to the memcached's protocol](https://github.com/memcached/memcached/blob/master/doc/protocol.txt).

## Usage

The server does not have any external dependencies, you can just run it.

Basic usage with default values:

```bash
node app.js
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
node app.js --data-max-size=2 --port=11200 --memsize=500
```
### Notes

- You could consider reducing the amount of V8's garbage collector runs by using the `--max-semi-space-size` (e.g. `node --max-semi-space-size=1024`) launch option to Nodejs. The higher the value(in MB) the less frequent garbage collection executions. Although this might increase the app's performance it could also increase memory usage and have some other side effects so use it at your own risk.

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

# Client

You can use a Unix/telnet terminal as a quick way to issue commands to the server once it has been started:

```bash
telnet <ip-address> <port> 
```

In case the memcached server is running in the same device:

```bash
telnet 127.0.0.1 11211
```

## Examples

For **storage commands**, in the terminal, you will need to issue the command in two steps.

First, issue the command and press Return:

```bash
> add my-key 0 0 16
```

Then, write the value to store and press Return:

```bash
> Hello memcached!
```

For **retrieval commands**, only the command and the key are needed, so it is a 1-step process:

```bash
> get my-key
```

This gives the following response:

```bash
VALUE 0 16
Hello memcached!
END
```

# Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

# License
[Beerware](https://spdx.org/licenses/Beerware.html)
