export const relics=[
 {id:'book',name:'사자의 서',power:'깃털 걸음',hint:'침수된 백룸의 물을 건널 수 있다.'},
 {id:'pottery',name:'미노타우르스의 도기',power:'실의 표식',hint:'반복되는 방에서 진짜 문을 가려낸다.'},
 {id:'lamassu',name:'라마수',power:'문지기의 인장',hint:'동방 전시관의 봉인을 연다.'},
 {id:'scroll',name:'그림 두루마리',power:'먹의 시야',hint:'숨은 길과 고양이의 발자국을 드러낸다.'},
 {id:'cheon',name:'천부인',power:'본질 고정',hint:'장비 중 환각 뒤의 진짜 형체를 고정한다.'},
 {id:'knife',name:'아즈텍 심장적출검',power:'지배 절단',hint:'천부인과 함께 장비하면 하스터를 벨 수 있다.'}
];
const item=(id,label,x,y,type='inspect',extra={})=>({id,label,x,y,type,...extra});
const door=(label,x,y,to,need)=>item('door-'+to,label,x,y,'door',{to,need});
const enemy=(kind,x,y)=>({kind,x,y});
const base=(name,theme,desc)=>({name,theme,desc,objects:[],enemies:[],blocks:[],water:[],chapter:'대영박물관 · 기록 밖의 밤'});
export function makeRoom(id,flags){
 let r;
 switch(id){
 case 'office':
  r=base('장서고 위층 사무실','office',flags.mirror?'관장의 책상을 조사하라.':'유물 두 점을 정리하고 관장과 이야기하라.');
  r.objects=[item('artifact1','목록 카드',320,400),item('artifact2','유물 받침',480,220),item('director',flags.mirror?'움직이지 않는 손':'기록관장',710,235),door('지하 수장고',855,490,'basement','work')];
  r.blocks=[[96,144,144,64],[608,272,192,48],[304,272,224,48]];break;
 case 'basement':
  r=base('지하 수장고','store','기이한 무늬가 새겨진 거울을 찾아라.');
  r.objects=[door('위층 사무실',100,490,'office'),item('mirror','운반대의 거울',785,215)];
  r.blocks=[[192,160,64,256],[384,288,64,240],[576,144,64,256]];break;
 case 'escape':
  r=base('장서고 옆문','backroom','잭을 피해 동쪽 옆문으로! Space로 회피, E로 수레를 밀어라.');
  r.objects=[item('cart','책 수레 밀기',425,435),door('열람실 · 안전한 불빛',855,490,'hub')];
  r.blocks=[[256,112,64,288],[576,304,64,272]];r.enemies=[enemy('jack',100,220)];break;
 case 'hub':
  r=base('봉인된 열람실','hub','전시관의 유물을 모아 흰 수집가의 기록을 추적하라.');
  r.objects=[item('lupin','아르센 루팡',455,345),item('lamp','기록대 · 휴식',450,500),door('이집트관',125,170,'egypt'),door('침수 백룸',125,460,'water','book'),door('아시리아관',330,160,'assyria','pottery'),door('중국 · 종의 회랑',600,160,'china','lamassu'),door('안데스관',825,180,'andes','scroll'),door('흰 수집가의 방',825,465,'collector','all')];
  if(flags.relics.includes('scroll')&&!flags.watch)r.objects.push(item('cat','젖은 고양이 발자국',740,340));
  r.blocks=[[280,255,80,55],[580,255,80,55],[280,410,80,55],[580,410,80,55]];break;
 case 'egypt':
  r=base('이집트 · 저울의 방','egypt','돌아오는 저울의 불꽃을 피하고 수호자를 쓰러뜨려라.');
  r.objects=[door('열람실',95,490,'hub'),item('book','사자의 서',810,165,'relic')];
  r.blocks=[[270,210,64,96],[610,370,64,96],[446,288,64,64]];r.enemies=[enemy('anubis',650,220),enemy('scarab',390,450)];break;
 case 'water':
  r=base('기록 밖 · 반사 배수실','water','깃털 걸음으로 수면을 건너라. 거울 속 출구에는 발자국이 없다.');
  r.objects=[door('열람실',90,500,'hub'),door('발자국이 남은 문',825,170,'greek'),item('false','물속에 비친 문',825,470),item('note-water','젖은 쪽지',480,360)];
  r.water=[[190,130,560,175],[190,400,560,150]];r.blocks=[[400,140,64,125],[400,445,64,100]];break;
 case 'greek':
  r=base('그리스 · 도기의 미궁','greek','돌진 뒤 멈춘 미노타우르스를 검으로 공격하라.');
  r.objects=[door('반사 배수실',95,500,'water'),item('pottery','미노타우르스의 도기',820,165,'relic')];
  r.blocks=[[256,128,64,288],[560,304,64,272]];r.enemies=[enemy('minotaur',740,370)];break;
 case 'assyria':
  r=base('아시리아 · 다섯 번째 다리','assyria','문지기의 돌진을 유도하고 옆으로 피하라.');
  r.objects=[door('열람실',95,500,'hub'),item('lamassu','라마수의 인장',800,175,'relic')];
  r.blocks=[[224,224,64,64],[448,384,64,64],[672,224,64,64]];r.enemies=[enemy('lamassu',710,365),enemy('scarab',420,185)];break;
 case 'china':
  r=base('중국 · 울리지 않는 종','china','라마수의 인장이 동방 회랑을 열었다. 동쪽의 연꽃 문으로.');
  r.objects=[door('열람실',90,490,'hub'),door('인도 · 연꽃 회랑',835,200,'india'),item('bell','균열이 있는 청동 종',475,245)];
  r.blocks=[[240,180,80,128],[590,360,80,128]];r.enemies=[enemy('shade',690,270)];break;
 case 'india':
  r=base('인도 · 연꽃 회랑','india','그림자가 가라앉을 때 회랑을 건너라.');
  r.objects=[door('종의 회랑',90,490,'china'),door('일본 · 두루마리 방',835,190,'japan')];
  r.water=[[275,150,130,180],[530,365,130,180]];r.enemies=[enemy('shade',475,290)];break;
 case 'japan':
  r=base('일본 · 끝나지 않는 그림','japan','3번 유물 지팡이로 먹의 망령을 실체화하라.');
  r.objects=[door('연꽃 회랑',90,500,'india'),item('scroll','그림 두루마리',800,165,'relic'),door('한국 · 세 인장의 방',835,495,'korea','scroll')];
  r.blocks=[[250,270,96,64],[595,270,96,64]];r.enemies=[enemy('ink',475,230),enemy('ink',700,440)];break;
 case 'korea':
  r=base('한국 · 세 인장의 방','korea','도깨비의 예고를 읽고 천부인을 되찾아라.');
  r.objects=[door('두루마리 방',90,500,'japan'),item('cheon','천부인',790,175,'relic'),door('열람실 지름길',835,500,'hub')];
  r.blocks=[[240,200,64,128],[432,350,96,64],[656,200,64,128]];r.enemies=[enemy('dokkaebi',680,430),enemy('shade',420,210)];break;
 case 'andes':
  r=base('남미 · 안데스의 빈 계단','andes','흰 수집가의 운송장을 찾고 메소아메리카관으로 향하라.');
  r.objects=[door('열람실',90,500,'hub'),item('manifest','흰 옷의 수집가 · 운송장',430,215),door('아즈텍 · 심장의 방',835,185,'aztec','cheon')];
  r.blocks=[[250,300,96,160],[570,150,96,160]];r.enemies=[enemy('shade',700,400)];break;
 case 'aztec':
  r=base('아즈텍 · 심장의 방','aztec','붉은 제단의 맥박 사이로 들어가 수호자를 쓰러뜨려라.');
  r.objects=[door('안데스관',90,500,'andes'),item('knife','아즈텍 심장적출검',790,165,'relic'),door('열람실 지름길',835,500,'hub')];
  r.blocks=[[280,250,64,64],[600,250,64,64]];r.enemies=[enemy('jaguar',660,430),enemy('shade',430,180)];break;
 case 'collector':
  r=base('폐기된 수장고','store','흰 수집가에게 다가가라. 모은 유물들이 떨리고 있다.');
  r.objects=[door('열람실',90,500,'hub'),item('collector','흰 옷의 수집가',700,230)];r.blocks=[[240,180,96,128],[460,350,128,64]];
  if(flags.reveal)r.objects.push(door('홈즈 · 첫 번째 대결',835,490,'deduction'));break;
 case 'deduction':
  r=base('홈즈 · 증거의 거울','backroom','루팡의 질문에 답해 홈즈가 덧씌운 기록을 깨뜨려라.');
  r.objects=[item('puzzle','루팡 · 세 개의 증거',475,280),door('열람실',90,500,'hub')];
  if(flags.mind)r.objects.push(door('런던 브리지',835,490,'bridge'));break;
 case 'bridge':
  r=base('런던 브리지 · 두 번째 대결','bridge','황색의 파도를 피해 동쪽으로! 실의 표식이 진짜 홈즈를 가리킨다.');
  r.objects=[door('빅벤으로 이어지는 문',850,490,'clock'),item('false','거울 속 홈즈',840,170)];
  r.blocks=[[300,112,64,272],[600,352,64,224]];r.enemies=[enemy('pursuer',90,230)];break;
 case 'clock':
  r=base('빅벤 · 멈춘 열세 번째 종','clock','회전하는 황색 균열을 피하고 대성당의 문에 닿아라.');
  r.objects=[door('웨스트민스터 대성당',850,175,'cathedral')];r.blocks=[[256,300,96,128],[512,144,96,192],[704,400,64,128]];r.enemies=[enemy('pursuer',95,450)];break;
 case 'cathedral':
  r=base('웨스트민스터 대성당','cathedral','천부인과 심장적출검을 장비하고 1번 검으로 하스터를 공격하라.');
  r.objects=[];r.blocks=[[224,224,48,64],[688,224,48,64],[224,448,48,64],[688,448,48,64]];
  r.enemies=flags.bossDown?[]:[enemy('hastur',480,215)];
  if(flags.bossDown){r.desc='제단에서 E를 눌러 황색의 왕의 봉인을 완성하라.';r.objects=[item('seal','황색의 왕을 추방한다',480,200)];}break;
 default: throw new Error('Unknown room: '+id);
 }
 const questItems={egypt:['scrapA','운송 기록 · 1',150,275],water:['scrapB','운송 기록 · 2',480,345],china:['scrapC','운송 기록 · 3',735,490]};
 if(questItems[id]){const [key,label,x,y]=questItems[id];if(!flags[key])r.objects.push(item(key,label,x,y));}
 if(id==='hub')r.objects.push(item('billy','빌리 더 키드 · 의뢰',690,505));
 if(id==='egypt')r.objects.push(door('배수실 지름길',840,485,'water','book'));
 if(id==='greek')r.objects.push(door('열람실 지름길',840,485,'hub','pottery'));
 if(id==='assyria')r.objects.push(door('동방 회랑 지름길',840,485,'china','lamassu'));
 const guarded=r.objects.some(o=>o.type==='relic');
 r.enemies=r.enemies.map((e,i)=>({...e,guardian:guarded&&i===0}));
 if(['egypt','greek','assyria','korea','aztec'].includes(id))r.enemies.push(enemy('scarab',175,350));
 if(id==='water')r.enemies.push(enemy('shade',670,345));
 r.id=id;return r;
}
export const roomIds=['office','basement','escape','hub','egypt','water','greek','assyria','china','india','japan','korea','andes','aztec','collector','deduction','bridge','clock','cathedral'];
export const mapLinks=[['office','basement'],['office','escape'],['escape','hub'],['hub','egypt'],['hub','water'],['water','greek'],['hub','assyria'],['hub','china'],['china','india'],['india','japan'],['japan','korea'],['korea','hub'],['hub','andes'],['andes','aztec'],['aztec','hub'],['hub','collector'],['collector','deduction'],['deduction','bridge'],['bridge','clock'],['clock','cathedral']];
