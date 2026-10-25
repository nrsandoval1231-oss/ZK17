import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { renderToStaticMarkup } from 'react-dom/server';
import ConnectSection from '../components/connect-section';
import { publicNilContact, type NilContactRecord } from '../content/contact';
import type { SocialLink } from '../content/site';

const approvedEmail: NilContactRecord = {
  verified: true,
  published: true,
  ownerApproved: true,
  source: 'Owner-approved representative contact',
  sourceDate: '2026-10-25',
  destination: { kind: 'email', value: 'representative@example.test' },
};

describe('public NIL inquiry contact', () => {
  it('stays unpublished without a record and fails closed at every approval gate', () => {
    assert.equal(publicNilContact(null), null);
    for (const change of [
      { verified: false },
      { published: false },
      { ownerApproved: false },
      { source: null },
      { sourceDate: 'pending' },
    ]) {
      assert.equal(publicNilContact({ ...approvedEmail, ...change } as NilContactRecord), null);
    }
  });

  it('returns an approved email with an encoded NIL inquiry subject', () => {
    assert.deepEqual(publicNilContact(approvedEmail), {
      kind: 'email',
      href: 'mailto:representative@example.test?subject=NIL%20inquiry%20for%20Zephyr%20Kreye',
    });
  });

  it('accepts only clean HTTPS contact URLs', () => {
    assert.equal(publicNilContact({ ...approvedEmail, destination: { kind: 'url', value: 'https://agency.example.test/contact?from=zk17' } })?.href, 'https://agency.example.test/contact?from=zk17');
    for (const value of ['http://agency.example.test', 'javascript:alert(1)', 'data:text/plain,contact', 'https://agency.example.test\n.evil', 'https://user:pass@agency.example.test']) {
      assert.equal(publicNilContact({ ...approvedEmail, destination: { kind: 'url', value } }), null);
    }
  });

  it('rejects malformed email destinations and control characters', () => {
    for (const value of ['not-an-email', 'team@example.test?bcc=attacker@example.test', ' representative@example.test\n']) {
      assert.equal(publicNilContact({ ...approvedEmail, destination: { kind: 'email', value } }), null);
    }
  });

  it('renders only a pending message when no public contact or social profiles exist', () => {
    const markup = renderToStaticMarkup(ConnectSection({ socials: [], nilContact: null }));
    assert.match(markup, /id="nil-inquiries"/);
    assert.match(markup, /Representative contact details coming soon./i);
    assert.match(markup, /Social profiles will appear here when links are ready/i);
    assert.doesNotMatch(markup, /href="mailto:|href="https:\/\//);
  });

  it('renders every approved social profile as an accessible external link', () => {
    const proof = { verified: true, published: true, source: 'Owner-approved profile', sourceDate: '2026-10-25' };
    const socials: SocialLink[] = [
      { ...proof, id: 'one', label: 'Profile One', url: 'https://social.example.test/one' },
      { ...proof, id: 'two', label: 'Profile Two', url: 'https://social.example.test/two' },
    ];
    const markup = renderToStaticMarkup(ConnectSection({ socials, nilContact: null }));
    assert.match(markup, /href="https:\/\/social\.example\.test\/one" target="_blank" rel="noopener noreferrer" aria-label="Profile One \(opens in a new tab\)"/);
    assert.match(markup, /href="https:\/\/social\.example\.test\/two"/);
  });

  it('renders the approved contact action with its exact safe destination', () => {
    const contact = publicNilContact(approvedEmail);
    assert.ok(contact);
    const markup = renderToStaticMarkup(ConnectSection({ socials: [], nilContact: contact }));
    assert.match(markup, /EMAIL REPRESENTATIVE/);
    assert.match(markup, /mailto:representative@example\.test\?subject=NIL%20inquiry%20for%20Zephyr%20Kreye/);
  });
});
