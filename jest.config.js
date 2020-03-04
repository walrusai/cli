const path = require('path');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['node_modules/', 'dist/'],
  modulePaths: [path.resolve(__dirname), 'node_modules'],
};
