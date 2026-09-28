export class Music{
 constructor(){this.context=null;this.enabled=false;this.cue='the-unwritten-archive';this.cache=new Map();this.current=null;this.generation=0;}
 attach(context){this.context=context;}
 setScene(room){const cue=['escape','bridge','clock','cathedral'].includes(room)?'the-thirteenth-bell':'the-unwritten-archive';if(cue===this.cue)return;this.cue=cue;if(this.enabled)this.start();}
 setEnabled(enabled){this.enabled=enabled;if(enabled)this.start();else{this.generation++;this.fadeOut();}}
 fadeOut(){if(!this.current)return;const {source,gain}=this.current,t=this.context.currentTime;gain.gain.cancelScheduledValues(t);gain.gain.setValueAtTime(gain.gain.value,t);gain.gain.linearRampToValueAtTime(0,t+.8);source.stop(t+.85);this.current=null;}
 async start(){
  if(!this.context)return;const generation=++this.generation,cue=this.cue;
  try{
   if(!this.cache.has(cue)){const response=await fetch(new URL('../music/'+cue+'.wav',import.meta.url));if(!response.ok)throw new Error('Music response '+response.status);this.cache.set(cue,await this.context.decodeAudioData(await response.arrayBuffer()));}
   if(generation!==this.generation||!this.enabled)return;
   this.fadeOut();const source=this.context.createBufferSource(),gain=this.context.createGain(),t=this.context.currentTime;
   source.buffer=this.cache.get(cue);source.loop=true;source.connect(gain);gain.connect(this.context.destination);gain.gain.setValueAtTime(0,t);gain.gain.linearRampToValueAtTime(.25,t+1.5);source.start();this.current={source,gain};
  }catch(error){console.warn('Background music unavailable:',error.message);}
 }
}
