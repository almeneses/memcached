# Changelog
All notable changes to this project will be documented in this file. This file (and project) adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2020-10-25
### Added
- Improved general performance in the command parsing and execution: 
- STORE operations: 31K requests/second avg. => 46K requests/second avg.
- RETRIEVE operations: 26K requests/second avg. => 38K requests/second avg.
- This CHANGELOG file to hopefully keep a good track of overall changes, commits can be messy and numerous.
### Fixed
- Bug in `add` command which allowed to add elements to cache even if they were already present.
- Bug in `set` command which sometimes allowed to store 1 more byte than the specified amount in the command.

### Changed
- Overall project structure, to make it more modular.

## [0.9.0] - 2015-10-06
### Added
- Basic STORE and RETRIEVE cache functionality.
- A somewhat working server.