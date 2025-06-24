#!/bin/bash

# Run Jest tests with proper ES Module support
# Usage: ./run-test.sh tests/unit/book.model.test.js

if [ -z "$1" ]; then
  echo "Please provide a test path"
  echo "Usage: ./run-test.sh tests/unit/book.model.test.js"
  exit 1
fi

# Set environment to test
export NODE_ENV=test

# Run Jest with proper ES Module support
node --experimental-vm-modules node_modules/jest/bin/jest.js "$1" --detectOpenHandles --forceExit
