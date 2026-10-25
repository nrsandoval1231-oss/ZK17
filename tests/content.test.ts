import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { profile, publicHighlights, publicMedia, publicOffers, publicPartnerships, publicSocials, publicStats } from '../content/site';
const proof = { verified: true, published: true, source: 'team-approved record', sourceDate: '2026-01-01' };
describe('public content eligibility', () => {
  it('keeps only source-backed approved media and linked highlights', () => {
    const assets = [
      { ...proof, id: 'film', kind: 'video' as const, title: 'Film', src: '/media/film.mp4', alt: '', rights: 'approved' as const },
      { ...proof, id: 'pending', kind: 'photo' as const, title: 'Pending', src: '/media/pending.jpg', alt: '', rights: 'pending' as const },
    ];
    assert.deepEqual(publicMedia(assets).map((x) => x.id), ['film']);
    const highlights = [
      { ...proof, id: 'h1', title: 'One', season: 2026, assetId: 'film' },
      { ...proof, id: 'h2', title: 'Two', season: 2025, assetId: 'film' },
      { ...proof, id: 'h3', title: 'Three', season: 2026, assetId: 'pending' },
    ];
    assert.deepEqual(publicHighlights(highlights, assets, 2026).map((x) => x.id), ['h1']);
  });
  it('requires source, date, season, and game count before stats appear', () => {
    const rows = [
      { ...proof, id: 'valid', label: 'Passing', value: 1, season: 2026, gameCount: 10 },
      { ...proof, id: 'no-games', label: 'Unknown', value: 999, season: 2026, gameCount: 0 },
      { ...proof, source: null, id: 'no-source', label: 'Unknown', value: 999, season: 2026, gameCount: 10 },
    ];
    assert.deepEqual(publicStats(rows).map((x) => x.id), ['valid']);
  });
  it('keeps uncommitted as the only commitment state and holds empty offers/partners/socials', () => {
    assert.equal(profile.commitment, 'UNCOMMITTED');
    assert.deepEqual(publicOffers([]), []);
    assert.deepEqual(publicPartnerships([]), []);
    assert.deepEqual(publicSocials([]), []);
    assert.deepEqual(publicSocials([{ ...proof, id: 'unsafe', label: 'Social', url: 'javascript:alert(1)' }]), []);
  });
});
