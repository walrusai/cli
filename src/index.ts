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
    name: { type: 'array', demandOption: false, alias: 'n' },
    revision: { type: 'string', demandOption: false, alias: 'r' },
    instructions: { type: 'array', demandOption: false, alias: 'i' },
    file: { type: 'string', demandOption: false, alias: 'f' },
    verbose: { type: 'boolean', demandOption: false, alias: 'v' },
  })
  .check((argv) => {
    if (argv.file && !argv.name && !argv.instructions && !argv.url) {
      return true;
    }

    if (argv.name && argv.name.length === 1 && argv.instructions && argv.url && !argv.file) {
      return true;
    }

    if (argv.name && argv.name.length > 1 && !argv.instructions && !argv.url && !argv.file) {
      return true;
    }

    throw new Error(`
      You must specify only one of:
        - An inline name, url, and instructions
        - The path to a file or directory of test YML files
        - A list of test names already created in the Walrus dashboard
    `);
  }).argv;

if (args.verbose) {
  logger.transports[0].level = 'debug';
} else {
  logger.transports[0].level = 'info';
}

if (args.file && fs.lstatSync(args.file).isDirectory()) {
  glob('/**/*.{yml,yaml}', { root: args.file }, (_, matches) => {
    try {
      reportTests(matches.map(parseFile), (tests) => runTests(tests, args['api-key'], args.revision));
    } catch (e) {
      logger.error(e.message);
    }
  });
} else if (args.file && fs.lstatSync(args.file).isFile()) {
  try {
    reportTests([parseFile(args.file)], (tests) => runTests(tests, args['api-key'], args.revision));
  } catch (e) {
    logger.error(e.message);
  }
} else if (args.file) {
  glob(args.file, { root: process.cwd() }, (_, matches) => {
    try {
      reportTests(matches.map(parseFile), (tests) => runTests(tests, args['api-key'], args.revision));
    } catch (e) {
      logger.error(e.message);
    }
  });
} else {
  if (args.name!.length > 1) {
    reportTests(
      args.name!.map((name) => {
        return { name: name.toString() };
      }),
      (tests) => runTests(tests, args['api-key'], args.revision),
    );
  } else {
    reportTests(
      [
        {
          name: args.name![0].toString(),
          url: args.url!,
          instructions: args.instructions as string[],
        },
      ],
      (tests) => runTests(tests, args['api-key'], args.revision),
    );
  }
}
