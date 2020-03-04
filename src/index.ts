#!/usr/bin/env node

import yargs from 'yargs';
import fs from 'fs';
import glob from 'glob';
import logger from './logger';
import { parseFile } from './parser';
import { runTests } from './runner';
import { reportTests } from './reporter';

const args = yargs
  .options({
    'api-key': { type: 'string', demandOption: true, alias: 'a' },
    url: { type: 'string', demandOption: false, alias: 'u' },
    name: { type: 'string', demandOption: false, alias: 'n' },
    instructions: { type: 'array', demandOption: false, alias: 'i' },
    file: { type: 'string', demandOption: false, alias: 'f' },
    verbose: { type: 'boolean', demandOption: false, alias: 'v' },
  })
  .check((argv) => {
    if (!argv.file && !(argv.instructions && argv.url)) {
      throw new Error(
        'You must specify either a file or a directory of tests OR an inline name, url and instructions'
      );
    }

    return true;
  }).argv;

if (args.verbose) {
  logger.transports[0].level = 'debug';
} else {
  logger.transports[0].level = 'info';
}

if (args.file && fs.lstatSync(args.file).isDirectory()) {
  glob('/**/*.{yml,yaml}', { root: args.file }, (_, matches) => {
    try {
      reportTests(matches.map(parseFile), (tests) =>
        runTests(tests, args['api-key'])
      );
    } catch (e) {
      logger.error(e.message);
    }
  });
} else if (args.file && fs.lstatSync(args.file).isFile()) {
  try {
    reportTests([parseFile(args.file)], (tests) =>
      runTests(tests, args['api-key'])
    );
  } catch (e) {
    logger.error(e.message);
  }
} else if (args.file) {
  glob(args.file, { root: process.cwd() }, (_, matches) => {
    try {
      reportTests(matches.map(parseFile), (tests) =>
        runTests(tests, args['api-key'])
      );
    } catch (e) {
      logger.error(e.message);
    }
  });
} else {
  reportTests(
    [
      {
        name: args.name!,
        url: args.url!,
        instructions: args.instructions as string[],
      }
    ],
    (tests) => runTests(tests, args['api-key'])
  );
}
