const ink='#111c20',bone='#dfcda4',gold='#c9a85c';
function shape(c,points,color){c.fillStyle=color;c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();c.fill();}
export function creature(c,a,time){
 const color=a.flash>0?'#fff1d2':a.color??'#9aab94';
 c.save();c.translate(Math.round(a.x),Math.round(a.y));
 c.fillStyle='#02090bb0';c.beginPath();c.ellipse(0,7,23,8,0,0,Math.PI*2);c.fill();
 const step=Math.sin(time*6)*2;
 if(['scarab','jaguar','lamassu'].includes(a.kind)){
  if(a.kind==='scarab'){
   c.strokeStyle=bone;c.lineWidth=3;for(const side of [-1,1])for(let i=0;i<3;i++){c.beginPath();c.moveTo(side*10,-20+i*9);c.lineTo(side*22,-25+i*12+step);c.lineTo(side*26,-18+i*12);c.stroke();}
   shape(c,[[0,-38],[12,-29],[17,-13],[10,3],[-10,3],[-17,-13],[-12,-29]],ink);
   shape(c,[[-2,-31],[-10,-25],[-12,-10],[-6,-1],[-2,-1]],'#4e8b80');shape(c,[[2,-31],[10,-25],[12,-10],[6,-1],[2,-1]],'#a38b50');
   c.fillStyle=gold;c.fillRect(-6,-36,12,5);
  }else{
   for(const x of [-18,-7,9,20]){c.fillStyle=ink;c.fillRect(x,-8,6,17+step*(x%2?1:-1));c.fillStyle=bone;c.fillRect(x,5+step*(x%2?1:-1),7,3);}
   shape(c,[[-26,-24],[-16,-32],[17,-30],[27,-17],[22,-3],[-20,-3]],color);
   if(a.kind==='lamassu'){
    for(const side of [-1,1]){shape(c,[[side*6,-15],[side*38,-54],[side*31,-14],[side*16,-3]],bone);for(let i=0;i<4;i++){c.strokeStyle='#7c8c83';c.beginPath();c.moveTo(side*(11+i*4),-12);c.lineTo(side*(33-i*2),-44+i*7);c.stroke();}}
    shape(c,[[-12,-42],[-9,-53],[10,-53],[14,-41],[10,-21],[-9,-21]],bone);c.fillStyle=gold;c.fillRect(-12,-56,25,8);c.fillStyle=ink;for(let i=0;i<4;i++)c.fillRect(-8+i*5,-31,3,15);
   }else{shape(c,[[-22,-31],[-24,-42],[-12,-38],[10,-38],[20,-43],[22,-26],[12,-14],[-13,-15]],color);c.fillStyle=ink;for(let i=0;i<8;i++)c.fillRect(-18+i%4*11,-26+Math.floor(i/4)*12,4,3);c.strokeStyle=color;c.lineWidth=5;c.beginPath();c.moveTo(24,-20);c.quadraticCurveTo(42,-27,34,-39);c.stroke();}
   c.fillStyle='#ffe0a1';c.fillRect(-8,-35,4,3);c.fillRect(5,-35,4,3);
  }
 }else if(['hastur','pursuer','ink','shade'].includes(a.kind)){
  const king=['hastur','pursuer'].includes(a.kind),top=king?-70:-48;
  shape(c,[[0,top],[-15,top+10],[-17,-26],[-27,5],[-12,1],[-6,8],[3,1],[15,7],[26,2],[15,-29],[14,top+9]],ink);
  shape(c,[[-10,top+11],[-11,-24],[-21,2],[-7,-5],[0,2],[9,-5],[20,2],[9,-29],[10,top+11]],king?gold:color);
  shape(c,[[-7,top+13],[7,top+13],[9,top+28],[0,top+33],[-9,top+28]],ink);
  c.fillStyle=king?bone:'#9cf0dd';c.fillRect(-5,top+22,3,2);c.fillRect(3,top+22,3,2);
  if(king){shape(c,[[-15,top+9],[-18,top-8],[-7,top],[0,top-12],[7,top],[18,top-8],[15,top+9]],gold);c.strokeStyle=bone;c.lineWidth=1;c.strokeRect(-14,top+5,28,4);}
  c.strokeStyle=king?'#7a6136':'#263e40';for(const x of [-9,0,9]){c.beginPath();c.moveTo(x,-25);c.lineTo(x*1.6,0);c.stroke();}
 }else{
  for(const side of [-1,1]){shape(c,[[side*4,-17],[side*13,-17],[side*15,6+side*step],[side*4,6+side*step]],ink);c.fillStyle=bone;c.fillRect(side<0?-14:4,3+side*step,10,4);}
  shape(c,[[-11,-43],[-22,-31],[-17,-8],[-10,-10],[-12,-28],[-6,-15],[7,-15],[13,-29],[14,-10],[22,-11],[22,-31],[10,-43]],ink);
  shape(c,[[-10,-39],[-18,-29],[-12,-22],[-7,-27],[-10,-11],[10,-11],[7,-28],[15,-23],[18,-29],[9,-39]],color);
  shape(c,[[-10,-54],[8,-54],[13,-43],[7,-32],[-8,-32],[-14,-42]],color);
  if(a.kind==='anubis'){shape(c,[[-12,-49],[-15,-70],[-6,-56],[6,-56],[13,-70],[12,-46],[5,-30],[-4,-30]],ink);c.strokeStyle=gold;c.lineWidth=3;c.beginPath();c.moveTo(25,4);c.lineTo(25,-55);c.stroke();c.strokeRect(20,-61,10,8);}
  else{for(const side of [-1,1])shape(c,[[side*8,-49],[side*23,-57],[side*22,-68],[side*15,-57],[side*8,-55]],bone);c.fillStyle='#705246';c.fillRect(23,-40,5,44);shape(c,[[19,-47],[34,-47],[38,-30],[18,-30]],a.kind==='dokkaebi'?'#8c7762':'#a4b3ac');}
  c.fillStyle=bone;c.fillRect(-7,-46,4,3);c.fillRect(4,-46,4,3);c.fillStyle=gold;c.fillRect(-10,-15,20,4);
 }
 c.restore();
}
