import fs from 'fs';
import * as parser from 'src/parser';

describe('src/parser', () => {
  describe('#parseFile', () => {
    let fileName: string;
    let fileContents: string;

    beforeEach(() => {
      fileName = 'file_name.yml';
    });

    describe('missing name', () => {
      beforeEach(() => {
        fileContents = `---
url: 'https://google.com'
instructions:
  - 'Step one'
  - 'Step two'`;

        fs.readFileSync = jest.fn().mockReturnValue(fileContents);
      });

      it('should throw an error', () => {
        expect(() => parser.parseFile(fileName)).toThrow();
      });
    });

    describe('missing url', () => {
      beforeEach(() => {
        fileContents = `---
name: 'test name'
instructions:
  - 'Step one'
  - 'Step two'`;
      });

      it('should throw an error', () => {
        expect(() => parser.parseFile(fileName)).toThrow();
      });
    });

    describe('missing instructions', () => {
      beforeEach(() => {
        fileContents = `---
name: 'test name'
url: 'https://google.com'`;

        fs.readFileSync = jest.fn().mockReturnValue(fileContents);
      });

      it('should throw an error', () => {
        expect(() => parser.parseFile(fileName)).toThrow();
      });
    });

    describe('valid', () => {
      beforeEach(() => {
        fileContents = `---
name: 'test name'
url: 'https://google.com'
instructions:
  - 'Step one'
  - 'Step two'
variables:
  environment: $NODE_ENV`;

        fs.readFileSync = jest.fn().mockReturnValue(fileContents);
      });

      it('should correctly parse', () => {
        expect(parser.parseFile(fileName)).toEqual({
          name: 'test name',
          url: 'https://google.com',
          instructions: ['Step one', 'Step two'],
          variables: {
            environment: 'test',
          },
        });
      });
    });
  });
});
