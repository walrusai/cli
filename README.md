# walrus.ai

**walrus** is the command line tool for [walrus.ai](https://walrus.ai).

## Installation

You can install **walrus** via npm.

```
npm install -g @walrusai/cli
```

## Usage

Once you install **walrus**, you are ready to run your first test. You will need an API key, the url to a web application you want to test, and a list of plain english test instructions. You can get an API key for free by signing up [here](https://app.walrus.ai/login).

```
walrus -u https://your-site.com -a YOUR_API_KEY -i \
  Login \
  Add item to your cart \
  More instructions here
```

