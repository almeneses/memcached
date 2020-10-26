# Changelog
All notable changes to this project will be documented in this file. This file (and project) adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2020-10-25
### Added
- Improved general performance in the command parsing and execution: 
  - **STORE** operations: from 31K requests/second avg. => 46K requests/second avg. **\***
  - **RETRIEVE** operations: from 26K requests/second avg. => 38K requests/second avg. **\***
- This CHANGELOG file to keep a good track of general changes, commits can be messy and numerous.

---
**\*** Tests performed with [mc-benchmark](https://github.com/antirez/mc-benchmark) with 100 parallel clients and 1.000.000 requests for each operation.

### Fixed
- Bug in `add` command which allowed to add elements to cache even if they were already present.
- Bug in `set` command which sometimes allowed to store 1 more byte than the specified amount in the command.
- Bug in `record.js` which stored the expiration time in seconds rather than milliseconds or UNIX epoch time.
- Bug in the `purgeExpired` cache functionality which allowed multiple expired record searches.

### Changed
- Overall project structure, to make it more modular.

## [1.0.0] - 2020-10-08
### Added
- Basic STORE and RETRIEVE Memcached functionality.