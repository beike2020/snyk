import * as tap from 'tap';
const fs = require('fs');
import * as pathLib from 'path';
import { gte } from 'semver';

import {
  createDirectory,
  MIN_VERSION_FOR_MKDIR_RECURSIVE,
} from '../src/lib/cli-utils';

const test = tap.test;

const testOutputRelative = 'test-output';
const testOutputFull = pathLib.join(process.cwd(), testOutputRelative);

const levelOneRelative = 'test-output/level-one';
const levelOneFull = pathLib.join(process.cwd(), levelOneRelative);

tap.beforeEach((done) => {
  // delete the folder in case it already exists
  if (fs.existsSync(levelOneFull)) {
    fs.rmdirSync(levelOneFull);
  }
  if (fs.existsSync(testOutputFull)) {
    fs.rmdirSync(testOutputFull);
  }
  done();
});

tap.teardown(() => {
  if (fs.existsSync(levelOneFull)) {
    fs.rmdirSync(levelOneFull);
  }
  if (fs.existsSync(testOutputFull)) {
    fs.rmdirSync(testOutputFull);
  }
});

test('createDirectory returns true if directory already exists - non-recursive', (t) => {
  t.plan(2);

  // initially create the directory
  fs.mkdirSync(testOutputFull);

  // attempt to create the directory
  const success: boolean = createDirectory(testOutputFull);
  t.ok(success);

  const directoryExists = fs.existsSync(testOutputFull);
  t.ok(directoryExists);
});

test('createDirectory creates directory - recursive', (t) => {
  t.plan(2);

  // attempt to create the directory requiring recursive
  const success: boolean = createDirectory(levelOneFull);
  const directoryExists = fs.existsSync(levelOneFull);

  // recursive should fail (return false) for node < 10 LTS and pass (return true) for node >= 10 LTS
  // if node >= 10, verify that the deep folder was created
  // if node 8 verify that the deep folder was not created
  const nodeVersion = process.version;
  if (gte(nodeVersion, MIN_VERSION_FOR_MKDIR_RECURSIVE)) {
    t.ok(success);
    t.ok(directoryExists);
  } else {
    t.notOk(success);
    t.notOk(directoryExists);
  }
});
