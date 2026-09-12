const styles={
 evelyn:{coat:'#285559',light:'#51837f',dark:'#183337',hair:'#463126',shine:'#805b42',skin:'#e4baa0',scarf:'#9a4654',pants:'#514940',boots:'#48352a'},
 director:{coat:'#66645b',light:'#969183',dark:'#363d3c',hair:'#8a8475',shine:'#c0b8a0',skin:'#d6af94',scarf:'#beb4a0',pants:'#474744',boots:'#30312e'},
 lupin:{coat:'#344b4a',light:'#688580',dark:'#1b2f31',hair:'#332b27',shine:'#675345',skin:'#dfb79a',scarf:'#ddd5b4',pants:'#414d4b',boots:'#30312e'},
 billy:{coat:'#8b6848',light:'#bb9163',dark:'#4c3c31',hair:'#66422d',shine:'#a37a4c',skin:'#e1b28c',scarf:'#a34d44',pants:'#4b5b63',boots:'#563b28'},
 collector:{coat:'#c9c8b7',light:'#eeead8',dark:'#787f77',hair:'#777264',shine:'#c2bfae',skin:'#d5b9a4',scarf:'#989687',pants:'#8e958b',boots:'#53594f'},
 jack:{coat:'#62534b',light:'#968479',dark:'#352c2c',hair:'#322a27',shine:'#5b4640',skin:'#dad2ba',scarf:'#914a45',pants:'#363635',boots:'#292b2b'}
};
export function human(c,a,time){
 const role=a.role??(a.kind==='jack'?'jack':a.id==='puzzle'?'lupin':a.id??'evelyn'),p=styles[role]??styles.evelyn;
 const facing=a.facing??Math.PI/2,back=Math.sin(facing)<-.55,side=Math.abs(Math.cos(facing))>.72,flip=side&&Math.cos(facing)<0;
 const stride=a.moving?Math.sin((a.walk??time*9)):0,step=Math.round(stride*3),bob=a.moving?Math.round(Math.abs(stride)):0;
 c.save();c.translate(Math.round(a.x),Math.round(a.y));c.fillStyle='#01090b88';c.beginPath();c.ellipse(0,3,17,5,0,0,Math.PI*2);c.fill();
 if(a.invulnerable>0&&Math.floor(time*16)%2===0)c.globalAlpha=.55;
 if(flip)c.scale(-1,1);c.translate(0,-bob);
 const poly=(points,color)=>{c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fillStyle=color;c.fill();};
 const rect=(x,y,w,h,color)=>{c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),w,h);};
 const outline='#111c20',gold='#b79b61';
 // Separate hips, knees, ankles and boots retain a human silhouette at gameplay size.
 for(const [x,s]of [[side?-3:-6,step],[side?3:5,-step]]){
  poly([[x-3,-24],[x+4,-24],[x+3,-12+s],[x+2,-3+s],[x-4,-3+s],[x-4,-12+s]],outline);
  rect(x-2,-23,5,13+s,p.pants);rect(x-2,-11+s,5,9,p.boots);rect(x-3,-3+s,side?10:7,4,p.boots);rect(x-2,-9+s,4,1,gold);rect(x-3,1+s,side?10:7,1,outline);
 }
 // Far arm sits behind the chest; elbow and visible hand move opposite the legs.
 const arm=(x,s)=>{poly([[x-3,-43],[x+3,-41],[x+5,-31+s],[x+3,-23+s],[x-2,-23+s],[x-3,-31+s],[x-5,-37]],outline);poly([[x-2,-41],[x+2,-39],[x+3,-31+s],[x+1,-25+s],[x-1,-25+s],[x-2,-33+s],[x-3,-36]],p.coat);rect(x-1,-26+s,4,2,gold);rect(x,-23+s,4,6,p.skin);rect(x+3,-22+s,1,3,'#af7b66');};
 arm(side?-5:-12,-step);
 const half=side?7:10;
 poly([[-half,-44],[-4,-47],[5,-47],[half+2,-43],[half,-34],[half-2,-29],[half+4,-13],[2,-9],[0,-20],[-3,-10],[-half-4,-13],[-half+1,-30],[-half,-35]],outline);
 poly([[-half+1,-42],[-3,-45],[5,-44],[half,-41],[half-2,-29],[half+2,-14],[3,-12],[1,-25],[-3,-12],[-half-2,-14],[-half+3,-29]],p.coat);
 if(!back){poly([[-3,-43],[4,-43],[4,-30],[-3,-30]],'#e4d9b9');rect(0,-40,1,10,'#b0a185');poly([[-8,-43],[-4,-45],[-2,-35],[-6,-38]],p.light);poly([[6,-44],[9,-41],[5,-36],[3,-36]],p.light);rect(-4,-30,10,3,p.boots);rect(0,-30,4,3,gold);for(let y=-35;y<-13;y+=6)rect(5,y,2,2,gold);}
 else {rect(-1,-40,1,23,p.dark);rect(-7,-29,14,2,p.boots);rect(-7,-29,2,2,gold);rect(5,-29,2,2,gold);}
 rect(-half+2,-37,2,9,p.light);rect(-half,-20,2,7,p.light);rect(half-1,-24,2,10,p.dark);
 if(role==='evelyn'||role==='billy'){rect(-half-4,-28,7,10,outline);rect(-half-3,-27,5,8,'#816444');rect(-half-2,-25,3,2,gold);}
 arm(side?7:12,step);
 rect(-3,-49,6,5,'#bd8b74');rect(-2,-49,4,3,p.skin);
 // Shaped jaw, ears, hairline, eye whites and nose replace the old square face.
 poly([[-6,-64],[3,-65],[7,-62],[8,-55],[6,-49],[2,-46],[-4,-48],[-7,-53],[-8,-59]],outline);
 poly([[-5,-62],[3,-63],[6,-60],[6,-53],[3,-49],[-2,-49],[-5,-52],[-6,-58]],p.skin);
 rect(-6,-56,2,4,'#bd8b74');rect(-4,-52,2,2,'#d29e86');rect(1,-50,3,1,'#955e58');
 if(back){poly([[-7,-62],[-3,-65],[4,-64],[8,-60],[8,-49],[3,-47],[-6,-49],[-8,-55]],p.hair);rect(-5,-61,2,9,p.shine);rect(3,-60,2,11,p.shine);}
 else if(side){poly([[-7,-61],[-3,-65],[3,-64],[6,-61],[1,-59],[-1,-54],[-1,-49],[-6,-50]],p.hair);rect(-5,-61,2,9,p.shine);rect(3,-57,3,2,'#f4e8cd');rect(5,-57,1,2,'#253332');rect(6,-55,2,2,p.skin);rect(4,-52,2,1,'#a2695a');}
 else{poly([[-7,-61],[-3,-65],[4,-64],[7,-61],[4,-58],[0,-60],[-3,-57],[-5,-51],[-7,-50]],p.hair);rect(-5,-61,3,3,p.shine);rect(2,-63,2,2,p.shine);rect(-4,-56,3,2,'#f0e2cb');rect(2,-56,3,2,'#f0e2cb');rect(-2,-56,1,2,'#253d39');rect(2,-56,1,2,'#253d39');rect(0,-54,1,2,'#b97f69');rect(6,-59,2,9,p.hair);}
 if(role==='evelyn'){
  poly([[-8,-66],[-4,-70],[3,-70],[8,-67],[10,-62],[10,-51],[6,-47],[-7,-47],[-10,-52],[-10,-61]],outline);
  poly([[-7,-65],[-3,-69],[3,-69],[8,-65],[9,-58],[8,-49],[4,-47],[-7,-49],[-9,-54],[-9,-61]],p.hair);
  if(back){
   poly([[-6,-65],[-2,-68],[2,-68],[4,-64],[3,-52],[0,-49],[-5,-51]],'#644632');
   rect(-6,-63,2,10,'#976d4d');rect(3,-64,2,12,'#80563e');rect(-3,-51,6,2,'#322821');
  }else if(side){
   poly([[0,-65],[5,-64],[7,-61],[7,-58],[9,-56],[7,-54],[7,-52],[4,-49],[0,-50],[-2,-54],[-2,-61]],'#ebbea2');
   poly([[-7,-65],[-2,-68],[3,-67],[5,-65],[0,-62],[-2,-57],[-2,-50],[-7,-48],[-9,-54]],p.hair);
   rect(-6,-63,2,9,'#977052');rect(-3,-66,3,2,'#b18a65');
   rect(3,-62,3,1,'#72503e');rect(3,-59,4,2,'#fff0d9');rect(5,-59,2,2,'#3d645b');rect(6,-60,2,1,'#3d302c');rect(7,-59,1,1,'#3d302c');
   rect(4,-55,2,2,'#dca18e');rect(6,-53,2,1,'#a65560');rect(4,-51,2,1,'#f5d1b1');
  }else{
   poly([[-5,-64],[0,-66],[5,-64],[7,-60],[6,-55],[4,-51],[1,-49],[-2,-49],[-5,-52],[-6,-57]],'#edc2a6');
   poly([[-8,-63],[-4,-68],[3,-68],[7,-65],[4,-62],[0,-64],[-3,-61],[-6,-57],[-6,-50],[-9,-49]],p.hair);
   poly([[7,-64],[9,-61],[9,-51],[6,-48],[5,-51],[7,-56]],p.hair);
   rect(-5,-65,3,2,'#a57a55');rect(-7,-61,2,7,'#7e553e');rect(7,-59,1,7,'#9d7350');
   rect(-5,-61,4,1,'#76503d');rect(2,-61,3,1,'#76503d');
   rect(-5,-58,4,2,'#fff2df');rect(2,-58,4,2,'#fff2df');rect(-3,-58,2,2,'#467369');rect(2,-58,2,2,'#467369');
   rect(-6,-59,2,1,'#44332e');rect(5,-59,2,1,'#44332e');rect(-5,-58,1,1,'#44332e');rect(5,-58,1,1,'#44332e');
   rect(-5,-54,2,1,'#dda08f');rect(4,-54,2,1,'#dda08f');rect(0,-55,1,2,'#c58e74');
   rect(-1,-52,3,1,'#aa5964');rect(0,-51,2,1,'#d18b8a');rect(-1,-50,3,1,'#f3ceb0');
  }
 }
 if(role==='director'&&!back){rect(-3,-51,6,3,'#bdb5a2');rect(-5,-57,4,3,'#715f4e');rect(1,-57,4,3,'#715f4e');}
 if(role==='jack'&&!back){poly([[-5,-61],[5,-61],[6,-52],[2,-48],[-3,-50],[-6,-55]],'#ded9c5');rect(-4,-57,3,2,'#23272a');rect(2,-57,2,2,'#23272a');rect(0,-53,1,3,'#827a6c');}
 if(role==='billy'){poly([[-11,-61],[-9,-63],[-6,-64],[-5,-69],[4,-69],[7,-64],[12,-62],[10,-60]],outline);rect(-5,-68,10,5,p.coat);rect(-10,-63,21,3,p.light);}
 if(role==='lupin'){rect(-6,-71,12,10,outline);rect(-5,-70,10,8,p.dark);rect(-5,-64,10,2,gold);rect(-10,-61,20,3,outline);}
 if(role==='evelyn'){poly([[-6,-47],[6,-47],[8,-44],[2,-42],[-6,-43]],p.scarf);rect(-4,-46,7,1,'#c4787b');poly([[5,-44],[9,-43],[10+step,-33],[6+step,-35]],p.scarf);}
 if(role==='jack'){poly([[-6,-40],[6,-40],[8,-16],[-8,-16]],'#bab3a0');rect(-5,-38,2,19,'#e1d8c0');rect(4,-24,2,5,'#785752');}
 c.restore();
 if(a.armed||role==='jack')weapon(c,a,role);
}
function weapon(c,a,role){
 const handX=Math.cos(a.facing??Math.PI/2)<-.72?-12:12;
 c.save();c.translate(Math.round(a.x+handX),Math.round(a.y-22));c.rotate(a.facing??Math.PI/2);
 const w=a.weapon??0;c.fillStyle='#1a2325';c.fillRect(0,-3,5,7);
 if(role==='jack'||w===0){c.fillStyle='#d8e6dc';c.fillRect(4,-2,role==='jack'?15:25,3);c.fillStyle='#faf1ca';c.fillRect(4,-2,role==='jack'?14:24,1);c.fillStyle='#b99a5e';c.fillRect(3,-5,3,10);}
 if(w===1&&role!=='jack'){c.fillStyle='#adbeb7';c.fillRect(2,-3,15,5);c.fillStyle='#dfdfc7';c.fillRect(7,-3,10,1);c.fillStyle='#775338';c.fillRect(1,1,4,7);}
 if(w===2&&role!=='jack'){c.fillStyle='#98794c';c.fillRect(-9,-1,37,3);c.fillStyle='#c7b982';c.fillRect(23,-5,7,10);c.fillStyle='#8bedd1';c.fillRect(24,-3,5,6);}
 c.restore();if(a.swing>0&&a.weapon===0){c.save();c.translate(a.x,a.y);c.rotate(a.facing);c.strokeStyle='#f5e7b7';c.lineWidth=3;c.beginPath();c.arc(0,0,48,-1.3,1.3);c.stroke();c.restore();}
}
