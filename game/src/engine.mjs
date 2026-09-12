import {makeRoom,roomIds,relics} from './world.mjs';
import {spawnEnemy,updateCombat,hurtPlayer,attack} from './combat.mjs';
export function freshFlags(){return {work:0,directorTalk:false,artifact1:false,artifact2:false,mirror:false,rhast:false,armed:false,relics:[],watch:false,reveal:false,mind:false,bossDown:false,ended:false,questActive:false,questDone:false,scrapA:false,scrapB:false,scrapC:false};}
export function parseSave(raw){
 try{const s=JSON.parse(raw);if(s.version!==1||!roomIds.includes(s.room)||!s.flags||!Array.isArray(s.flags.relics))return null;
 const f=freshFlags();for(const k of Object.keys(f)){if(k==='relics'){if(!s.flags.relics.every(id=>relics.some(r=>r.id===id)))return null;f.relics=[...new Set(s.flags.relics)];}else if(typeof s.flags[k]===typeof f[k])f[k]=s.flags[k];else return null;}
 if(!Number.isInteger(f.work)||f.work<0||f.work>2)return null;return {version:1,room:s.room,flags:f};
 }catch{return null;}
}
export class Game{
 constructor(emit=()=>{}){this.emit=emit;this.flags=freshFlags();this.mode='title';this.player={x:140,y:480,hp:100,facing:0,weapon:0,invulnerable:0,attackCooldown:0,dashCooldown:0,dashTime:0,swing:0,walk:0};this.time=0;this.shake=0;this.particles=[];this.effects=[];this.shots=[];this.visited=new Set();this.enter('office',false);}
 start(saved){this.flags=saved?structuredClone(saved.flags):freshFlags();this.visited=new Set();this.mode='play';this.enter(saved?.room??'office');}
 enter(id,save=true){
 this.room=makeRoom(id,this.flags);this.visited.add(id);this.enemies=this.room.enemies.map(spawnEnemy);this.shots=[];this.effects=[];this.particles=[];
 this.player.x=id==='cathedral'?480:145;this.player.y=id==='escape'?435:490;this.player.hp=100;this.player.invulnerable=1;this.player.dashTime=0;this.player.dashCooldown=0;
 if(id==='hub'&&!this.flags.armed){this.flags.armed=true;this.emit({type:'briefing'});}
 if(id==='cathedral'&&!this.flags.bossDown)this.emit({type:'finale'});
 if(save)this.checkpoint();this.emit({type:'room'});
 }
 refreshRoom(){this.room=makeRoom(this.room.id,this.flags);}
 checkpoint(){this.saved={version:1,room:this.room.id,flags:structuredClone(this.flags)};this.emit({type:'save',data:this.saved});}
 retry(){this.mode='play';this.flags=structuredClone(this.saved.flags);this.enter(this.saved.room);}
 solid(x,y,r=12){
 if(x-r<48||x+r>912||y-r<112||y+r>578)return true;
 if(this.room.blocks.some(([bx,by,w,h])=>x+r>bx&&x-r<bx+w&&y+r>by&&y-r<by+h))return true;
 if(!this.flags.relics.includes('book')&&this.room.water.some(([bx,by,w,h])=>x+r>bx&&x-r<bx+w&&y+r>by&&y-r<by+h))return true;
 return false;
 }
 move(actor,dx,dy){if(!this.solid(actor.x+dx,actor.y))actor.x+=dx;if(!this.solid(actor.x,actor.y+dy))actor.y+=dy;}
 update(dt,input){
 if(this.mode!=='play')return;dt=Math.min(dt,.035);this.time+=dt;const p=this.player;
 p.invulnerable=Math.max(0,p.invulnerable-dt);p.attackCooldown=Math.max(0,p.attackCooldown-dt);p.dashCooldown=Math.max(0,p.dashCooldown-dt);p.dashTime=Math.max(0,p.dashTime-dt);p.swing=Math.max(0,p.swing-dt);this.shake=Math.max(0,this.shake-dt);
 let dx=(input.has('KeyD')||input.has('ArrowRight')?1:0)-(input.has('KeyA')||input.has('ArrowLeft')?1:0);
 let dy=(input.has('KeyS')||input.has('ArrowDown')?1:0)-(input.has('KeyW')||input.has('ArrowUp')?1:0);
 const length=Math.hypot(dx,dy);if(length){dx/=length;dy/=length;p.facing=Math.atan2(dy,dx);p.walk+=dt*10;}
 if(p.dashTime>0){dx=Math.cos(p.facing);dy=Math.sin(p.facing);}
 this.move(p,dx*(p.dashTime>0?440:155)*dt,dy*(p.dashTime>0?440:155)*dt);
 if(input.has('KeyJ'))attack(this);
 updateCombat(this,dt);
 for(const x of this.particles){x.life-=dt;x.y-=dt*25;}this.particles=this.particles.filter(x=>x.life>0);
 for(const x of this.effects)x.life-=dt;this.effects=this.effects.filter(x=>x.life>0);
 }
 dash(){const p=this.player;if(this.mode!=='play'||p.dashCooldown>0)return;p.dashCooldown=1.2;p.dashTime=.2;p.invulnerable=Math.max(p.invulnerable,.3);this.emit({type:'sound',name:'dash'});}
 nearest(){return this.room.objects.filter(o=>Math.hypot(o.x-this.player.x,o.y-this.player.y)<76).sort((a,b)=>Math.hypot(a.x-this.player.x,a.y-this.player.y)-Math.hypot(b.x-this.player.x,b.y-this.player.y))[0];}
 interact(){
 if(this.mode!=='play')return;const o=this.nearest();if(!o){this.emit({type:'toast',text:'빛나는 물체나 문 가까이에서 E로 조사하세요.'});return;}
 if(o.type==='door'){
  const unlocked=!o.need||(o.need==='work'?this.flags.work===2:o.need==='all'?this.flags.relics.length===6:this.flags.relics.includes(o.need));
  if(!unlocked){this.emit({type:'toast',text:o.need==='work'?'유물 두 점을 정리하고 관장과 이야기해야 한다.':o.need==='all'?'여섯 유물의 공명이 필요하다.':`${relics.find(r=>r.id===o.need).name}의 힘이 필요하다.`});return;}
  if(this.room.id==='office'&&!this.flags.mirror&&!this.flags.directorTalk){this.emit({type:'story',id:'director'});return;}
  this.enter(o.to);return;
 }
 if(o.type==='relic'){
  if(this.flags.relics.includes(o.id)){this.emit({type:'toast',text:'이미 기록한 유물이다.'});return;}
  if(this.enemies.some(e=>e.guardian)){this.emit({type:'toast',text:'수호자의 봉인이 남아 있다. 표식이 있는 수호자를 쓰러뜨려라. 잡몹은 피해서 지나갈 수 있다.'});return;}
  this.flags.relics.push(o.id);this.player.hp=100;this.checkpoint();this.emit({type:'relic',relic:relics.find(r=>r.id===o.id)});return;
 }
 this.emit({type:'story',id:o.id});
 }
 chooseWeapon(n){if(!this.flags.armed)return;this.player.weapon=n;this.emit({type:'sound',name:'select'});}
 damage(n){hurtPlayer(this,n);}
}
