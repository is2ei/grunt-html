import { strict as assert } from 'node:assert';
import path from 'node:path';
import stripAnsi from 'strip-ansi';
import { defaultReporter, selectReporter } from '../lib/reporters.js';
import { checkstyle as checkstyleReporter } from '../lib/reporters/checkstyle.js';
import { json as jsonReporter } from '../lib/reporters/json.js';
import { junit as junitReporter } from '../lib/reporters/junit.js';
import { reporter as customReporter } from './helpers/custom_reporter.js';
import { results as expectedResults } from './helpers/expected_results.js';

describe('reporters', () => {
  describe('default reporter', () => {
    it('when given empty result', done => {
      const result = [];
      const reporter = defaultReporter;
      const expected = '';
      const actual = reporter(result);

      assert.equal(actual, expected, 'Should return empty String for empty result');
      done();
    });

    it('when given non-empty result', done => {
      const invalidHtml = path.normalize('test/fixtures/invalid.html');
      const result = expectedResults.invalid;
      const reporter = defaultReporter;
      const expected = [
        `${invalidHtml} [L1:C16] Start tag seen without seeing a doctype first. Expected “<!DOCTYPE html>”.`,
        `${invalidHtml} [L9:C96] Attribute “unknownattr” not allowed on element “img” at this point.`,
        `${invalidHtml} [L9:C96] An “img” element must have an “alt” attribute, except under certain conditions. For details, consult guidance on providing text alternatives for images.`,
        `${invalidHtml} [L11:C19] The “clear” attribute on the “br” element is obsolete. Use CSS instead.`
      ].join('\n');
      const actual = stripAnsi(reporter(result));

      assert.equal(actual, expected, 'Should report errors as a String');
      done();
    });
  });

  describe('select reporter', () => {
    it('when no reporter is specified', done => {
      const options = {};
      const reporter = selectReporter(options);

      assert.equal(reporter, defaultReporter, 'Should return default reporter');
      done();
    });

    it('when checkstyle reporter is specified', done => {
      const options = {
        reporter: 'checkstyle'
      };
      const reporter = selectReporter(options);

      assert.equal(reporter, checkstyleReporter, 'Should return checkstyle reporter');
      done();
    });

    it('when json reporter is specified', done => {
      const options = {
        reporter: 'json'
      };
      const reporter = selectReporter(options);

      assert.equal(reporter, jsonReporter, 'Should return json reporter');
      done();
    });

    it('when junit reporter is specified', done => {
      const options = {
        reporter: 'junit'
      };
      const reporter = selectReporter(options);

      assert.equal(reporter, junitReporter, 'Should return junit reporter');
      done();
    });

    it('when valid custom reporter is specified', done => {
      const options = {
        reporter: 'test/helpers/custom_reporter.js'
      };
      const reporter = selectReporter(options);

      assert.equal(reporter, customReporter, 'Should return custom reporter');
      done();
    });

    it('when an invalid custom reporter is specified', done => {
      const options = {
        reporter: 'does/not/exist.js'
      };

      assert.throws(
        () => {
          selectReporter(options);
        },
        Error,
        'Should throw an error'
      );
      done();
    });
  });
});
