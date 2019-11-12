# walrus.ai

**walrus** is the command line tool for [walrus.ai](https://walrus.ai).

## Installation

You can install **walrus** via npm.

```bash
npm install -g @walrusai/cli
```

## Usage

Once you install **walrus**, you are ready to run your first test. You will need an API key, the url to a web application you want to test, and a list of plain english test instructions. You can get an API key for free by signing up [here](https://app.walrus.ai/login).

```bash
walrus -n 'test-name' -u https://amazon.com -a YOUR_API_KEY -i \
  'Login' \
  'Add an item to your cart' \
  'Make sure the item is in your cart'
```

## Configuration

Generally, each walrus.ai test requires an url, and instructions. These can be specified in line (as in the example above), or as files.

You can optionally provide a test name.

Files are written in YAML as per the example below:

```yaml
---
name: 'test-name'
url: https://amazon.com
instructions:
  - Login
  - Add an item to your cart
  - Make sure the item is in your cart
```

You can then specify either a single test to the walrus program, or a directory of tests.

```bash
walrus -a YOUR_API_KEY -f test-case-1.yml

# OR

walrus -a YOUR_API_KEY -f test-cases/
```
