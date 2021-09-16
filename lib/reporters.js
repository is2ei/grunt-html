import path from 'node:path';
import process from 'node:process';
import chalk from 'chalk';
import { checkstyle as checkstyleReporter } from './reporters/checkstyle.js';
import { json as jsonReporter } from './reporters/json.js';
import { junit as junitReporter } from './reporters/junit.js';

// Default Grunt reporter
function defaultReporter(result) {
  const out = result.map(message => {
    return `${chalk.cyan(message.file)} ` +
      chalk.red('[') + chalk.yellow(`L${message.lastLine}`) +
      chalk.red(':') + chalk.yellow(`C${message.lastColumn}`) + chalk.red('] ') +
      message.message;
  });

  return out.join('\n');
}

// Select a reporter (if not using the default Grunt reporter)
function selectReporter(options) {
  switch (options.reporter) {
    case 'checkstyle': {
      return checkstyleReporter;
    }

    case 'json': {
      return jsonReporter;
    }

    case 'junit': {
      return junitReporter;
    }

    default: {
      // Custom reporter if specified
      if (options.reporter !== null && typeof options.reporter !== 'undefined') {
        return path.resolve(process.cwd(), options.reporter); // FIXME import/require this
      }

      return defaultReporter;
    }
  }
}

export {
  defaultReporter,
  selectReporter
};
