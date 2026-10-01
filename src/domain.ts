import type { Assessment, Cursor, Profile, Session } from './model';
import { mean, meanAbs, noteName } from './music';
export type Criterion={label:string;state:'pass'|'fail'|'missing';detail:string};
export function aggregate(sessions:Session[],week:number,repeat?:number):Assessment {
 const result:Assessment={};
 for(const s of [...sessions].filter(s=>s.cursor.week===week&&(repeat===undefined||s.cursor.repeat===repeat)).sort((a,b)=>a.date.localeCompare(b.date))){
   for(const [k,v] of Object.entries(s.assessment)) if(v!==undefined) (result as Record<string,unknown>)[k]=v;
 }
 return result;
}
export function gateCriteria(week:number,repeat:number,sessions:Session[]):Criterion[] {
 if(![3,6,9,12].includes(week))return [];
 const a=aggregate(sessions,week,repeat),base=aggregate(sessions,0),rows:Criterion[]=[];
 const check=(label:string,value:boolean|null,detail:string)=>rows.push({label,state:value===null?'missing':value?'pass':'fail',detail});
 const pitch=a.pitch?.length?meanAbs(a.pitch.map(x=>x.cents)):null;
 if(week!==9) {const limit=week===3?35:week===6?30:25;const counts=new Map<number,number>();a.pitch?.forEach(t=>counts.set(t.note,(counts.get(t.note)||0)+1));const valid=counts.size>0&&[...counts.values()].every(n=>n>=3);check(`Nota sapması ≤ ${limit} cent`,pitch===null||!valid?null:pitch<=limit,pitch===null?'Ölçüm yok':`${pitch.toFixed(1)} cent · ${counts.size} nota; nota başına en az 3 deneme`);}
 if(week===3)check('25 sn kararlı humming',a.humming===undefined||a.stable===undefined?null:a.humming>=25&&a.stable,`${a.humming??'—'} sn · kararlılık elle değerlendirilir`);
 const relevant=sessions.filter(s=>s.cursor.week>week-3&&s.cursor.week<=week&&s.throat!==null);
 const covered=new Set(relevant.map(s=>s.cursor.week));
 const throat=week===3?mean(relevant.map(s=>s.throat!)):sessions.filter(s=>s.cursor.week===week&&s.cursor.repeat===repeat&&s.throat!==null).at(-1)?.throat??null;
 check(week===3?'Üç haftalık boğaz ortalaması ≤ 2':'Boğaz skoru ≤ 2',throat===null||(week===3&&covered.size<3)?null:throat<=2,throat===null?'Henüz kaydedilmedi':`${throat.toFixed(1)} / 10`);
 if(week===6){check('5 sıçramanın en az 3’ü ≤ 40 cent',!a.jumps||a.jumps.length<5?null:a.jumps.filter(v=>Math.abs(v)<=40).length>=3,`${a.jumps?.filter(v=>Math.abs(v)<=40).length??0}/5 uygun giriş`);check('P yeniden değerlendirildi',a.transition===undefined?null:true,a.transition===undefined?'H6 T2 kaydı gerekli':noteName(a.transition));}
 if(week===9)check('5 geçişin en az 4’ü çatlamasız',a.crossings===undefined?null:a.crossings>=4,`${a.crossings??'—'}/5 · kullanıcı değerlendirmesi`);
 if(week!==6){const pct=week===3?30:week===9?50:60;const comparable=base.errors!==undefined&&a.errors!==undefined&&base.textVersion===a.textVersion;
 check(`Diksiyon hatasında en az %${pct} azalma`,!comparable||base.errors===0?null:((base.errors!-a.errors!)/base.errors!*100)>=pct,!comparable?'Aynı metinle başlangıç ve güncel ölçüm gerekli':base.errors===0?'Başlangıç hatası 0; yüzde kriteri için elle uzman değerlendirmesi gerekli':`${base.errors} → ${a.errors} hata`);}
 if(week===12){check('Üç tekerlemede S/Ş ≤ 1',a.leakage===undefined?null:a.leakage<=1,`${a.leakage??'—'} hata`);check('20 dk sonunda rahatsızlık yok',a.symptomFree??null,'20 dk çalışma sonrası kullanıcı değerlendirmesi');check('Şarkı kıtası ±35 cent içinde',a.song??null,'Referans melodi ve kayıt üzerinden kullanıcı değerlendirmesi');}
 return rows;
}
export function nextCursor(c:Cursor):Cursor {
 if(c.week===0)return c.day<2?{...c,day:c.day+1}:{week:1,day:0,repeat:0};
 return c.day<6?{...c,day:c.day+1}:{week:Math.min(c.week+1,12),day:0,repeat:0};
}
export function weeklyReport(p:Profile,sessions:Session[],week:number,repeat=0) {
 const list=sessions.filter(s=>s.cursor.week===week&&s.cursor.repeat===repeat),a=aggregate(list,week),base=aggregate(sessions,0),ma=a.pitch?.length?meanAbs(a.pitch.map(t=>t.cents)):null;
 const shown=(v:unknown)=>v===undefined||v===null?'Ölçülmedi':String(v);
 const notes=[...new Set(a.pitch?.map(t=>t.note)||[])].map(n=>`${noteName(n)}: ${meanAbs(a.pitch!.filter(t=>t.note===n).map(t=>t.cents))?.toFixed(1)} cent`).join(' | ');
 return [`SES ATÖLYEM — HAFTA ${week}${repeat?` / TEKRAR ${repeat}`:''}`,`Tam seans: ${list.filter(s=>s.status==='complete').length} | Kısmi/durdurulan: ${list.filter(s=>s.status!=='complete').length}`,`Toplam süre: ${Math.round(list.reduce((a,s)=>a+s.seconds,0)/60)} dk`,`Boğaz ort.: ${shown(mean(list.filter(s=>s.throat!==null).map(s=>s.throat!))?.toFixed(1))}`,`T1 konuşma perdesi: ${a.speech===undefined?'Ölçülmedi':noteName(a.speech)}`,`T2 alt / P / üst: ${[a.low,a.transition,a.high].map(n=>n===undefined?'—':noteName(n)).join(' / ')}`,`T3: ${notes||'Ölçülmedi'}`,`Ortalama mutlak sapma: ${ma===null?'Ölçülmedi':ma.toFixed(1)+' cent'}`,`T4 en iyi süreler: ${(['ah','sss','zzz'] as const).map(k=>`${k}: ${a[k]?.length?Math.max(...a[k]!):'—'} sn`).join(' | ')}`,`T5 hata / S-Ş / kelime sonu: ${shown(a.errors)} / ${shown(a.leakage)} / ${shown(a.endings)}`,`Başlangıç hata: ${shown(base.errors)} | Metin: ${a.textVersion||'Ölçülmedi'}`,`Notlar: ${list.map(s=>s.note).filter(Boolean).join('; ')||'Yok'}`,...gateCriteria(week,repeat,sessions).map(g=>`${g.label}: ${g.state==='pass'?'Karşılandı':g.state==='fail'?'Karşılanmadı':'Veri eksik'} — ${g.detail}`),`Yöntem: ilk 0,5 sn güvenilir karelerin medyanı, denemelerin mutlak sapma ortalaması. P ve diksiyon kullanıcı değerlendirmesidir.`,`Profil: ${p.name||'Kişisel çalışma'}`].join('\n');
}
