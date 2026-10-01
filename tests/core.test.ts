import { describe, expect, it } from 'vitest';
import { detectPitch, midiHz, hzMidi, centsFrom, meanAbs, noteName } from '../src/music';
import { defaultProfile, getSteps, workNotes } from '../src/content';
import { gateCriteria, nextCursor, weeklyReport } from '../src/domain';
import type { Session } from '../src/model';

function sine(f:number,sampleRate=48000,noise=0){return Float32Array.from({length:4096},(_,i)=>.2*Math.sin(2*Math.PI*f*i/sampleRate)+noise*Math.sin(i*178.43));}
const session=(week:number,assessment:Session['assessment']={},throat:number|null=1):Session=>({id:String(week),cursor:{week,day:5,repeat:0},date:`2026-10-${String(week+1).padStart(2,'0')}T12:00:00Z`,seconds:900,throat,note:'',completed:[],skipped:[],assessment,status:'complete',interrupted:false});
describe('voice measurements',()=>{
 it.each([110,130.8128,220,440,880])('finds %s Hz without octave errors',f=>{const v=detectPitch(sine(f),48000);expect(v).not.toBeNull();expect(Math.abs(1200*Math.log2(v!.frequency/f))).toBeLessThan(5);});
 it('rejects silence and non-periodic noise',()=>{expect(detectPitch(new Float32Array(4096),48000)).toBeNull();let seed=12345;const noise=Float32Array.from({length:4096},()=>{seed=(seed*16807)%2147483647;return(seed/2147483647-.5)*.2;});expect(detectPitch(noise,48000)).toBeNull();});
 it('does not cancel opposite errors',()=>{expect(meanAbs([40,-40])).toBe(40);expect(meanAbs([])).toBeNull();});
 it('uses A4=440 and signed cents',()=>{expect(midiHz(69)).toBe(440);expect(midiHz(45)).toBe(110);expect(hzMidi(440)).toBe(69);expect(centsFrom(440*2**(20/1200),69)).toBeCloseTo(20);expect(noteName(48)).toBe('C3');});
});
describe('program and gates',()=>{
 it('covers the three baseline days, every training day and rest days',()=>{const p=defaultProfile();for(let day=0;day<3;day++)expect(getSteps({week:0,day,repeat:0},p).length).toBeGreaterThan(0);for(let week=1;week<=12;week++){for(let day=0;day<6;day++)expect(getSteps({week,day,repeat:0},p).length).toBeGreaterThan(0);expect(getSteps({week,day:6,repeat:0},p)).toEqual([]);}});
 it('includes full tests and extra gate tests only on gate weeks',()=>{const p=defaultProfile();for(let week=1;week<=12;week++){const ids=getSteps({week,day:5,repeat:0},p).map(s=>s.exercise);expect(ids.includes('T5')).toBe(week%3===0);expect(ids.includes('GATE')).toBe(week%3===0);}});
 it('uses four notes in week one and honours comfortable range',()=>{const p=defaultProfile();expect(workNotes(p,1)).toEqual([45,48,50,52]);expect(workNotes({...p,low:48,high:52},3)).toEqual([48,50,52]);});
 it('does not invent P',()=>{const steps=getSteps({week:7,day:0,repeat:0},defaultProfile());expect(steps.find(s=>s.exercise==='E9a')?.blocked).toBeTruthy();expect(steps.find(s=>s.exercise==='E9b')?.blocked).toBeTruthy();});
 it('advances baseline and preserves repeat week within its days',()=>{expect(nextCursor({week:0,day:2,repeat:0})).toEqual({week:1,day:0,repeat:0});expect(nextCursor({week:3,day:2,repeat:1})).toEqual({week:3,day:3,repeat:1});});
 it('never passes with missing data or incomplete trials',()=>{const rows=gateCriteria(3,0,[]);expect(rows.every(g=>g.state==='missing')).toBe(true);const rows2=gateCriteria(3,0,[session(3,{pitch:[{note:48,cents:0,method:'manual',at:''}]})]);expect(rows2[0].state).toBe('missing');});
 it('requires comparable text and handles zero baseline',()=>{const a=gateCriteria(3,0,[session(0,{errors:0,textVersion:'a'}),session(3,{errors:0,textVersion:'a'})]);expect(a.find(g=>g.label.includes('Diksiyon'))?.state).toBe('missing');const b=gateCriteria(9,0,[session(0,{errors:10,textVersion:'a'}),session(9,{errors:2,textVersion:'b'})]);expect(b.find(g=>g.label.includes('Diksiyon'))?.state).toBe('missing');});
 it('isolates retest data and does not report old full-test results in a mini week',()=>{const report=weeklyReport(defaultProfile(),[session(3,{errors:5}),session(4,{speech:48})],4);expect(report).toContain('T5 hata / S-Ş / kelime sonu: Ölçülmedi');expect(gateCriteria(6,1,[session(6,{transition:60})]).find(g=>g.label.includes('P yeniden'))?.state).toBe('missing');});
});
