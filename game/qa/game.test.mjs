import test from 'node:test';
import assert from 'node:assert/strict';
import {Game,freshFlags,parseSave} from '../src/engine.mjs';
import {roomIds,relics} from '../src/world.mjs';
import {spawnEnemy,hitEnemy,attack} from '../src/combat.mjs';
import {story} from '../src/story.mjs';
const playing=()=>{const g=new Game();g.start();return g;};
test('ordinary night starts unarmed and artifact gate is closed',()=>{
 const g=playing();g.player.x=855;g.player.y=490;g.interact();assert.equal(g.room.id,'office');assert.equal(g.flags.armed,false);
});
test('all objects have a collision-safe reachable interaction position',()=>{
 const g=playing();g.flags.relics=relics.map(r=>r.id);g.flags.reveal=true;g.flags.mind=true;
 for(const id of roomIds){g.enter(id);const seen=new Set(),queue=[[144,496]];
 if(id==='cathedral')queue[0]=[480,496];
 for(let i=0;i<queue.length;i++){const [x,y]=queue[i],key=x+','+y;if(seen.has(key)||g.solid(x,y))continue;seen.add(key);
 for(const [dx,dy] of [[16,0],[-16,0],[0,16],[0,-16]]){const a=x+dx,b=y+dy;if(!seen.has(a+','+b)&&!g.solid(a,b))queue.push([a,b]);}}
 const positions=[...seen].map(s=>s.split(',').map(Number));
 for(const o of g.room.objects)assert.ok(positions.some(([x,y])=>Math.hypot(x-o.x,y-o.y)<70),id+': '+o.id);
 }
});
test('diagonal movement is normalized and walls prevent crossing',()=>{
 const a=playing(),b=playing();a.update(.03,new Set(['KeyD']));b.update(.03,new Set(['KeyD','KeyW']));assert.ok(Math.abs(Math.hypot(b.player.x-145,b.player.y-490)-(a.player.x-145))<.001);
 a.player.x=60;for(let i=0;i<100;i++)a.update(.03,new Set(['KeyA']));assert.ok(a.player.x>=60);
});
test('dash is finite and prevents a hit only during its invulnerability',()=>{
 const g=playing();g.player.invulnerable=0;g.dash();g.damage(30);assert.equal(g.player.hp,100);for(let i=0;i<20;i++)g.update(.03,new Set());g.damage(30);assert.equal(g.player.hp,70);
});
test('unarmed attacks cannot damage an enemy',()=>{
 const g=playing();g.enemies=[spawnEnemy({kind:'scarab',x:170,y:490})];attack(g);assert.equal(g.enemies[0].hp,50);
});
test('ink guardian requires staff and final boss requires both relics plus knife slot',()=>{
 const g=playing(),ink=spawnEnemy({kind:'ink',x:300,y:300}),boss=spawnEnemy({kind:'hastur',x:400,y:300});
 hitEnemy(g,ink,30,1);assert.equal(ink.hp,85);hitEnemy(g,ink,30,2);assert.equal(ink.hp,55);
 hitEnemy(g,boss,30,0);assert.equal(boss.hp,420);g.flags.relics=['cheon','knife'];hitEnemy(g,boss,30,2);assert.equal(boss.hp,420);hitEnemy(g,boss,30,0);assert.equal(boss.hp,390);
});
test('relic guardian blocks collection and checkpoint retains collected relic',()=>{
 const g=playing();g.enter('egypt');g.player.x=800;g.player.y=200;g.interact();assert.equal(g.flags.relics.length,0);
 g.enemies=[];g.interact();assert.deepEqual(g.flags.relics,['book']);g.player.invulnerable=0;g.damage(100);assert.equal(g.mode,'dead');g.retry();assert.deepEqual(g.flags.relics,['book']);assert.equal(g.player.hp,100);
});
test('save parser rejects malformed and unknown records',()=>{
 assert.equal(parseSave('{'),null);assert.equal(parseSave(JSON.stringify({version:1,room:'unknown',flags:freshFlags()})),null);const g=playing();assert.ok(parseSave(JSON.stringify(g.saved)));
});
test('six collected relics unlock collector and HAster revelation unlocks Holmes',()=>{
 const g=playing();g.flags.relics=relics.map(r=>r.id);g.enter('hub');g.mode='play';g.player.x=825;g.player.y=465;g.interact();assert.equal(g.room.id,'collector');
 let body='';story(g,'collector',(s,t,b)=>{body=b;});assert.equal(g.flags.reveal,true);assert.ok(body.includes('HAster'));assert.ok(g.room.objects.some(o=>o.to==='deduction'));
});
test('three correct deductions unlock chase; incorrect answer cannot progress',()=>{
 const g=playing();g.enter('deduction');let choices;story(g,'puzzle',(s,t,b,c)=>{choices=c;});choices[1][1]();assert.equal(g.flags.mind,false);choices[0][1]();choices[1][1]();choices[2][1]();assert.equal(g.flags.mind,true);
});
test('Watson relic distinguishes true ending from ordinary ending',()=>{
 for(const watch of [false,true]){const g=playing();g.flags.watch=watch;let title;story(g,'seal',(s,t)=>{title=t;});assert.equal(g.flags.ended,true);assert.equal(title,watch?'그의 이름은 셜록 홈즈였다':'끝나지 않은 마지막 기록');}
});
test('ordinary mobs do not lock doors or relics after guardian is defeated',()=>{
 const g=playing();g.enter('egypt');g.enemies=g.enemies.filter(e=>!e.guardian);assert.ok(g.enemies.length>0);g.player.x=810;g.player.y=165;g.interact();assert.ok(g.flags.relics.includes('book'));
 g.player.x=95;g.player.y=490;g.interact();assert.equal(g.room.id,'hub');
});
test('Billy quest collects records without fighting and rewards only all three',()=>{
 const g=playing();let choices;const show=(s,t,b,c)=>{choices=c;};story(g,'billy',show);choices[0][1]();assert.equal(g.flags.questActive,true);
 story(g,'scrapA',show);story(g,'scrapB',show);story(g,'billy',show);assert.equal(g.flags.questDone,false);story(g,'scrapC',show);story(g,'billy',show);assert.equal(g.flags.questDone,true);assert.ok(parseSave(JSON.stringify(g.saved)).flags.questDone);
});
test('book opens the return shortcut without requiring ordinary mob clearance',()=>{
 const g=playing();g.enter('egypt');g.player.x=840;g.player.y=485;g.interact();assert.equal(g.room.id,'egypt');g.flags.relics=['book'];g.interact();assert.equal(g.room.id,'water');
});
