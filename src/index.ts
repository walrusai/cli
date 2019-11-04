#!/usr/bin/env node

import yargs from 'yargs';
import axios from 'axios';
import ora from 'ora';

const WALRUS_API = 'https://api.walrus.ai';

const args = yargs.options({
  'api-key': { type: 'string', demandOption: true, alias: 'a' },
  url: { type: 'string', demandOption: true, alias: 'u' },
  instructions: { type: 'array', demandOption: true, alias: 'i' },
}).argv;

const spinner = ora(`Running test on ${args.instructions}`).start();

axios
  .post(
    WALRUS_API,
    { url: args['url'], instructions: args['instructions'] },
    {
      headers: { 'X-Walrus-Token': args['api-key'] },
    },
  )
  .then(
    (response) => {
      spinner.stop();

      console.log(JSON.stringify(response.data, null, 2));
    },
    (reason) => {
      spinner.stop();

      console.log(JSON.stringify(reason.response.data, null, 2));
      process.exitCode = 1;
    },
  );
