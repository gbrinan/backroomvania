import {nextStep} from "./navigation.mjs";
export const stats={
 scarab:{hp:50,speed:70,damage:10,color:'#959c6a'},anubis:{hp:110,speed:67,damage:15,color:'#bfa65e'},
 minotaur:{hp:190,speed:55,damage:22,color:'#b28565'},lamassu:{hp:180,speed:53,damage:19,color:'#bbb597'},
 shade:{hp:70,speed:63,damage:12,color:'#817eaa'},ink:{hp:85,speed:76,damage:13,color:'#99b6c6'},
 dokkaebi:{hp:170,speed:70,damage:20,color:'#769ca0'},jaguar:{hp:200,speed:92,damage:20,color:'#c49c51'},
 jack:{hp:Infinity,speed:118,damage:28,color:'#dad7c5'},pursuer:{hp:Infinity,speed:125,damage:24,color:'#d2bd55'},
 hastur:{hp:420,speed:32,damage:22,color:'#d1b95c'}
};
export function spawnEnemy(source){const s=stats[source.kind];return {...source,...s,maxHp:s.hp,cooldown:1.2,windup:0,stun:0,flash:0,phase:0,homeX:source.x,homeY:source.y,aggro:false,target:{x:source.x,y:source.y}};}
export function hurtPlayer(g,damage){
 if(g.player.invulnerable>0||g.mode!=='play')return;
 g.player.hp=Math.max(0,g.player.hp-damage);g.player.invulnerable=1;g.shake=.18;
 g.emit({type:'sound',name:'hurt'});g.particles.push({x:g.player.x,y:g.player.y-35,text:'−'+damage,life:1,color:'#f2968c'});
 if(g.player.hp===0){g.mode='dead';g.emit({type:'death'});}
}
function strike(g,e){
 const p=g.player,d=Math.hypot(p.x-e.target.x,p.y-e.target.y);
 if(e.kind==='hastur'){
  for(let i=0;i<10;i++){const a=i*Math.PI/5+e.phase*.25;g.shots.push({x:e.x,y:e.y,vx:Math.cos(a)*150,vy:Math.sin(a)*150,life:4,enemy:true,damage:e.damage});}
  e.phase++;if(e.phase%3===0&&g.enemies.length<5)g.enemies.push(spawnEnemy({kind:'shade',x:750,y:420}));
 }else if(['minotaur','lamassu','jaguar','dokkaebi'].includes(e.kind)){
  if(d<65)hurtPlayer(g,e.damage);
  g.effects.push({x:e.target.x,y:e.target.y,r:62,life:.25,color:'#d66b70'});
 }else if(Math.hypot(p.x-e.x,p.y-e.y)<65)hurtPlayer(g,e.damage);
 g.emit({type:'sound',name:'enemy'});
}
export function updateCombat(g,dt){
 for(const e of g.enemies){
  e.flash=Math.max(0,e.flash-dt);e.stun=Math.max(0,e.stun-dt);e.cooldown-=dt;
  if(e.stun>0)continue;
  const pursuit=['jack','pursuer','hastur'].includes(e.kind);
  if(Math.hypot(g.player.x-e.x,g.player.y-e.y)<220)e.aggro=true;
  if(!pursuit&&!e.aggro){const x=e.homeX+Math.sin(g.time*.65+e.homeY)*36,y=e.homeY+Math.cos(g.time*.5+e.homeX)*24;const d=Math.hypot(x-e.x,y-e.y);if(d>2)g.move(e,(x-e.x)/d*e.speed*.35*dt,(y-e.y)/d*e.speed*.35*dt);continue;}
  if(e.windup>0){e.windup-=dt;if(e.windup<=0){strike(g,e);e.cooldown=e.kind==='hastur'?1.3:1.05;}continue;}
  const dx=g.player.x-e.x,dy=g.player.y-e.y,d=Math.hypot(dx,dy);
  if((d<75||e.kind==='hastur')&&e.cooldown<=0){e.windup=e.kind==='hastur'?.8:.65;e.target={x:g.player.x,y:g.player.y};continue;}
  if(d>38){e.routeTimer=(e.routeTimer??0)-dt;if(e.routeTimer<=0){e.waypoint=nextStep(g,e);e.routeTimer=.25;}const wx=e.waypoint.x-e.x,wy=e.waypoint.y-e.y,wd=Math.hypot(wx,wy);if(wd>2){const step=Math.min(wd,e.speed*dt);g.move(e,wx/wd*step,wy/wd*step);}}
 }
 for(const s of g.shots){
  s.life-=dt;const x=s.x+s.vx*dt,y=s.y+s.vy*dt;
  if(g.solid(x,y,3)){s.life=0;continue;}s.x=x;s.y=y;
  if(s.enemy){if(Math.hypot(s.x-g.player.x,s.y-g.player.y)<17){hurtPlayer(g,s.damage);s.life=0;}}
  else for(const e of g.enemies){if(Math.hypot(s.x-e.x,s.y-e.y)<26){hitEnemy(g,e,s.damage,s.weapon);s.life=0;break;}}
 }
 g.shots=g.shots.filter(s=>s.life>0);
 g.enemies=g.enemies.filter(e=>e.hp>0);
 if(g.room.id==='cathedral'&&!g.flags.bossDown&&!g.enemies.some(e=>e.kind==='hastur')){
  g.flags.bossDown=true;g.enemies=[];g.shots=[];g.refreshRoom();g.checkpoint();g.emit({type:'toast',text:'황색의 형체가 무너졌다. 제단에서 E를 눌러 봉인을 완성하라.'});
 }
}
export function hitEnemy(g,e,damage,weapon){
 if(!Number.isFinite(e.hp)){g.emit({type:'toast',text:'지금은 쓰러뜨릴 수 없다. 출구로 달려라!'});return;}
 if(e.kind==='ink'&&weapon!==2){g.emit({type:'toast',text:'먹의 망령은 유물 지팡이(3)로 공격해야 한다.'});return;}
 if(e.kind==='hastur'&&(!g.flags.relics.includes('cheon')||!g.flags.relics.includes('knife')||weapon!==0)){
  g.emit({type:'toast',text:'천부인으로 고정하고 심장적출검(1)으로 지배를 끊어야 한다.'});return;
 }
 e.aggro=true;e.hp-=damage;e.flash=.15;e.stun=.18;g.emit({type:'sound',name:'hit'});
 g.particles.push({x:e.x,y:e.y-28,text:String(damage),life:.6,color:'#ead5a1'});
 if(e.hp<=0){g.player.hp=Math.min(100,g.player.hp+7);g.effects.push({x:e.x,y:e.y,r:38,life:.5,color:'#d9b56d'});}
}
export function attack(g){
 const p=g.player;if(!g.flags.armed||p.attackCooldown>0)return;
 const w=p.weapon;p.attackCooldown=[.38,g.flags.questDone?.34:.52,.75][w];p.swing=.2;
 const closest=g.enemies.filter(e=>Math.hypot(e.x-p.x,e.y-p.y)<460).sort((a,b)=>Math.hypot(a.x-p.x,a.y-p.y)-Math.hypot(b.x-p.x,b.y-p.y))[0];
 let angle=closest?Math.atan2(closest.y-p.y,closest.x-p.x):p.facing;
 p.facing=angle;g.emit({type:'sound',name:['sword','gun','staff'][w]});
 if(w===0){for(const e of g.enemies){if(Math.hypot(e.x-p.x,e.y-p.y)<88)hitEnemy(g,e,g.flags.relics.includes('knife')?36:30,w);}}
 else g.shots.push({x:p.x,y:p.y-5,vx:Math.cos(angle)*(w===1?550:300),vy:Math.sin(angle)*(w===1?550:300),life:1.6,enemy:false,damage:w===1?25:43,weapon:w});
}
