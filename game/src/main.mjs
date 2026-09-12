import {Game,parseSave} from './engine.mjs';
import {render} from './render.mjs';
import {story} from './story.mjs';
import {Sound} from './audio.mjs';
import {makeRoom,relics,roomIds} from './world.mjs';
const $=id=>document.getElementById(id),canvas=$('world'),ctx=canvas.getContext('2d');
const dialog=$('dialog'),keys=new Set(),sound=new Sound(),reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const saveKey='backroomvania-v1';let g;let toastTimer;let stored=null;
try{stored=parseSave(localStorage.getItem(saveKey));}catch{$('save-status').textContent='이 브라우저에서는 자동 저장을 사용할 수 없습니다.';}
function toast(text){$('toast').textContent=text;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),3600);}
function show(speaker,title,body,choices){
 keys.clear();const previous=g.mode;g.mode='dialog';$('speaker').textContent=speaker;$('dialog-title').textContent=title;$('dialog-body').textContent=body;$('choices').replaceChildren();
 choices.forEach(([text,action])=>{const b=document.createElement('button');b.textContent=text;b.addEventListener('click',()=>{dialog.close();g.mode=previous==='dialog'?'play':previous;canvas.focus();action();});$('choices').append(b);});
 if(!dialog.open)dialog.showModal();$('choices').firstElementChild?.focus();
}
function event(e){
 switch(e.type){
 case 'toast':toast(e.text);break;
 case 'sound':sound.play(e.name);break;
 case 'save':try{localStorage.setItem(saveKey,JSON.stringify(e.data));$('save-status').textContent='기록 저장됨 · 방에 들어오면 생명 회복';}catch{$('save-status').textContent='자동 저장 불가 · 현재 실행에서는 재시작 가능';}break;
 case 'story':story(g,e.id,show);break;
 case 'relic':show('유물 기록',e.relic.name,`${e.relic.power}\n\n${e.relic.hint}\n\n${g.flags.relics.length} / 6 유물 회수${['cheon','knife'].includes(e.relic.id)?'\n최종전 장비 슬롯에 자동 장착했다.':''}`,[['다음 기록을 찾아서',()=>{}]]);break;
 case 'death':show('기록은 남아 있다','밤에 삼켜졌다','방에 들어온 순간부터 다시 시작합니다.\n이미 기록한 단서와 유물은 보존됩니다.',[['이 방에서 다시 일어난다',()=>g.retry()]]);break;
 case 'briefing':show('열람실 · 안전지대','아직 꺼지지 않은 불빛','문고리가 멈춘다. 루팡이 문에 인장을 붙인다.\n\n“여긴 안전하오. 빌리가 남긴 리볼버와 검, 그리고 유물 지팡이를 가져가시오.”\n\n1 검: 가까운 적을 베기\n2 리볼버: 빠른 원거리 사격\n3 지팡이: 먹의 망령에 유효\nSpace: 짧은 무적 회피\n\n북서쪽 이집트관에서 첫 유물을 찾아라.',[['무기를 챙긴다',()=>{}]]);break;
 case 'finale':show('세 번째 대결 · 근성','황색의 왕','천부인이 환각 속 본체를 고정한다.\n검 슬롯(1)이 아즈텍 심장적출검으로 바뀐다.\n\n황색 탄막의 빈틈으로 회피하고 가까이 붙어 지배를 끊어라.\n루팡이 출구를 붙잡는다. “끝까지 당신의 이름을 기억하시오.”',[['마지막 기록을 시작한다',()=>{}]]);break;
 case 'room':break;
 }
}
g=new Game(event);
function begin(saved){$('title-screen').hidden=true;$('hud').hidden=false;g.start(saved);canvas.focus();if(!saved)show('4월 30일 · 발푸르기스의 밤','마지막 정리','에블린 베일은 존경하는 기록관장과 유물을 정리하고 있었다.\n\nWASD / 방향키로 이동하고, 가까이에서 E로 조사하세요.\n먼저 목록 카드와 유물 받침 두 점을 정리합니다.',[['평소와 같은 밤을 시작한다',()=>{}]]);}
$('start').onclick=()=>{if(stored)show('새로운 기록','처음부터 시작할까요?','현재 자동 저장 기록이 새 게임으로 바뀝니다.',[['기존 기록을 유지한다',()=>{}],['새 밤을 시작한다',()=>begin(null)]]);else begin(null);};
$('continue').hidden=!stored;$('continue').onclick=()=>begin(stored);
$('sound').onclick=()=>{const on=sound.toggle();$('sound').textContent=on?'소리 끄기':'소리 켜기';$('sound').setAttribute('aria-pressed',String(on));};
function pause(){if(g.mode==='title'||dialog.open)return;show('기록 보관','잠시 멈춘 밤','WASD / 방향키 이동 · E 조사\nJ 또는 게임 화면 클릭 공격 · Space 회피\n1 / 2 / 3 무기 선택 · M 지도\n\n방 진입과 유물 획득 시 자동 저장됩니다.',[['계속하기',()=>{}],['이 방 다시 시작',()=>g.retry()]]);}
function journal(){if(g.mode==='title'||dialog.open)return;show('에블린 베일','유물 수첩',relics.map(r=>`${g.flags.relics.includes(r.id)?'◆':'◇'} ${r.name}\n${g.flags.relics.includes(r.id)?r.hint:'아직 회수하지 못했다.'}`).join('\n\n')+`\n\n단서: ${g.flags.rhast?'Rhast':'없음'}${g.flags.reveal?'\nTrash = HAster. 황색의 왕 Hastur와 별개 인물.':''}${g.flags.watch?'\n왓슨의 유물: 보관 중':''}`,[['수첩을 덮는다',()=>{}]]);}
function map(){if(g.mode==='title'||dialog.open)return;show('박물관 동선','기록한 문들',`현재: ${g.room.name}\n\n열람실 → 이집트 [사자의 서]\n열람실 → 침수 백룸 → 그리스 [도기]\n열람실 → 아시리아 [라마수]\n열람실 → 중국 → 인도 → 일본 [두루마리]\n일본 → 한국 [천부인] → 열람실\n열람실 → 안데스 → 아즈텍 [심장적출검]\n열람실 → 흰 수집가 → 홈즈 → 런던 브리지\n→ 빅벤 → 웨스트민스터 대성당\n\n방문: ${[...g.visited].map(id=>makeRoom(id,g.flags).name).join(' · ')}`,[['지도를 접는다',()=>{}]]);}
$('pause-button').onclick=pause;$('map-button').onclick=map;$('journal-button').onclick=journal;
for(const b of document.querySelectorAll('[data-weapon]'))b.onclick=()=>g.chooseWeapon(Number(b.dataset.weapon));
function press(code){if(g.mode!=='play')return;switch(code){case 'KeyE':g.interact();break;case 'Space':g.dash();break;case 'Digit1':case 'Digit2':case 'Digit3':g.chooseWeapon(Number(code.at(-1))-1);break;case 'KeyM':map();break;case 'Escape':pause();break;}}
window.addEventListener('keydown',e=>{if(e.code==='Escape'&&g.mode==='play')e.preventDefault();if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)&&!dialog.open)e.preventDefault();if(!e.repeat)press(e.code);if(g.mode==='play')keys.add(e.code);});
window.addEventListener('keyup',e=>keys.delete(e.code));
window.addEventListener('blur',()=>{keys.clear();if(g.mode==='play')pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();if(g.mode==='play')pause();}});
dialog.addEventListener('cancel',e=>{e.preventDefault();if($('dialog-title').textContent==='잠시 멈춘 밤')$('choices').firstElementChild.click();});
canvas.addEventListener('pointerdown',e=>{if(e.button!==0||g.mode!=='play')return;canvas.focus();keys.add('KeyJ');canvas.setPointerCapture(e.pointerId);});
for(const type of ['pointerup','pointercancel'])canvas.addEventListener(type,()=>keys.delete('KeyJ'));
for(const b of document.querySelectorAll('[data-key]')){
 b.addEventListener('pointerdown',e=>{e.preventDefault();b.setPointerCapture(e.pointerId);press(b.dataset.key);if(g.mode==='play')keys.add(b.dataset.key);});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,()=>keys.delete(b.dataset.key));
}
let last=performance.now(),uiTime=0;
function frame(now){const dt=(now-last)/1000;last=now;g.update(dt,keys);render(ctx,g,reduced);uiTime+=dt;
 if(uiTime>.1){uiTime=0;sound.music.setScene(g.room.id);$('room-name').textContent=g.room.name;$('chapter').textContent=g.room.chapter;$('objective').textContent=g.room.desc+(g.flags.questActive&&!g.flags.questDone?' · 빌리의 기록 '+['scrapA','scrapB','scrapC'].filter(k=>g.flags[k]).length+'/3':'');$('health').value=g.player.hp;$('dash').value=1-g.player.dashCooldown/1.2;$('relic-count').textContent=`${g.flags.relics.length} / 6`;
 for(const b of document.querySelectorAll('[data-weapon]')){b.disabled=!g.flags.armed;b.classList.toggle('selected',Number(b.dataset.weapon)===g.player.weapon);b.setAttribute('aria-pressed',String(Number(b.dataset.weapon)===g.player.weapon));}
 document.querySelector('[data-weapon="0"] span').textContent=g.flags.relics.includes('knife')?'심장적출검':'검';}
 requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
