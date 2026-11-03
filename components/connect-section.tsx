import type { PublicNilContact } from '@/content/contact';
import type { SocialLink } from '@/content/site';

export default function ConnectSection({ socials, nilContact }: { socials: SocialLink[]; nilContact: PublicNilContact | null }) {
  return (
    <div className="connect-section" id="nil-inquiries">
      <section className="connect-nil" aria-labelledby="connect-nil-title">
        <h2 id="connect-nil-title">LET’S TALK<br /><em>NIL.</em></h2>
        {nilContact ? (
          <a className="connect-action" href={nilContact.href} target={nilContact.kind === 'url' ? '_blank' : undefined} rel={nilContact.kind === 'url' ? 'noopener noreferrer' : undefined}>
            {nilContact.kind === 'email' ? 'EMAIL INQUIRY' : 'NIL CONTACT PAGE'}
          </a>
        ) : (
          <p className="connect-pending">Representative contact details coming soon.</p>
        )}
      </section>
      <section className="connect-social" aria-labelledby="connect-social-title">
        <h3 id="connect-social-title">FOLLOW ALONG</h3>
        {socials.length ? (
          <nav aria-label="Social profiles">
            {socials.map((link) => <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`${link.label} (opens in a new tab)`}>{link.label}</a>)}
          </nav>
        ) : (
          <p>Social profiles will appear here when links are ready.</p>
        )}
      </section>
    </div>
  );
}
