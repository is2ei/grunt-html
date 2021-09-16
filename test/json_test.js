import { strict as assert } from 'node:assert';
import { json as reporter } from '../lib/reporters/json.js';
import { results as expectedResults } from './helpers/expected_results.js';

describe('json reporter', () => {
  it('when given empty result', done => {
    const result = [];
    const expected = '[]';
    const actual = reporter(result);

    assert.equal(actual, expected, 'Should return empty json array for empty result');
    done();
  });

  it('when given non-empty result', done => {
    const result = expectedResults.invalid;
    const expected = JSON.stringify(result, null, 2);
    const actual = reporter(result);

    assert.equal(actual, expected, 'Should report errors as json array');
    done();
  });
});
