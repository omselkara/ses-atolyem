export const midiHz = (m:number) => 440*2**((m-69)/12);
export const hzMidi = (f:number) => 69+12*Math.log2(f/440);
export const centsFrom = (f:number,m:number) => 1200*Math.log2(f/midiHz(m));
const names=['C','C♯','D','D♯','E','F','F♯','G','G♯','A','A♯','B'];
const turkish=['Do','Do♯','Re','Re♯','Mi','Fa','Fa♯','Sol','Sol♯','La','La♯','Si'];
export const noteName=(m:number)=>names[((Math.round(m)%12)+12)%12]+(Math.floor(Math.round(m)/12)-1);
export const noteTr=(m:number)=>turkish[((Math.round(m)%12)+12)%12];
export const mean=(a:number[])=>a.length?a.reduce((s,v)=>s+v,0)/a.length:null;
export const meanAbs=(a:number[])=>mean(a.filter(Number.isFinite).map(Math.abs));
export const median=(a:number[])=>{if(!a.length)return null;const b=[...a].sort((x,y)=>x-y);const i=Math.floor(b.length/2);return b.length%2?b[i]:(b[i-1]+b[i])/2;};
// YIN cumulative mean normalized difference. Confidence is periodicity, not a clinical measure.
export function detectPitch(input:Float32Array,sampleRate:number):{frequency:number;confidence:number;rms:number}|null {
 let energy=0;for(const x of input)energy+=x*x;const rms=Math.sqrt(energy/input.length);if(rms<0.008)return null;
 const min=Math.floor(sampleRate/1000),max=Math.min(Math.floor(sampleRate/65),Math.floor(input.length/2)-1);
 const diff=new Float32Array(max+1); const size=Math.floor(input.length/2);
 for(let tau=1;tau<=max;tau++){let sum=0;for(let i=0;i<size;i++){const delta=input[i]-input[i+tau];sum+=delta*delta;}diff[tau]=sum;}
 let running=0;diff[0]=1;
 for(let tau=1;tau<=max;tau++){running+=diff[tau];diff[tau]=running?diff[tau]*tau/running:1;}
 let tau=min;for(;tau<max;tau++){if(diff[tau]<0.12){while(tau+1<max&&diff[tau+1]<diff[tau])tau++;break;}}
 if(tau>=max)return null;
 const left=diff[tau-1],mid=diff[tau],right=diff[tau+1],den=2*(2*mid-right-left);
 const refined=tau+(den?(right-left)/den:0);
 return {frequency:sampleRate/refined,confidence:1-mid,rms};
}
