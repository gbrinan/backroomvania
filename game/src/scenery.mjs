import {paintedFloor,architecture,propDetail} from './art.mjs';
const palettes={office:['#37382e','#454337','#645944'],store:['#27342f','#35413a','#53624f'],hub:['#31423e','#3b4b42','#736f52'],egypt:['#554833','#62513a','#a08b5e'],greek:['#3a4647','#485355','#8b9790'],assyria:['#394447','#455156','#8c9291'],china:['#3d3433','#4a3d37','#8e6251'],india:['#35403a','#424c3d','#898666'],japan:['#303d3d','#3c4948','#87948a'],korea:['#354544','#435452','#8aa69b'],andes:['#40413a','#4f5046','#929178'],aztec:['#3e3531','#4d4038','#927152'],backroom:['#4d4b32','#5a5439','#938356'],water:['#203938','#294341','#668a80'],bridge:['#2c393c','#35474a','#6b8385'],clock:['#373930','#45483a','#a29463'],cathedral:['#363b36','#41483f','#848b70']};
export function roomBackdrop(c,room,time,reduced){
 const p=palettes[room.theme]??palettes.store;c.fillStyle='#071113';c.fillRect(0,0,960,640);
 c.fillStyle=p[0];c.fillRect(32,96,896,496);
 for(let y=112;y<578;y+=32)for(let x=48;x<912;x+=32){
 const hash=(x*13+y*31)%17;c.fillStyle=hash<7?p[1]:p[0];c.fillRect(x,y,31,31);
 c.fillStyle='#bcb99a0c';c.fillRect(x+2,y+2,27,1);c.fillStyle='#060d122a';c.fillRect(x,y+30,32,2);
 if(hash<4){c.fillStyle='#a2a18a18';c.fillRect(x+9,y+12,2,1);c.fillRect(x+21,y+23,5,1);}
 }
 paintedFloor(c,room.theme);
 if(['hub','office','cathedral'].includes(room.theme)){
  c.fillStyle=room.theme==='office'?'#603a37':'#294c48';c.fillRect(382,112,196,466);
  c.strokeStyle='#b6a77766';c.lineWidth=2;c.strokeRect(390,120,180,450);
  for(let y=140;y<560;y+=40){c.strokeStyle='#c6b66e24';c.beginPath();c.moveTo(480,y-12);c.lineTo(498,y);c.lineTo(480,y+12);c.lineTo(462,y);c.closePath();c.stroke();}
 }
 for(const pool of room.water)water(c,pool,time,reduced);
 if(room.theme==='bridge'){water(c,[0,0,960,95],time,reduced);water(c,[0,592,960,48],time,reduced);}
 c.fillStyle=p[2];c.fillRect(32,80,896,20);c.fillStyle=p[1];c.fillRect(32,48,896,34);
 for(let x=48;x<920;x+=64){c.fillStyle='#00000040';c.fillRect(x,52,2,27);c.fillStyle='#c8c8a322';c.fillRect(x+4,54,54,2);}
 c.fillStyle='#111e21';c.fillRect(32,100,896,10);c.fillStyle=p[2];c.fillRect(32,100,16,494);c.fillRect(912,100,16,494);c.fillRect(32,580,896,14);
 c.fillStyle='#080f14aa';c.fillRect(48,110,864,12);c.fillRect(48,112,12,466);c.fillRect(48,568,864,12);
 for(let x=110;x<900;x+=180){
  if(['backroom','water','store'].includes(room.theme))mirror(c,x,86,time);
  else{c.fillStyle='#1a2b2c';c.fillRect(x-19,49,38,38);c.fillStyle=p[2];c.fillRect(x-22,46,44,5);c.fillRect(x-22,83,44,5);c.fillStyle='#b6ad7750';c.fillRect(x-2,51,3,31);}
 }
 architecture(c,room,p);
 for(const [x,y,w,h] of room.blocks){
 c.fillStyle='#00000060';c.fillRect(x+9,y+10,w,h);c.fillStyle=p[0];c.fillRect(x,y,w,h);c.fillStyle=p[2];c.fillRect(x,y-13,w,13);c.fillStyle=p[1];c.fillRect(x+3,y,w-6,h-4);c.fillStyle='#c6c9ac30';c.fillRect(x+3,y-12,w-6,2);
 if(['office','store','hub','backroom'].includes(room.theme)){for(let yy=y+4;yy<y+h-8;yy+=24){for(let xx=x+5;xx<x+w-5;xx+=9){c.fillStyle=['#666b51','#855744','#476862','#9b8252'][(xx+yy)%4];c.fillRect(xx,yy,6,16);}c.fillStyle='#a0906660';c.fillRect(x+3,yy+17,w-6,3);}}
 else {c.strokeStyle='#c9c49b44';c.strokeRect(x+9,y+10,w-18,h-20);for(let yy=y+18;yy<y+h-10;yy+=16){c.fillStyle='#c1bc8f40';c.fillRect(x+w/2-6,yy,12,3);}}
 }
 propDetail(c,room,p);
 for(const x of [72,888])for(const y of [140,550])lamp(c,x,y);
}
function water(c,[x,y,w,h],time,reduced){
 c.fillStyle='#071a20';c.fillRect(x,y,w,h);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();
 for(let i=0;i<8;i++){let inset=i*12;c.strokeStyle=`rgba(84,134,128,${.35-i*.037})`;c.lineWidth=2;c.strokeRect(x+inset+10,y+inset/2+5,w-inset*2-20,h-inset-10);}
 for(let yy=y+12;yy<y+h;yy+=19){let shift=reduced?0:Math.sin(time+yy*.04)*8;c.strokeStyle='#78ada51c';c.beginPath();c.moveTo(x+15+shift,yy);c.lineTo(x+w-15-shift,yy);c.stroke();}
 c.restore();c.strokeStyle='#729286';c.lineWidth=3;c.strokeRect(x,y,w,h);c.strokeStyle='#031014';c.lineWidth=1;c.strokeRect(x+3,y+3,w-6,h-6);
}
function mirror(c,x,y,time){
 c.fillStyle='#1b292b';c.fillRect(x-21,y-38,42,44);for(let i=0;i<5;i++){c.strokeStyle=i===0?'#ab9264':`rgba(80,147,133,${.65-i*.1})`;c.strokeRect(x-20+i*3,y-38+i*3,40-i*6,44-i*6);}c.fillStyle='#81af9e3a';c.fillRect(x-12,y-32,2,26);
}
function lamp(c,x,y){
 const grad=c.createRadialGradient(x,y,2,x,y,90);grad.addColorStop(0,'#edba6127');grad.addColorStop(1,'#edba6100');c.fillStyle=grad;c.fillRect(x-90,y-90,180,180);
 c.fillStyle='#6f6341';c.fillRect(x-5,y-11,10,19);c.fillStyle='#f3d193';c.fillRect(x-3,y-8,6,8);c.fillStyle='#d4a65d';c.fillRect(x-7,y-13,14,3);
}
export function doorSprite(c,o,locked,time){
 c.save();c.translate(o.x,o.y);c.fillStyle='#050d10';c.fillRect(-20,-33,40,47);c.strokeStyle=locked?'#7c7563':'#b5a16c';c.lineWidth=3;c.strokeRect(-22,-35,44,49);
 for(let i=0;i<4;i++){c.strokeStyle=`rgba(90,177,162,${.4-i*.09})`;c.strokeRect(-16+i*3,-29+i*3,32-i*6,39-i*6);}
 c.fillStyle=locked?'#aa8272':'#8bd0b5';c.fillRect(-3,locked?-12:9,6,locked?10:3);
 c.restore();
}
