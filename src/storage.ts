import { openDB } from 'idb';
import JSZip from 'jszip';
import type { State, Recording } from './model';
import { defaultProfile } from './content';
const db = () => openDB('ses-atolyem',1,{upgrade(db){db.createObjectStore('state');db.createObjectStore('recordings',{keyPath:'id'});}});
export const initialState=():State=>({profile:defaultProfile(),sessions:[],draft:null});
export const loadState=async():Promise<State> => (await(await db()).get('state','current'))||initialState();
export const saveState=async(state:State)=>{await(await db()).put('state',state,'current');};
export const allRecordings=async():Promise<Recording[]> => (await(await db()).getAll('recordings')).sort((a,b)=>b.date.localeCompare(a.date));
export const saveRecording=async(r:Recording)=>{await(await db()).put('recordings',r);};
export const deleteRecording=async(id:string)=>{await(await db()).delete('recordings',id);};
export function download(blob:Blob,name:string){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
const digest=async(blob:Blob)=>[...new Uint8Array(await crypto.subtle.digest('SHA-256',await blob.arrayBuffer()))].map(x=>x.toString(16).padStart(2,'0')).join('');
export async function exportBackup(state:State) {
 const zip=new JSZip(),records=await allRecordings();
 const metadata=[];
 for(const r of records){const {blob,...meta}=r;const file=`audio/${r.id}.bin`;zip.file(file,await blob.arrayBuffer());metadata.push({...meta,file,bytes:blob.size,sha256:await digest(blob)});}
 zip.file('manifest.json',JSON.stringify({format:'ses-atolyem',version:1,created:new Date().toISOString(),state,recordings:metadata},null,2));
 return zip.generateAsync({type:'blob',compression:'DEFLATE'});
}
export async function inspectBackup(file:File):Promise<{state:State;recordings:Recording[]}> {
 if(file.size>512*1024*1024)throw new Error('Yedek 512 MB sınırını aşıyor.');
 const zip=await JSZip.loadAsync(file),manifest=zip.file('manifest.json');if(!manifest)throw new Error('Geçerli bir Ses Atölyem yedeği değil.');
 const m=JSON.parse(await manifest.async('string'));
 if(m.format!=='ses-atolyem'||m.version!==1||!Array.isArray(m.recordings)||!m.state?.profile||!Array.isArray(m.state.sessions))throw new Error('Yedek biçimi veya sürümü desteklenmiyor.');
 const p=m.state.profile;
 if(typeof p.name!=='string'||typeof p.reading!=='string'||!Array.isArray(p.tongueTwisters)||!p.tongueTwisters.every((v:unknown)=>typeof v==='string')||!p.cursor||!Number.isInteger(p.cursor.week)||p.cursor.week<0||p.cursor.week>12||!Number.isInteger(p.cursor.day)||p.cursor.day<0||p.cursor.day>6||!Number.isInteger(p.cursor.repeat)||p.cursor.repeat<0||p.cursor.repeat>2||!Number.isFinite(p.low)||!Number.isFinite(p.high)||p.low>p.high)throw new Error('Profil verisi geçersiz.');
 for(const s of m.state.sessions)if(typeof s.id!=='string'||!s.cursor||typeof s.date!=='string'||!Number.isFinite(s.seconds)||!Array.isArray(s.completed)||!Array.isArray(s.skipped)||!s.assessment)throw new Error('Seans verisi geçersiz.');
 const recordings:Recording[]=[];let bytes=0;const ids=new Set<string>();
 for(const r of m.recordings){if(typeof r.id!=='string'||ids.has(r.id)||typeof r.file!=='string'||typeof r.mime!=='string'||!r.mime.startsWith('audio/')||!Array.isArray(r.markers)||!Number.isFinite(r.bytes)||r.bytes<0)throw new Error('Kayıt bilgisi geçersiz.');ids.add(r.id);bytes+=r.bytes;if(bytes>512*1024*1024)throw new Error('Açılmış yedek çok büyük.');const entry=zip.file(r.file);if(!entry)throw new Error('Yedekte eksik ses dosyası var.');const blob=new Blob([await entry.async('arraybuffer')],{type:r.mime});if(blob.size!==r.bytes||await digest(blob)!==r.sha256)throw new Error('Ses dosyası bütünlük kontrolü başarısız.');recordings.push({...r,blob});}
 return {state:{...m.state,draft:null},recordings};
}
export async function restoreBackup(data:{state:State;recordings:Recording[]},current:State,mode:'replace'|'merge') {
 const database=await db();let next=data.state;
 if(mode==='merge'){const map=new Map(current.sessions.map(s=>[s.id,s]));data.state.sessions.forEach(s=>{if(!map.has(s.id))map.set(s.id,s);});next={...current,sessions:[...map.values()]};}
 const tx=database.transaction(['state','recordings'],'readwrite');
 if(mode==='replace')await tx.objectStore('recordings').clear();
 for(const r of data.recordings) {if(mode==='replace'||!await tx.objectStore('recordings').get(r.id))await tx.objectStore('recordings').put(r);}
 await tx.objectStore('state').put(next,'current');await tx.done;return next;
}
export async function clearData(){const database=await db();const tx=database.transaction(['state','recordings'],'readwrite');await tx.objectStore('recordings').clear();await tx.objectStore('state').clear();await tx.done;}
