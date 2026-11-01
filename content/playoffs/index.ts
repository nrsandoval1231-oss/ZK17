import data from './verified.json';
import brandData from './brand.json';
import { applyObservation, createBracket, validateTournament, type Observation, type Source, type Team } from '@/lib/playoffs/tournament';

export const playoffBrand = brandData as {logo:string|null;originalPath:string|null;originalSha256:string|null;width:number|null;height:number|null;ownerApproved:boolean;mockupPath:string|null};
export function getTournament() {
 if(data.schemaVersion!==1||data.season!==2026||data.division!=='5A-DII')throw new Error('Unsupported playoff artifact');
 let tournament=createBracket();
 tournament.sources=data.sources as Source[];
 tournament.teams=(data.teams as Team[]).map(team=>({...team,logo:team.id==='anna'?(playoffBrand.ownerApproved?playoffBrand.logo:null):team.logo}));
 for(const observation of data.observations as Observation[])tournament=applyObservation(tournament,observation);
 validateTournament(tournament);
 return tournament;
}
export const verification = {checkedAt:data.checkedAt,scope:data.verificationScope};
export const teamInformation = {
 name:'Anna Coyotes',school:'Anna High School',location:'Anna, Texas',classification:'5A Division II',district:'District 4',region:'Region I',
 alignmentSourceId:'uil-alignment',coaching:null,seasonSchedule:null,
 officialUrl:'https://www.gocoyoteu.com/sport/football/boys/',
};
