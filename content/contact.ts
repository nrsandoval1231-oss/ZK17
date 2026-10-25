export type ContactDestination =
  | { kind: 'email'; value: string }
  | { kind: 'url'; value: string };

/** Keep null until an owner-approved public destination is ready to commit. Never store private/pending values here. */
export type NilContactRecord = {
  verified: boolean;
  published: boolean;
  ownerApproved: boolean;
  source: string | null;
  sourceDate: string | null;
  destination: ContactDestination;
};

export type PublicNilContact = { kind: ContactDestination['kind']; href: string };

export const nilContactRecord: NilContactRecord | null = null;

const hasControlCharacters = /[\u0000-\u001f\u007f]/;
const emailAddress = /^[A-Z0-9._+-]+@[A-Z0-9-]+(?:\.[A-Z0-9-]+)+$/i;

function eligible(record: NilContactRecord): boolean {
  const timestamp = record.sourceDate ? Date.parse(record.sourceDate) : NaN;
  return record.verified && record.published && record.ownerApproved && !!record.source?.trim() && Number.isFinite(timestamp);
}

/** Returns only a safe public destination. Invalid and unpublished records stay pending. */
export function publicNilContact(record: NilContactRecord | null): PublicNilContact | null {
  if (!record || !eligible(record)) return null;
  const rawValue = record.destination.value;
  if (!rawValue || hasControlCharacters.test(rawValue)) return null;
  const value = rawValue.trim();
  if (!value) return null;

  if (record.destination.kind === 'email') {
    if (!emailAddress.test(value)) return null;
    const subject = encodeURIComponent('NIL inquiry for Zephyr Kreye');
    return { kind: 'email', href: `mailto:${value}?subject=${subject}` };
  }

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !url.hostname || url.username || url.password) return null;
    return { kind: 'url', href: url.toString() };
  } catch {
    return null;
  }
}
