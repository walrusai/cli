import fs from 'fs';
import yaml from 'js-yaml';
import { WalrusTest } from 'src/walrus_test';

export function parseFile(fileName: string): WalrusTest {
  const doc = yaml.safeLoad(fs.readFileSync(fileName, 'utf8'));

  if (!doc.url) {
    throw new Error(`${fileName}: 'url' is a required field.`);
  }

  if (!doc.instructions || doc.instructions.length === 0) {
    throw new Error(`${fileName}: 'instructions' is a required field.`);
  }

  let variables: Record<string, string> | undefined;

  if (doc.variables) {
    variables = {};

    for (const key of Object.keys(doc.variables)) {
      const value = doc.variables[key];

      if (!(typeof value === 'string')) {
        throw new Error(`${fileName}: invalid variable format - ${key}.`)
      }

      if (value.charAt(0) === '$') {
        const env = process.env[value.substring(1)];

        if (!env) {
          throw new Error(`${fileName}: unknown environment variable - ${value}`)
        }

        variables[key] = env;
      } else {
        variables[key] = value;
      }
    }
  }

  return {
    name: doc.name,
    url: doc.url,
    instructions: doc.instructions,
    variables: variables,
  };
}
