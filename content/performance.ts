/** Update source snapshots and verifiedAt together. Never combine providers' totals. */
export const performanceSource = {
 name: 'MaxPreps · coach-entered record',
 url: 'https://www.maxpreps.com/tx/anna/anna-coyotes/athletes/zephyr-kreye/football/stats/?careerid=ns0up151d9jp9',
 profileUrl: 'https://www.maxpreps.com/tx/anna/anna-coyotes/athletes/zephyr-kreye/?careerid=ns0up151d9jp9',
 verifiedAt: '2026-11-03', updatedAt: '2026-11-02', through: '2026-10-30', games: 9,
};
export type SeasonMetric = {
 id: string; label: string; value: number | null; unit?: '%'; season: number; games: number;
 sourceUrl: string; verifiedAt: string; verified: boolean; published: boolean; note: string;
};
const evidence = { season: 2026, games: 9, sourceUrl: performanceSource.url, verifiedAt: performanceSource.verifiedAt, verified: true, published: true };
export const seasonMetrics: SeasonMetric[] = [
 { ...evidence, id: 'passing-yards', label: 'Passing yards', value: 1774, note: 'MaxPreps reports 1,774. Dallas News reports 1,806; totals are not combined.' },
 { ...evidence, id: 'passing-touchdowns', label: 'Passing touchdowns', value: 21, note: 'MaxPreps reports 21. Dallas News reports 19.' },
 { ...evidence, id: 'rushing-yards', label: 'Rushing yards', value: 227, note: 'MaxPreps reports 227. Dallas News reports 233.' },
 { ...evidence, id: 'rushing-touchdowns', label: 'Rushing touchdowns', value: 7, note: 'MaxPreps reports 7. Dallas News reports 8.' },
 { ...evidence, id: 'total-yards', label: 'Total offensive yards', value: 2001, note: 'MaxPreps Total Yards: 1,774 passing + 227 rushing; receiving is zero.' },
 { ...evidence, id: 'completion', label: 'Completion percentage', value: 64.8, unit: '%', note: 'MaxPreps C% .648 (164 completions / 253 attempts). Dallas News reports 163 / 255.' },
];
function sourceBacked(item: { sourceUrl: string; verifiedAt: string; verified: boolean; published: boolean }) {
 return item.verified && item.published && /^https:\/\//.test(item.sourceUrl) && Number.isFinite(Date.parse(item.verifiedAt));
}
export function eligibleMetric(item: SeasonMetric): boolean {
 return sourceBacked(item) && item.value !== null && Number.isFinite(item.value) && Number.isInteger(item.games) && item.games > 0 && item.season === 2026;
}
export type PerformanceGame = {
 id: string; date: string; opponent: string; passingYards: number | null; passingTouchdowns: number | null;
 rushingYards: number | null; rushingTouchdowns: number | null; sourceUrl: string; verifiedAt: string;
 verified: boolean; published: boolean; signature?: string;
};
const gameEvidence = { sourceUrl: performanceSource.profileUrl, verifiedAt: performanceSource.verifiedAt, verified: true, published: true, rushingYards: null, rushingTouchdowns: null };
export const performanceGames: PerformanceGame[] = [
 { ...gameEvidence, id: 'heritage', date: '2026-08-28', opponent: 'Colleyville Heritage', passingYards: 231, passingTouchdowns: 4, signature: 'FOUR TO OPEN.' },
 { ...gameEvidence, id: 'brock', date: '2026-09-04', opponent: 'Brock', passingYards: 119, passingTouchdowns: 2 },
 { ...gameEvidence, id: 'panther-creek', date: '2026-09-11', opponent: 'Panther Creek', passingYards: 166, passingTouchdowns: 3 },
 { ...gameEvidence, id: 'emerson', date: '2026-09-18', opponent: 'Emerson', passingYards: 313, passingTouchdowns: 1, signature: 'AIRING IT OUT.' },
 { ...gameEvidence, id: 'independence', date: '2026-09-25', opponent: 'Independence', passingYards: 163, passingTouchdowns: 4 },
 { ...gameEvidence, id: 'frisco', date: '2026-10-02', opponent: 'Frisco', passingYards: 127, passingTouchdowns: 1 },
 { ...gameEvidence, id: 'memorial', date: '2026-10-09', opponent: 'Memorial', passingYards: 183, passingTouchdowns: 1 },
 { ...gameEvidence, id: 'denison', date: '2026-10-23', opponent: 'Denison', passingYards: 245, passingTouchdowns: 2 },
 { ...gameEvidence, id: 'celina', date: '2026-10-30', opponent: 'Celina', passingYards: 227, passingTouchdowns: 3, signature: 'ANSWERING THE MOMENT.' },
];
export function verifiedGames(items: PerformanceGame[]): PerformanceGame[] {
 return items.filter(item => sourceBacked(item) && Number.isFinite(Date.parse(item.date)) && item.date.startsWith('2026-') && item.passingYards !== null && Number.isFinite(item.passingYards) && item.passingTouchdowns !== null && Number.isInteger(item.passingTouchdowns));
}
export function gameDate(date: string) { return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`)); }
