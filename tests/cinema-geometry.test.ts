import test from 'node:test';
import assert from 'node:assert/strict';
import { cinemaCoverScale } from '../lib/cinema-geometry';

test('cover scale fills the cinema using the contained video dimensions', () => {
  assert.equal(cinemaCoverScale(1440, 900, 480, 600, .8), 3);
  assert.equal(cinemaCoverScale(1440, 900, 480, 600, 16 / 9), 10 / 3);
});

test('unmeasured or invalid dimensions never produce an unsafe video transform', () => {
  for (const dimensions of [
    [1440, 900, 0, 0, .8], [1440, 900, 480, 0, .8],
    [0, 900, 480, 600, .8], [1440, 900, 480, 600, 0],
    [1440, 900, NaN, 600, .8], [1440, 900, 480, 600, Infinity],
  ]) assert.equal(cinemaCoverScale(...dimensions as [number, number, number, number, number]), 1);
});
