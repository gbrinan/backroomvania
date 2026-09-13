import {Music} from './music.mjs';
export class Sound{
 constructor(){this.enabled=false;this.context=null;this.music=new Music();}
 toggle(){this.enabled=!this.enabled;if(this.enabled){this.context??=new AudioContext();this.context.resume();this.music.attach(this.context);this.play('select');}this.music.setEnabled(this.enabled);return this.enabled;}
 play(name){if(!this.enabled||!this.context)return;
 const c=this.context,t=c.currentTime,o=c.createOscillator(),v=c.createGain();
 const frequencies={sword:240,gun:100,staff:520,hit:170,hurt:65,dash:380,select:660,enemy:85};
 o.type=['gun','hurt','enemy'].includes(name)?'sawtooth':'triangle';o.frequency.setValueAtTime(frequencies[name]??300,t);o.frequency.exponentialRampToValueAtTime(45,t+.16);
 v.gain.setValueAtTime(.035,t);v.gain.exponentialRampToValueAtTime(.001,t+.19);o.connect(v);v.connect(c.destination);o.start(t);o.stop(t+.2);
 }
}
