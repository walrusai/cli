#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const axios_1 = __importDefault(require("axios"));
const ora_1 = __importDefault(require("ora"));
const WALRUS_API = 'https://api.walrus.ai';
const args = yargs_1.default.options({
    'api-key': { type: 'string', demandOption: true, alias: 'a' },
    url: { type: 'string', demandOption: true, alias: 'u' },
    instructions: { type: 'array', demandOption: true, alias: 'i' },
}).argv;
const spinner = ora_1.default(`Running test on ${args.url}`).start();
axios_1.default
    .post(WALRUS_API, { url: args['url'], instructions: args['instructions'] }, {
    headers: { 'X-Walrus-Token': args['api-key'] },
})
    .then((response) => {
    spinner.stop();
    console.log(JSON.stringify(response.data, null, 2));
}, (reason) => {
    spinner.stop();
    console.log(JSON.stringify(reason.response.data, null, 2));
    process.exitCode = 1;
});
