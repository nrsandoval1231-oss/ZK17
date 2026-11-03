import Link from 'next/link';
import BrandLogo from './brand-logo';
import styles from './worlds.module.css';
export default function WorldFooter({ next, home = false }: { next?: 'field' | 'beyond'; home?: boolean }) {
 return <footer className={styles.footer} id="closing"><Link href={home ? "#arrival" : "/"} aria-label={home ? "BACK TO TOP" : "ZK17 home"}><BrandLogo className="footer-logo" /></Link><p>THE STORY IS STILL BEING WRITTEN.<br />ZEPHYR KREYE / CLASS OF 2027</p><Link prefetch={false} href={next === 'field' ? '/on-the-field/' : next === 'beyond' ? '/beyond-17/' : '/nil-recruiting/'}>{next === 'field' ? 'ON THE FIELD' : next === 'beyond' ? 'BEYOND 17' : 'NIL & BUSINESS INQUIRIES'}</Link></footer>;
}
