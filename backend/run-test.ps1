#!/usr/bin/env pwsh

<#
.SYNOPSIS
    Run Jest tests with proper ES Module support
.DESCRIPTION
    This script allows you to run Jest tests with proper support for ES Modules.
    It automatically adds the necessary Node.js flags.
.PARAMETER TestPath
    The path to the test or tests you want to run
.EXAMPLE
    .\run-test.ps1 tests/unit/book.model.test.js
#>

param (
    [Parameter(Mandatory=$true, Position=0)]
    [string]$TestPath
)

# Set environment to test
$env:NODE_ENV = "test"

# Run Jest with proper ES Module support
node --experimental-vm-modules node_modules/jest/bin/jest.js $TestPath --detectOpenHandles --forceExit
