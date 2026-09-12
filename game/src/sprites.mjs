import {human} from './humans.mjs';
export function character(c,a,time,hero=false){
 if(hero||a.kind==='human'||a.kind==='jack'){human(c,hero?{...a,role:'evelyn'}:a,time);return;}
 const x=Math.round(a.x),y=Math.round(a.y);c.save();c.translate(x,y);
 c.fillStyle='#02070888';c.beginPath();c.ellipse(0,5,18,7,0,0,Math.PI*2);c.fill();
 {
 const big=['minotaur','lamassu','hastur'].includes(a.kind),s=big?1.4:1;
 c.scale(s,s);const color=a.flash>0?'#f8ecd0':a.color??'#c4baa0';
 c.fillStyle='#17272a';c.fillRect(-13,-24,26,28);c.fillStyle=color;c.fillRect(-10,-29,20,22);c.fillRect(-13,-13,26,17);
 c.fillStyle='#40383c';c.fillRect(-9,4,6,6);c.fillRect(3,4,6,6);
 c.fillStyle='#263435';c.fillRect(-7,-22,14,9);c.fillStyle=a.kind==='jack'?'#101515':'#f7bf78';c.fillRect(-6,-21,3,3);c.fillRect(3,-21,3,3);
 switch(a.kind){
 case 'jack':c.fillStyle='#e0ddd0';c.fillRect(-7,-27,14,17);c.fillStyle='#222828';c.fillRect(-5,-23,3,3);c.fillRect(3,-23,3,3);c.fillStyle='#bcc9c0';c.fillRect(16,-15,3,23);break;
 case 'hastur':case 'pursuer':c.fillStyle='#cfb25c';c.fillRect(-14,-30,28,5);for(let i=0;i<3;i++)c.fillRect(-12+i*10,-39,5,10);c.fillRect(-16,-8,32,14);c.fillStyle='#3d3a2a';c.fillRect(-1,-13,3,18);break;
 case 'anubis':c.fillStyle='#323f44';c.fillRect(-9,-42,5,15);c.fillRect(5,-42,5,15);c.fillRect(-5,-23,10,17);c.fillStyle='#e2c27e';c.fillRect(17,-36,3,40);break;
 case 'minotaur':case 'dokkaebi':c.fillStyle='#e5d0a1';c.fillRect(-15,-35,6,10);c.fillRect(9,-35,6,10);c.fillStyle='#807063';c.fillRect(16,-25,6,27);c.fillRect(12,-31,14,9);break;
 case 'lamassu':c.fillStyle='#c9c5a6';for(let i=0;i<4;i++){c.fillRect(-24+i*3,-22+i*4,8,17-i*2);c.fillRect(17-i*3,-22+i*4,8,17-i*2);}break;
 case 'scarab':c.fillStyle='#253934';c.fillRect(-5,-25,10,24);for(let i=0;i<3;i++){c.fillRect(-18,-18+i*8,6,3);c.fillRect(12,-18+i*8,6,3);}break;
 case 'jaguar':c.fillStyle='#392f25';for(let i=0;i<6;i++)c.fillRect(-9+i%3*7,-18+Math.floor(i/3)*9,3,3);break;
 case 'ink':case 'shade':c.globalAlpha=.6;c.fillStyle=color;for(let i=0;i<4;i++)c.fillRect(-13+i*8,2,3,7+Math.sin(time*4+i)*5);break;
 }
 }
 c.restore();
}
export function artifact(c,o,time,taken){
 c.save();c.translate(o.x,o.y);const bob=Math.sin(time*2)*2;
 c.fillStyle='#080e10bb';c.beginPath();c.ellipse(0,7,23,8,0,0,Math.PI*2);c.fill();
 c.fillStyle='#55594d';c.fillRect(-17,-8,34,14);c.fillStyle='#8a8b72';c.fillRect(-20,-12,40,7);
 if(!taken){c.translate(0,bob);c.shadowColor='#d9b56d';c.shadowBlur=15;c.fillStyle='#dbc18a';
 switch(o.id){case 'book':case 'scroll':c.fillRect(-10,-29,20,14);c.fillStyle='#675941';c.fillRect(-1,-29,2,14);break;
 case 'knife':c.beginPath();c.moveTo(0,-40);c.lineTo(5,-20);c.lineTo(-4,-20);c.fill();c.fillStyle='#965f50';c.fillRect(-2,-20,4,8);break;
 case 'cheon':for(let i=0;i<3;i++)c.fillRect(-14+i*11,-29,6,14);break;
 case 'pottery':c.fillRect(-9,-28,18,14);c.fillRect(-5,-34,10,6);break;
 default:c.fillRect(-12,-28,24,10);c.fillRect(5,-35,7,9);break;}
 }
 c.restore();
}
