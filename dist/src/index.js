#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const yargs_1 = __importDefault(require("yargs"));
const axios_1 = __importDefault(require("axios"));
const ora_1 = __importDefault(require("ora"));
const fs_1 = __importDefault(require("fs"));
const glob_1 = __importDefault(require("glob"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const chalk_1 = __importDefault(require("chalk"));
const WALRUS_API = 'https://api.walrus.ai';
const runTests = async (tests) => {
    const message = `Running ${tests.length} test${tests.length > 1 ? 's' : ''}`;
    const spinner = ora_1.default(message).start();
    const executions = tests.map(async (test) => {
        try {
            const response = await axios_1.default.post(WALRUS_API, { name: test.name, url: test.url, instructions: test.instructions }, {
                headers: { 'X-Walrus-Token': args['api-key'] },
            });
            return Object.assign(Object.assign({}, (test.name ? { name: test.name } : {})), response.data);
        }
        catch (error) {
            return Object.assign(Object.assign({}, (test.name ? { name: test.name } : {})), error.response.data);
        }
    });
    Promise.all(executions).then((values) => {
        spinner.stop();
        const successes = values.filter((value) => value.success);
        const failures = values.filter((value) => !value.success);
        if (successes.length > 0) {
            const message = chalk_1.default.green(`Successes: ${successes.length}`);
            console.log(message);
            successes.forEach((value) => console.log(value));
        }
        if (failures.length > 0) {
            const message = chalk_1.default.red(`Failures: ${failures.length}`);
            console.log(message);
            failures.forEach((value) => console.log(value));
        }
    });
};
const parseFileToTest = (fileName) => {
    const doc = js_yaml_1.default.safeLoad(fs_1.default.readFileSync(fileName, 'utf8'));
    if (!doc.url) {
        throw new Error(`'url' is required in file ${fileName}`);
    }
    if (!doc.instructions || doc.instructions.length === 0) {
        throw new Error(`'instructions' are required in file ${fileName}`);
    }
    return { name: doc.name, url: doc.url, instructions: doc.instructions };
};
const args = yargs_1.default
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
if (args['file'] && fs_1.default.lstatSync(args['file']).isDirectory()) {
    glob_1.default('/**/*.yml', { root: args['file'] }, (_, matches) => {
        try {
            runTests(matches.map(parseFileToTest));
        }
        catch (e) {
            console.log(e.message);
        }
    });
}
else if (args['file']) {
    try {
        runTests([parseFileToTest(args['file'])]);
    }
    catch (e) {
        console.log(e.message);
    }
}
else {
    runTests([{ name: args['name'], url: args['url'], instructions: args['instructions'] }]);
}
