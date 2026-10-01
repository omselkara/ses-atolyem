import { detectPitch, midiHz } from './music';
export type AudioFrame={frequency:number|null;confidence:number;rms:number;time:number};
export class AudioEngine {
 context:AudioContext|null=null;stream:MediaStream|null=null;analyser:AnalyserNode|null=null;source:MediaStreamAudioSourceNode|null=null;
 interval:ReturnType<typeof setInterval>|null=null;recorder:MediaRecorder|null=null;chunks:Blob[]=[];recordStarted=0;mutedUntil=0;playing:OscillatorNode[]=[];recordMime='';
 async init(){if(!this.context||this.context.state==='closed')this.context=new AudioContext();if(this.context.state==='suspended')await this.context.resume();return this.context;}
 async microphone(onFrame:(f:AudioFrame)=>void){
  this.stopMic();if(!navigator.mediaDevices?.getUserMedia)throw new Error('Mikrofon için HTTPS veya localhost adresi gerekli.');
  const ctx=await this.init();
  try{this.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:false,noiseSuppression:false,autoGainControl:false},video:false});}catch{throw new Error('Mikrofon açılamadı. Tarayıcı iznini ve mikrofonun başka uygulamada kullanımını kontrol et.');}
  this.source=ctx.createMediaStreamSource(this.stream);this.analyser=ctx.createAnalyser();this.analyser.fftSize=4096;this.source.connect(this.analyser);
  const buffer=new Float32Array(4096);
  this.interval=setInterval(()=>{if(!this.analyser)return;this.analyser.getFloatTimeDomainData(buffer);let energy=0;for(const x of buffer)energy+=x*x;const rms=Math.sqrt(energy/buffer.length);const result=performance.now()<this.mutedUntil?null:detectPitch(buffer,ctx.sampleRate);onFrame({frequency:result?.frequency??null,confidence:result?.confidence??0,rms,time:performance.now()});},80);
 }
 async play(notes:number[],duration=0.8,gap=0.2){const ctx=await this.init();this.stopTone();this.mutedUntil=performance.now()+(notes.length*(duration+gap)+0.4)*1000;
  notes.forEach((m,i)=>{const osc=ctx.createOscillator(),gain=ctx.createGain(),at=ctx.currentTime+i*(duration+gap);osc.type='triangle';osc.frequency.value=midiHz(m);gain.gain.setValueAtTime(0,at);gain.gain.linearRampToValueAtTime(0.17,at+0.02);gain.gain.exponentialRampToValueAtTime(0.001,at+duration);osc.connect(gain);gain.connect(ctx.destination);osc.start(at);osc.stop(at+duration+0.02);osc.onended=()=>{osc.disconnect();gain.disconnect();};this.playing.push(osc);});
 }
 stopTone(){this.playing.forEach(o=>{try{o.stop();}catch{/* already ended */}});this.playing=[];}
 startRecording(){if(!this.stream)throw new Error('Önce mikrofonu aç.');if(!window.MediaRecorder)throw new Error('Bu tarayıcı ses kaydını desteklemiyor.');if(this.recorder?.state==='recording')return;
  this.recordMime=['audio/webm;codecs=opus','audio/mp4','audio/webm','audio/ogg;codecs=opus'].find(m=>MediaRecorder.isTypeSupported(m))||'';
  this.recorder=this.recordMime?new MediaRecorder(this.stream,{mimeType:this.recordMime}):new MediaRecorder(this.stream);this.chunks=[];this.recorder.ondataavailable=e=>{if(e.data.size)this.chunks.push(e.data);};this.recordStarted=performance.now();this.recorder.start(1000);
 }
 stopRecording():Promise<{blob:Blob;seconds:number;mime:string}|null>{return new Promise((resolve,reject)=>{const recorder=this.recorder;if(!recorder||recorder.state==='inactive'){resolve(null);return;}const seconds=(performance.now()-this.recordStarted)/1000;recorder.onerror=()=>reject(new Error('Ses kaydı tamamlanamadı.'));recorder.onstop=()=>{const mime=recorder.mimeType||this.recordMime||'audio/webm';const blob=new Blob(this.chunks,{type:mime});this.recorder=null;this.chunks=[];resolve({blob,seconds,mime});};recorder.stop();});}
 stopMic(){if(this.interval)clearInterval(this.interval);this.interval=null;this.source?.disconnect();this.source=null;this.analyser=null;this.stream?.getTracks().forEach(t=>t.stop());this.stream=null;}
 async close(){if(this.recorder?.state==='recording')await this.stopRecording();this.stopMic();this.stopTone();await this.context?.close();this.context=null;}
}
