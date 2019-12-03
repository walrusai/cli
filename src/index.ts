#!/usr/bin/env node

import yargs from 'yargs';
import axios from 'axios';
import ora from 'ora';
import fs from 'fs';
import glob from 'glob';
import yaml from 'js-yaml';
import chalk from 'chalk';

const WALRUS_API = 'https://api.walrus.ai';

type IntegrationTest = {
  name?: string,
  url: string,
  instructions: string[],
  variables?: { [key: string]: string },
};

const runTests = async (tests: IntegrationTest[]): Promise<void> => {
  const message = `Running ${tests.length} test${tests.length > 1 ? 's' : ''}`;
  const spinner = ora(message).start();
  const executions = tests.map(async (test) => {
    try {
      const response = await axios.post(WALRUS_API, test, { headers: { 'X-Walrus-Token': args['api-key'] } });
      return { ...(test.name ? { name: test.name } : {}), ...response.data };
    }
    catch (error) {
      return { ...(test.name ? { name: test.name } : {}), ...error.response.data };
    }
  })

  Promise.all(executions).then(
    (values) => {
      spinner.stop();

      const successes = values.filter((value) => value.success);
      const failures = values.filter((value) => !value.success);

      if (successes.length > 0) {
        const message = chalk.green(`Successes: ${successes.length}`);
        console.log(message);
        successes.forEach((value) => console.log(value));
      }

      if (failures.length > 0) {
        const message = chalk.red(`Failures: ${failures.length}`);
        console.log(message);
        failures.forEach((value) => console.log(value));
      }
    }
  );
};

const parseFileToTest = (fileName: string): IntegrationTest => {
  const doc = yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));

  if (!doc.url) {
    throw new Error(`'url' is required in file ${fileName}`);
  }

  if (!doc.instructions || doc.instructions.length === 0) {
    throw new Error(`'instructions' are required in file ${fileName}`);
  }

  return { name: doc.name, url: doc.url, instructions: doc.instructions, variables: doc.variables };
};

const args = yargs
  .options({
    'api-key': { type: 'string', demandOption: true, alias: 'a' },
    'url': { type: 'string', demandOption: false, alias: 'u' },
    'name': { type: 'string', demandOption: false, alias: 'n' },
    'instructions': { type: 'array', demandOption: false, alias: 'i' },
    'file': { type: 'string', demandOption: false, alias: 'f' },
  })
  .check((argv) => {
    if (!argv.file && !(argv.instructions && argv.url)) {
      throw new Error('You must specify either a file or a directory of tests OR an inline url with instructions');
    }

    return true;
  })
  .argv;

if (args['file'] && fs.lstatSync(args['file']).isDirectory()) {
  glob('/**/*.yml', { root: args['file'] }, (_, matches) => {
    try {
      runTests(matches.map(parseFileToTest));
    } catch(e) { console.log(e.message); }
  });
} else if (args['file']) {
  try {
    runTests([parseFileToTest(args['file'])]);
  } catch(e) { console.log(e.message); }
} else {
  runTests([{ name: args['name'], url: args['url']!, instructions: (args['instructions'] as any) }])
}
