import {roomBackdrop,doorSprite} from './scenery.mjs';
import {character,artifact} from './sprites.mjs';
export function render(c,g,reduced=false){
 c.save();if(g.shake>0&&!reduced)c.translate(Math.sin(g.time*90)*3,Math.cos(g.time*75)*2);
 roomBackdrop(c,g.room,g.time,reduced);
 for(const o of g.room.objects){
  if(o.type==='door'){const locked=o.need&&(o.need==='all'?g.flags.relics.length<6:o.need==='work'?g.flags.work<2:!g.flags.relics.includes(o.need));doorSprite(c,o,locked,g.time);}
  else if(o.type==='relic')artifact(c,o,g.time,g.flags.relics.includes(o.id));
  else if(['director','lupin','collector','puzzle','billy'].includes(o.id)){
   if(o.id==='director'&&g.flags.mirror){c.fillStyle='#43373c';c.fillRect(o.x-20,o.y-4,38,13);c.fillStyle='#d3b8a0';c.fillRect(o.x-27,o.y,10,5);}
   else character(c,{...o,kind:'human',color:o.id==='collector'?'#d4d1be':o.id==='lupin'||o.id==='puzzle'?'#5f7b73':'#9a8767'},g.time);
  }else if(o.id==='cat'){c.fillStyle='#b0aaa0';c.fillRect(o.x-9,o.y-10,18,10);c.fillRect(o.x+6,o.y-16,8,8);c.fillRect(o.x+7,o.y-20,2,5);c.fillRect(o.x+12,o.y-20,2,5);c.fillRect(o.x-15,o.y-14,7,3);}
  else if(o.id==='mirror'||o.id==='false'){doorSprite(c,o,false,g.time);}
  else{c.fillStyle=o.id==='cart'?'#877353':'#626953';c.fillRect(o.x-16,o.y-14,32,22);c.fillStyle='#d2c7a1';c.fillRect(o.x-11,o.y-17,22,5);c.fillStyle='#97ceb1';c.fillRect(o.x-3,o.y-23,6,4);}
  if(o.type==='door'||o.type==='relic'||['lupin','puzzle','director','billy'].includes(o.id))label(c,o.label,o.x,o.y+34,'#c9ccba',11);
 }
 for(const e of g.enemies){
 if(e.guardian)label(c,'◆ 유물 수호자',e.x,e.y-58,'#e2bc73',10);
 if(e.windup>0){c.fillStyle='#b349433f';c.strokeStyle='#ffae82';c.lineWidth=2;c.beginPath();c.arc(e.target.x,e.target.y,e.kind==='hastur'?85:62,0,Math.PI*2);c.fill();c.stroke();}
 }
 const actors=[...g.enemies.map(a=>({a,hero:false})),{a:{...g.player,armed:g.flags.armed},hero:true}].sort((a,b)=>a.a.y-b.a.y);
 for(const {a,hero} of actors){character(c,a,g.time,hero);if(!hero&&Number.isFinite(a.hp)){c.fillStyle='#121c20';c.fillRect(a.x-20,a.y-49,40,4);c.fillStyle='#c08474';c.fillRect(a.x-20,a.y-49,40*Math.max(0,a.hp/a.maxHp),4);}}
 for(const s of g.shots){c.fillStyle=s.enemy?'#dfbd64':s.weapon===2?'#8af4c9':'#fff1c5';c.shadowColor=c.fillStyle;c.shadowBlur=8;c.beginPath();c.arc(s.x,s.y,s.weapon===2?6:3,0,Math.PI*2);c.fill();c.shadowBlur=0;}
 for(const e of g.effects){c.globalAlpha=Math.min(1,e.life*3);c.strokeStyle=e.color;c.lineWidth=3;c.beginPath();c.arc(e.x,e.y,e.r*(1-e.life),0,Math.PI*2);c.stroke();}c.globalAlpha=1;
 for(const p of g.particles)label(c,p.text,p.x,p.y,p.color,16);
 const near=g.nearest();if(near&&g.mode==='play'){c.fillStyle='#0a1719ec';c.fillRect(g.player.x-80,g.player.y+40,160,25);label(c,'[ E ] '+near.label,g.player.x,g.player.y+57,'#eeddb9',11);}
 const vignette=c.createRadialGradient(480,335,150,480,335,570);vignette.addColorStop(0,'#00000000');vignette.addColorStop(1,'#020b127d');c.fillStyle=vignette;c.fillRect(0,0,960,640);
 if(g.flags.relics.includes('pottery')&&['water','bridge'].includes(g.room.id)){c.setLineDash([5,9]);c.strokeStyle='#d5c78866';c.beginPath();c.moveTo(145,490);c.lineTo(480,350);c.lineTo(825,g.room.id==='water'?170:490);c.stroke();c.setLineDash([]);}
 c.restore();
}
function label(c,text,x,y,color,size){c.font=`${size}px system-ui, sans-serif`;c.textAlign='center';c.fillStyle='#071113';c.fillText(text,x+1,y+1);c.fillStyle=color;c.fillText(text,x,y);}
