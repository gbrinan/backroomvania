const images={};let revision=0;
for(const name of ['materials','museum-wall']){const img=new Image();img.src=new URL('../art/'+name+'.png',import.meta.url);img.onload=()=>{images[name]=img;revision++;};}
const cache=new Map();
const materials={office:0,store:0,hub:0,egypt:2,india:2,andes:2,aztec:2,backroom:3,china:0,japan:0,korea:1};
export function paintedFloor(c,theme){
 const image=images.materials;if(!image)return;
 const key=theme+revision;let surface=cache.get(key);
 if(!surface){surface=document.createElement('canvas');surface.width=864;surface.height=468;const p=surface.getContext('2d');p.imageSmoothingEnabled=false;const n=materials[theme]??1,w=image.width/2,h=image.height/2;
 for(let y=0;y<468;y+=256)for(let x=0;x<864;x+=256)p.drawImage(image,(n%2)*w,Math.floor(n/2)*h,w,h,x,y,256,256);
 p.fillStyle=theme==='water'?'#123b4355':'#07141620';p.fillRect(0,0,864,468);cache.set(key,surface);}
 c.drawImage(surface,48,112);
}
export function architecture(c,room,p){
 const theme=room.theme,img=images['museum-wall'];
 if(img&&['office','hub','store','cathedral'].includes(theme)){
  for(let x=32;x<928;x+=149)c.drawImage(img,0,0,img.width,img.height,x,8,149,100);
 }
 c.save();c.strokeStyle=p[2];c.lineWidth=2;
 for(const x of [48,904]){c.fillStyle=p[1];c.fillRect(x,112,8,465);c.fillStyle=p[2];for(const y of [114,270,430,565]){c.fillRect(x-3,y,14,5);}}
 if(['china','japan','korea'].includes(theme)){
 for(let x=84;x<910;x+=80){c.fillStyle=theme==='korea'?'#448577':'#8a5048';c.fillRect(x-23,56,46,22);c.strokeRect(x-19,60,38,14);c.beginPath();c.moveTo(x,51);c.lineTo(x+10,67);c.lineTo(x,83);c.lineTo(x-10,67);c.closePath();c.stroke();}
 }else if(['egypt','andes','aztec','assyria','greek','india'].includes(theme)){
 for(let x=80;x<900;x+=54){c.beginPath();c.moveTo(x,61);c.lineTo(x+22,61);c.lineTo(x+22,78);c.lineTo(x+7,78);c.lineTo(x+7,69);c.lineTo(x+15,69);c.stroke();}
 }else if(theme==='clock'){
 for(let x=115;x<900;x+=170){c.beginPath();c.arc(x,65,25,0,Math.PI*2);c.stroke();for(let i=0;i<12;i++){const a=i*Math.PI/6;c.fillStyle=p[2];c.fillRect(x+Math.cos(a)*19-2,63+Math.sin(a)*19,3,3);}c.beginPath();c.moveTo(x-10,56);c.lineTo(x,65);c.lineTo(x+4,49);c.stroke();}
 }
 c.restore();
}
export function propDetail(c,room,p){
 for(const [x,y,w,h] of room.blocks){
 c.save();c.beginPath();c.rect(x,y-13,w,h+13);c.clip();
 const library=['office','store','hub','backroom'].includes(room.theme);
 if(library){for(let xx=x+5;xx<x+w;xx+=24){c.fillStyle='#dec38c44';c.fillRect(xx,y+7,2,8);c.fillStyle='#0a111744';c.fillRect(xx+4,y+2,2,h-4);}c.fillStyle='#bd9866';c.fillRect(x+2,y-12,w-4,2);}
 else{const g=c.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'#8ac4b333');g.addColorStop(.48,'#13292a55');g.addColorStop(.5,'#d1e7ce24');g.addColorStop(1,'#09131488');c.fillStyle=g;c.fillRect(x+5,y+3,w-10,h-8);c.strokeStyle='#bbcaad77';c.strokeRect(x+5,y+3,w-10,h-8);c.fillStyle=p[2];c.fillRect(x+w/2-12,y+h/2-6,24,10);c.fillStyle='#e2d3a7';c.fillRect(x+w/2-8,y+h/2-11,16,5);}
 c.restore();
 }
}
