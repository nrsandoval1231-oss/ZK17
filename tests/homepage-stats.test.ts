import test from 'node:test';
import assert from 'node:assert/strict';
import { homepageStatistics } from '../content/homepage-stats';
import type { StatLine } from '../content/site';
const row = (metric: StatLine['metric'], value: number, extra: Partial<StatLine> = {}): StatLine => ({id:metric!,label:metric!,metric,value,season:2026,gameCount:8,scope:'season-total',verified:true,published:true,source:'Owner verified season record',sourceDate:'2026-11-03',...extra});
test('empty or unverified records yield exactly four honest unavailable metrics',()=>{
 const result=homepageStatistics([row('passing-yards',2000,{verified:false})]);
 assert.deepEqual(result.map(x=>x.label),['TOTAL YARDS','TOTAL TD','QB RATING','COMP %']);
 assert.ok(result.every(x=>x.value===null));
});
test('season totals add passing and rushing exactly once and keep source rating definition',()=>{
 const result=homepageStatistics([row('passing-yards',2000),row('rushing-yards',300),row('passing-td',20),row('rushing-td',3),row('qb-rating',157.2,{ratingMethod:'NCAA passing efficiency'}),row('completion-percent',65.2),row('passing-yards',100,{season:2025})]);
 assert.deepEqual(result.map(x=>x.value),[2300,23,157.2,65.2]);
 assert.equal(result[2].note,'NCAA passing efficiency');
});
test('duplicates, mismatched games, unspecified scope and missing rating definition are withheld',()=>{
 assert.equal(homepageStatistics([row('passing-yards',2000),row('passing-yards',2000),row('rushing-yards',300)])[0].value,null);
 assert.equal(homepageStatistics([row('passing-td',20),row('rushing-td',3,{gameCount:7})])[1].value,null);
 assert.equal(homepageStatistics([row('qb-rating',100)])[2].value,null);
 assert.equal(homepageStatistics([row('completion-percent',65,{scope:undefined})])[3].value,null);
});
