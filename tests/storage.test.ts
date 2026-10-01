import 'fake-indexeddb/auto';
import { beforeEach, describe, expect, it } from 'vitest';
import JSZip from 'jszip';
import { clearData, exportBackup, inspectBackup, initialState, loadState, restoreBackup, saveState, saveRecording, allRecordings } from '../src/storage';
beforeEach(async()=>{await clearData();});
describe('local persistence and full backups',()=>{
 it('round-trips state and audio with checksums',async()=>{const s=initialState();s.profile.name='Deneme';await saveState(s);await saveRecording({id:'test-record',date:new Date().toISOString(),title:'Ses',seconds:2,mime:'audio/webm',blob:new Blob(['audio-bytes'],{type:'audio/webm'}),markers:[{time:1,text:'not'}]});expect((await loadState()).profile.name).toBe('Deneme');const blob=await exportBackup(s);const file=new File([blob],'backup.zip');const restored=await inspectBackup(file);expect(restored.recordings).toHaveLength(1);expect(await restored.recordings[0].blob.text()).toBe('audio-bytes');await clearData();await restoreBackup(restored,initialState(),'replace');expect((await allRecordings())[0].markers[0].text).toBe('not');});
 it('rejects tampered audio before changing stored data',async()=>{const s=initialState();await saveRecording({id:'r',date:'2026-10-01',title:'r',seconds:1,mime:'audio/webm',blob:new Blob(['original']),markers:[]});const blob=await exportBackup(s);const z=await JSZip.loadAsync(await blob.arrayBuffer());z.file('audio/r.bin','tampered');await expect(inspectBackup(new File([await z.generateAsync({type:'uint8array'})],'bad.zip'))).rejects.toThrow('bütünlük');expect((await allRecordings()).length).toBe(1);});
 it('rejects unsupported manifest versions',async()=>{const z=new JSZip();z.file('manifest.json',JSON.stringify({format:'ses-atolyem',version:99}));await expect(inspectBackup(new File([await z.generateAsync({type:'uint8array'})],'bad.zip'))).rejects.toThrow('desteklenmiyor');});
});
