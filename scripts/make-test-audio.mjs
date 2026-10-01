import { mkdirSync, writeFileSync } from 'node:fs';
const rate=48000,seconds=8,samples=rate*seconds,buffer=Buffer.alloc(44+samples*2);
buffer.write('RIFF',0);buffer.writeUInt32LE(buffer.length-8,4);buffer.write('WAVEfmt ',8);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(1,22);buffer.writeUInt32LE(rate,24);buffer.writeUInt32LE(rate*2,28);buffer.writeUInt16LE(2,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(samples*2,40);
for(let i=0;i<samples;i++)buffer.writeInt16LE(Math.round(8000*Math.sin(2*Math.PI*130.81278265*i/rate)),44+i*2);
mkdirSync('tests/fixtures',{recursive:true});writeFileSync('tests/fixtures/voice.wav',buffer);
