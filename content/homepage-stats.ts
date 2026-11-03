import { publicStats, type StatLine } from './site';

/** One complete season, never a mixture of career, partial-game or playoff totals. */
export const homepageStatsSeason = 2026;
export type HomepageMetric = { label: string; value: number | null; note: string; sources: string[] };
export function homepageStatistics(records: StatLine[]): HomepageMetric[] {
 const rows = publicStats(records, homepageStatsSeason).filter(row => row.scope === 'season-total' && row.value >= 0);
 const one = (metric: StatLine['metric']) => {
  const matches = rows.filter(row => row.metric === metric);
  return matches.length === 1 ? matches[0] : undefined;
 };
 const total = (label: string, passing: StatLine['metric'], rushing: StatLine['metric']): HomepageMetric => {
  const a = one(passing), b = one(rushing);
  const complete = a && b && a.gameCount === b.gameCount;
  return {label, value: complete ? a.value + b.value : null, note: complete ? 'Passing + rushing' : 'Awaiting verified season totals', sources: complete ? [a.source!, b.source!] : []};
 };
 const rating = one('qb-rating'), completion = one('completion-percent');
 const definedRating = rating?.ratingMethod?.trim();
 return [
  total('TOTAL YARDS', 'passing-yards', 'rushing-yards'),
  total('TOTAL TD', 'passing-td', 'rushing-td'),
  {label:'QB RATING', value: definedRating ? rating!.value : null, note: definedRating || 'Awaiting verified rating and calculation', sources: definedRating ? [rating!.source!] : []},
  {label:'COMP %', value: completion && completion.value <= 100 ? completion.value : null, note:'Completion percentage', sources: completion && completion.value <= 100 ? [completion.source!] : []},
 ];
}
