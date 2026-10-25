import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { previewPhotos, profile, publicCommitmentReveal, publicHighlights, publicMedia, publicOffers, publicPartnerships, publicScenePhotos, publicSocials, publicStats, type CommitmentAnnouncement } from '../content/site';
import { resolveScenePhoto } from '../content/scene-photo-selection';
import { renderToStaticMarkup } from 'react-dom/server';
import NextChapter from '../components/next-chapter';
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
  it('uses only source-backed approved photo assignments and prefers them over preview fallbacks', () => {
    const photos = [
      { ...proof, id: 'approved-arrival', kind: 'photo' as const, title: 'Arrival original', src: '/media/arrival-original.jpg', width: 1200, height: 1600, alt: 'Approved arrival photo', focalPoint: '42% 35%', rights: 'approved' as const },
      { ...proof, id: 'missing-alt', kind: 'photo' as const, title: 'No alt', src: '/media/no-alt.jpg', width: 1200, height: 1600, alt: '', rights: 'approved' as const },
      { ...proof, id: 'pending-rights', kind: 'photo' as const, title: 'Pending', src: '/media/pending.jpg', width: 1200, height: 1600, alt: 'Pending original', rights: 'pending' as const },
    ];
    const assignments = [{ scene: 'arrival' as const, assetId: 'approved-arrival' }, { scene: 'on-field' as const, assetId: 'missing-alt' }, { scene: 'closing' as const, assetId: 'pending-rights' }];
    const approved = publicScenePhotos(assignments, photos);
    assert.deepEqual(approved.map((photo) => photo.scene), ['arrival']);
    assert.equal(approved[0].src, '/media/arrival-original.jpg');
    assert.equal(resolveScenePhoto('arrival', approved, previewPhotos, true)?.kind, 'approved');
    assert.equal(resolveScenePhoto('on-field', approved, previewPhotos, true)?.id, 'on-field');
    assert.equal(resolveScenePhoto('closing', approved, previewPhotos, true)?.id, 'portrait');
    assert.equal(resolveScenePhoto('arrival', approved, previewPhotos, false)?.kind, 'approved');
    assert.equal(resolveScenePhoto('on-field', approved, previewPhotos, false), undefined);
  });
  it('keeps commitment content absent by default and renders only an approved enabled record', () => {
    const disabled = publicCommitmentReveal(undefined, null);
    assert.deepEqual(disabled, { mode: 'disabled' });
    const disabledMarkup = renderToStaticMarkup(NextChapter({ reveal: disabled, classYear: profile.classYear }));
    assert.match(disabledMarkup, /THE STORY/);
    assert.match(disabledMarkup, /UNCOMMITTED/);
    assert.doesNotMatch(disabledMarkup, /Sample University|approved synthetic announcement/);
    const syntheticApprovedRecord = { ...proof, rights: 'approved' as const, school: 'Sample University', displayCopy: 'A New Chapter Begins.' };
    const enabled = publicCommitmentReveal('enabled', syntheticApprovedRecord);
    const enabledMarkup = renderToStaticMarkup(NextChapter({ reveal: enabled, classYear: profile.classYear }));
    assert.match(enabledMarkup, /A New Chapter Begins\./);
    assert.match(enabledMarkup, /SAMPLE UNIVERSITY/);
    assert.doesNotMatch(enabledMarkup, /UNCOMMITTED/);
    assert.throws(() => publicCommitmentReveal('enabled', null), /owner-approved announcement record/);
    assert.throws(() => publicCommitmentReveal('enabled', { ...syntheticApprovedRecord, rights: 'pending' } as unknown as CommitmentAnnouncement), /owner-approved announcement record/);
  });
});
