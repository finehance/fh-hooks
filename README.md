[![npm version](https://badge.fury.io/js/fh-hooks.svg)](https://badge.fury.io/js/fh-hooks)
[![Build Status](https://travis-ci.org/stopyransky/fh-hooks.svg?branch=master)](https://travis-ci.org/stopyransky/fh-hooks)
[![Coverage Status](https://coveralls.io/repos/github/stopyransky/fh-hooks/badge.svg?branch=master)](https://coveralls.io/github/stopyransky/fh-hooks?branch=master)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Commitizen

This project uses Commitizen to prepare commit messages.

Read more about it at [Commitizen repo](https://github.com/commitizen/).

Ensure that you create `prepare-commit-msg` hook in `.git/hooks/` to use it properly:

```
#!/bin/bash
exec < /dev/tty && node_modules/.bin/cz --hook || true
```
