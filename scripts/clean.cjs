#!/usr/bin/env node
const { rmSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');

const target = resolve(process.cwd(), '.next');

if (existsSync(target)) {
  rmSync(target, { recursive: true, force: true });
  console.log('Removed .next build artifacts');
}
