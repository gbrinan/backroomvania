export function story(g,id,show){
 const note=(title,body,after=()=>{})=>show('에블린의 기록',title,body,[['기록을 덮는다',after]]);
 switch(id){
 case 'artifact1':case 'artifact2':
  if(g.flags[id]){note('정리가 끝난 유물','분류 번호와 받침이 정확하다.');break;}
  g.flags[id]=true;g.flags.work++;g.checkpoint();
  note(id==='artifact1'?'목록 카드를 맞추다':'받침을 바로 놓다',`익숙한 종이의 냄새. 창밖에는 런던의 비가 내린다.\n\n정리한 유물 ${g.flags.work} / 2${g.flags.work===2?'\n관장님께 오늘의 정리가 끝났다고 말씀드리자.':''}`);break;
 case 'director':
  if(g.flags.mirror){
   g.flags.rhast=true;
   show('발푸르기스의 밤','Rhast','창문이 열려 있다. 거울들은 모두 바닥을 향해 쓰러져 있다.\n책상 뒤, 관장의 손이 더는 움직이지 않는다. 면도날의 흔적.\n\n손끝에 남은 글자: Rhast\n\n복도에서 칼이 접히는 소리가 들린다.',[['옆문으로 달아난다',()=>g.enter('escape')]]);break;
  }
  if(g.flags.work<2){show('기록관장','평소와 같은 밤','“이 두 점만 정리하면 오늘 일은 끝이겠군. 자네 기록이 제일 정확하니까.”',[['유물 정리를 계속한다',()=>{}]]);break;}
  g.flags.directorTalk=true;g.checkpoint();
  show('에블린 & 기록관장','없는 직원','“Trash는 언제 돌아온대요? 갑자기 휴가를 내버리니…”\n“Trash? 그런 직원은 없네.”\n\n관장은 목록에서 눈을 떼고 묻는다.\n“…떠나기 전에, 자네에게 무슨 말을 했지?”\n\n“지하의 거울을 장서고로 가져다 달랬어요.”',[['지하의 거울을 찾는다',()=>{}]]);break;
 case 'mirror':
  if(g.flags.mirror){note('차가운 거울','위층으로 돌아가야 한다.');break;}
  g.flags.mirror=true;g.refreshRoom();g.checkpoint();
  show('지하 수장고','꺼진 불','거울 운반대가 움직인다. 무늬의 끝이 수면처럼 늘어진다.\n\n바람. 모든 불꽃이 한쪽으로 눕는다.\n유리를 긁는 소리 뒤로, 위층에서 비명이 울린다.',[['계단으로 돌아간다',()=>g.emit({type:'sound',name:'hurt'})]]);break;
 case 'cart':
  g.enemies.forEach(e=>{e.stun=3;e.x=Math.min(e.x,350);});g.emit({type:'toast',text:'수레가 잭의 길을 막았다. 오른쪽 기둥의 위쪽으로 돌아 옆문으로!'});break;
 case 'lamp':g.player.hp=100;g.checkpoint();note('기록은 지워지지 않는다','상처를 정리했다. 이 불빛과 지름길은 변하지 않는다.\n생명 회복 · 현재 방에서 다시 시작할 수 있다.');break;
 case 'billy':{
  const count=['scrapA','scrapB','scrapC'].filter(k=>g.flags[k]).length;
  if(g.flags.questDone){note('수리된 리볼버','빌리가 고개를 끄덕인다. “탄창은 이제 말썽 없을 거야.”\n리볼버 재사용 시간이 0.52초에서 0.34초로 줄었다.');break;}
  if(count===3){g.flags.questDone=true;g.flags.questActive=true;g.checkpoint();show('빌리 더 키드','세 장의 운송 기록','“이 필체… 흰 수집가가 지나간 길이군. 잘했어.”\n빌리가 리볼버의 실린더를 손본다.\n\n퀘스트 완료 · 리볼버 사격 간격 감소',[['보상을 받는다',()=>{}]]);break;}
  show('빌리 더 키드','흩어진 운송 기록','“이집트관, 침수 백룸, 중국 회랑에 운송 기록을 흘렸어. 세 장만 찾아줘. 리볼버는 내가 손봐줄게.”\n\n적을 모두 쓰러뜨릴 필요는 없다. 기록을 챙겨 돌아오면 된다.\n현재 '+count+' / 3장',[['기록을 찾아보겠다',()=>{g.flags.questActive=true;g.checkpoint();}]]);break;}
 case 'scrapA':case 'scrapB':case 'scrapC':
  g.flags[id]=true;g.refreshRoom();g.checkpoint();note('운송 기록을 주웠다','흰 수집가의 서명이 남아 있다.\n\n수집 '+['scrapA','scrapB','scrapC'].filter(k=>g.flags[k]).length+' / 3장 · 열람실의 빌리에게 가져가자.');break;
 case 'lupin':show('아르센 루팡','박물관은 문을 기억한다','“여섯 유물이 서로를 부르고 있소. 이집트의 책부터 시작하지.\n깃털 걸음은 침수된 복도를, 도기의 실은 가짜 출구를, 라마수는 동방의 문을 열 것이오.”\n\n“안전한 불빛으로 돌아오시오. 모든 길을 한 번에 걸을 필요는 없으니.”',[['전시관으로 향한다',()=>{}]]);break;
 case 'false':g.player.x=145;g.player.y=490;g.emit({type:'toast',text:'같은 문. 같은 물방울. 반사 속에는 당신의 발자국이 없었다.'});break;
 case 'note-water':note('자국이 남는 길','수면 아래의 계단은 끝이 없다.\n하지만 먼지 위에는 한 사람의 발자국만 동쪽 위 문으로 이어져 있다.');break;
 case 'bell':note('울리지 않는 종','타종 흔적이 없는 종에서 소리가 난다. 동쪽 문 너머로 연꽃의 그림자가 흔들린다.');break;
 case 'manifest':note('수집가의 운송장','흰 장갑. 같은 필체. 목적지가 지워진 유물 여섯 점.\n뒷면에는 짧은 문장이 있다.\n“지시를 거부하면 내 이름이 다시 사라진다.”');break;
 case 'cat':
  g.flags.watch=true;g.refreshRoom();g.checkpoint();
  show('숨겨진 고양이','왓슨의 유물','젖은 발자국을 따라가자 고양이가 멈춘다.\n작은 상자 안에는 회중시계와 접힌 진료 기록이 있다.\n\n“그가 다른 목소리로 말하더라도, 내 친구의 이름을 불러주시오.”\n— 존 왓슨\n\n회중시계의 초침이 다시 움직인다.',[['왓슨의 유물을 보관한다',()=>{}]]);break;
 case 'collector':
  g.flags.reveal=true;g.refreshRoom();g.checkpoint();
  show('흰 옷의 수집가','Trash, 그리고 HAster','천부인의 빛 아래, 흰 장갑이 떨린다.\n\n“Trash는 내가 버린 이름이었어. 나는 HAster… 그가 시키는 대로 문을 열었어.”\n\n홈즈의 목소리가 거울을 통해 울린다. 수집가는 귀를 막는다.\n에블린은 알아본다. 명령을 내리는 자와 따르는 자는 다르다.\n\n루팡이 거울을 천으로 덮는다. “우리가 쫓던 것은 손이었군. 이제 그 손을 움직인 자에게 갑시다.”',[['홈즈의 거울로 향한다',()=>{}]]);break;
 case 'puzzle':deduction(g,show);break;
 case 'seal':
  g.flags.ended=true;g.checkpoint();g.mode='ending';
  show(g.flags.watch?'TRUE ENDING':'ENDING',g.flags.watch?'그의 이름은 셜록 홈즈였다':'끝나지 않은 마지막 기록',g.flags.watch?'왓슨의 시계가 한 번 울린다.\n“홈즈. 당신의 친구가 기다리고 있어요.”\n\n인간의 목소리가 황색의 왕에게서 갈라진다. 천부인이 홈즈를 붙잡고, 심장적출검이 하스터의 지배만 끊어낸다.\n\n루팡과 에블린은 황색의 왕을 거울 너머로 추방한다.\n새벽의 런던. 관장님의 자리는 비어 있다. HAster는 자신의 이름으로 증언을 남긴다.\n\n에블린은 마지막 기록을 지우지 않는다.':'황색의 형체는 무너졌지만 안쪽의 인간을 부를 목소리가 없다.\n에블린과 루팡은 홈즈와 하스터를 함께 봉인한다.\n\n런던에는 새벽이 온다. 박물관 어디선가 고양이 울음이 들린다.\n\n다음 밤에는 먹의 시야로 열람실의 발자국을 찾아보자.',[['열람실로 돌아가 다른 기록을 찾는다',()=>{g.flags.ended=false;g.flags.bossDown=false;g.mode='play';g.enter('hub');}],['엔딩을 남기고 쉬기',()=>{g.mode='ending';}]]);break;
 default:note('빈 기록','이곳에 남아 있던 이름이 지워졌다.');
 }
}
function deduction(g,show){
 if(g.flags.mind){show('루팡','거짓이 깨진 문','“그가 달아나고 있소. 런던 브리지로!”',[['뒤쫓는다',()=>{}]]);return;}
 const questions=[
 ['관장이 남긴 글자는?',['Rhast','Hastur','Trash'],0],
 ['흰 수집가에게서 확인한 것은?',['그가 황색의 왕이다','HAster는 홈즈에게 조종당한다','관장은 살아 있다'],1],
 ['하스터의 지배를 끊을 조합은?',['리볼버와 도기','사자의 서와 라마수','천부인과 아즈텍 심장적출검'],2]
 ];
 function ask(n){const [q,answers,right]=questions[n];show('첫 번째 대결 · 머리',q,'루팡이 거울 앞에 증거를 펼친다. 홈즈의 환각은 이미 본 기록을 바꿀 수 없다.',answers.map((a,i)=>[a,()=>{
 if(i!==right){g.emit({type:'toast',text:'거울이 같은 질문을 되풀이한다. 직접 본 기록을 떠올려라.'});ask(n);return;}
 if(n<2)ask(n+1);else{g.flags.mind=true;g.refreshRoom();g.checkpoint();show('루팡','거짓의 틈','“첫 번째는 우리가 이겼군. 이제 다리와 시계탑을 지나 그를 놓치지 마시오.”',[['두 번째 대결로',()=>{}]]);}
 }]))}
 ask(0);
}
