import {writeFileSync} from 'node:fs';
import {dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const rate=32000,root=dirname(fileURLToPath(import.meta.url));
const chords=[[38,50,57,62,65],[34,46,53,58,62],[41,53,60,65,68],[33,45,52,57,61]];
function compose(name,bpm,intense){
 const beat=60/bpm,duration=32*beat,length=Math.round(duration*rate),left=new Float32Array(length),right=new Float32Array(length);
 function note(midi,start,seconds,volume,kind,pan=0){
  const hz=440*2**((midi-69)/12),n=Math.round(seconds*rate),offset=Math.round(start*rate);
  for(let i=0;i<n;i++){
   const t=i/rate,a=Math.min(1,t/(kind==='pad'?.8:.018)),release=Math.min(1,(seconds-t)/(kind==='pad'?1.3:.5));
   const phase=t*hz*Math.PI*2;let value;
   switch(kind){
    case 'bell':value=(Math.sin(phase)+.4*Math.sin(phase*2.76)+.18*Math.sin(phase*5.4))*Math.exp(-t*1.2);break;
    case 'pad':value=(Math.sin(phase)+.24*Math.sin(phase*2)+.16*Math.sin(phase*1.003))*(.85+.15*Math.sin(t*3));break;
    case 'pulse':value=(Math.sin(phase)+.3*Math.sin(phase*2)+.17*Math.sin(phase*3))*Math.exp(-t*4);break;
    case 'drum':value=Math.sin(2*Math.PI*(48*t+10*(1-Math.exp(-t*20))))*Math.exp(-t*12);break;
    default:value=Math.sin(phase)+.45*Math.sin(phase*2)+.2*Math.sin(phase*4);break;
   }
   const sample=value*a*release*volume,index=(offset+i)%length;
   left[index]+=sample*Math.sqrt((1-pan)/2);right[index]+=sample*Math.sqrt((1+pan)/2);
  }
 }
 for(let bar=0;bar<8;bar++){
  const chord=chords[Math.floor(bar/2)],start=bar*4*beat;
  chord.forEach((pitch,i)=>note(pitch,start,5*beat,.065,'pad',(i-2)*.25));
  note(chord[0]-12,start,4*beat,.1,'organ',0);
  const melody=[chord[3]+12,chord[2]+12,chord[4]+12,chord[3]+12];
  for(let j=0;j<4;j++){
   note(melody[j],start+j*beat,1.9*beat,intense?.045:.035,'bell',j%2?.45:-.45);
   if(intense){note(chord[1]+(j%2?7:0),start+j*beat,.7*beat,.13,'pulse',-.2);note(36,start+j*beat,.4,.13,'drum',0);note(chord[2],start+(j+.5)*beat,.45*beat,.065,'pulse',.3);}
  }
 }
 for(const channel of [left,right]){
  const dry=channel.slice();for(const [delay,gain]of [[.19,.2],[.41,.15],[.73,.11],[1.17,.08],[1.73,.05]]){const d=Math.round(delay*rate);for(let i=0;i<length;i++)channel[(i+d)%length]+=dry[i]*gain;}
 }
 let peak=0;for(let i=0;i<length;i++)peak=Math.max(peak,Math.abs(left[i]),Math.abs(right[i]));
 const bytes=Buffer.alloc(44+length*4);bytes.write('RIFF');bytes.writeUInt32LE(bytes.length-8,4);bytes.write('WAVEfmt ',8);bytes.writeUInt32LE(16,16);bytes.writeUInt16LE(1,20);bytes.writeUInt16LE(2,22);bytes.writeUInt32LE(rate,24);bytes.writeUInt32LE(rate*4,28);bytes.writeUInt16LE(4,32);bytes.writeUInt16LE(16,34);bytes.write('data',36);bytes.writeUInt32LE(length*4,40);
 for(let i=0;i<length;i++){bytes.writeInt16LE(Math.round(left[i]/peak*23000),44+i*4);bytes.writeInt16LE(Math.round(right[i]/peak*23000),46+i*4);}
 writeFileSync(join(root,name+'.wav'),bytes);console.log(name,duration.toFixed(2)+' seconds',bytes.length+' bytes');
}
compose('the-unwritten-archive',60,false);
compose('the-thirteenth-bell',90,true);
