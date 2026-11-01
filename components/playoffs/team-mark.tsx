import Image from 'next/image';
import type { Team } from '@/lib/playoffs/tournament';
import { playoffBrand } from '@/content/playoffs';
import styles from './playoffs.module.css';

export default function TeamMark({team,large=false}:{team?:Team;large?:boolean}) {
 const src=team?.logo;
 if(src) return <Image className={large?styles.largeLogo:styles.teamLogo} src={src} alt={`${team.name} logo`} width={playoffBrand.width??96} height={playoffBrand.height??96} unoptimized />;
 if(team?.id==='anna')return <span className={styles.logoPending}>ANNA COYOTES<small>ORIGINAL LOGO PENDING</small></span>;
 return null;
}
