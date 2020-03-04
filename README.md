# @walrusai/cli

[![npm version](https://badge.fury.io/js/%40walrusai%2Fcli.svg)](https://badge.fury.io/js/%40walrusai%2Fcli)

The command line tool for [walrus.ai](https://walrus.ai).

[Full Documentation](https://docs.walrus.ai)

## Installation

You can install **@walrusai/cli** via NPM or yarn.

```bash
npm install -g @walrusai/cli

# OR

yarn global add @walrusai/cli
```

## Usage

Once you've installed **@walrusai/cli**, you're almost ready to run your first test. You will need an API key,
the URL to a web application you want to test, and a list of plain English test instructions.
You can get an API key by signing up for free [here](https://app.walrus.ai/login).

Generally, each walrus.ai test requires a url, name, and instructions.

> Detailed documentation about walrus.ai requests can be found [here](https://docs.walrus.ai/requests).

### Passing in-line values

The quickest way to run a test with the walrus.ai CLI is by invoking the command with the appropriate values.

| Flag | Description                             |
|------|-----------------------------------------|
| -a   | Your walrus.ai API key                  |
| -n   | The name of the test                    |
| -u   | The URL of the application to be tested |
| -i   | The plain English instructions          |

A sample invocation looks something like this:

```bash
walrus -n 'test-name' -u https://amazon.com -a YOUR_API_KEY -i \
  'Login' \
  'Add an item to your cart' \
  'Make sure the item is in your cart'
```

### Passing file(s)

Another method for running test(s) with the walrus.ai CLI is by defining them in YAML files, and passing
these files to the CLI.

| Key          | Description                             |
|--------------|-----------------------------------------|
| name         | The name of the test                    |
| url          | The URL of the application to be tested |
| instructions | The plain English instructions          |
| variables    | Any variables to be interpolated.       |

A sample test file looks something like this:

```yaml
# test-case-1.yml
---
name: 'test-name'
url: 'https://amazon.com'
instructions:
  - 'Login with :username!: and :password:'
  - 'Add an item to your cart'
  - 'Make sure the item is in your cart'
variables:
  username!: 'walrus@walrus.ai'
  password: 'hunter2'
```

You can then pass either a single test OR a directory of tests to the walrus.ai CLI.

```bash
walrus -a YOUR_API_KEY -f test-case-1.yml

# OR

walrus -a YOUR_API_KEY -f test-cases/
```
