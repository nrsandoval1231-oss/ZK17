import { test } from 'node:test';
import assert from 'node:assert/strict';
import { eligibleMetric, seasonMetrics, performanceGames, verifiedGames } from '../content/performance';

test('season record uses one identified source, records conflicts, and never combines providers', () => {
 assert.equal(seasonMetrics.length, 6);
 for (const metric of seasonMetrics) {
  assert.ok(eligibleMetric(metric));
  assert.match(metric.sourceUrl, /^https:\/\/www.maxpreps.com\//);
  assert.equal(metric.verifiedAt, '2026-11-03');
  assert.equal(metric.games, 9);
  assert.ok(metric.note);
 }
 assert.equal(seasonMetrics.find(m => m.id === 'passing-yards')?.value, 1774);
 assert.equal(seasonMetrics.find(m => m.id === 'total-yards')?.value, 2001);
});
test('missing, unpublished, nonfinite, or sourceless statistics stay unpublished', () => {
 const valid = seasonMetrics[0];
 assert.equal(eligibleMetric({...valid, value: null}), false);
 assert.equal(eligibleMetric({...valid, value: NaN}), false);
 assert.equal(eligibleMetric({...valid, published: false}), false);
 assert.equal(eligibleMetric({...valid, sourceUrl: ''}), false);
 assert.equal(eligibleMetric({...valid, verifiedAt: 'unknown'}), false);
 assert.equal(eligibleMetric({...valid, value: 0}), true);
});
test('game log preserves unknown rushing production and excludes unverified games', () => {
 const games = verifiedGames(performanceGames);
 assert.ok(games.length >= 3);
 assert.ok(games.every(g => g.sourceUrl && g.verifiedAt && g.passingYards !== null));
 assert.ok(games.some(g => g.rushingYards === null));
 assert.equal(verifiedGames([{...games[0], verified: false}]).length, 0);
 assert.equal(verifiedGames([{...games[0], sourceUrl: ''}]).length, 0);
});
