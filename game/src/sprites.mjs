import {creature} from './creatures.mjs';
import {human} from './humans.mjs';
export function character(c,a,time,hero=false){
 if(hero||a.kind==='human'||a.kind==='jack'){human(c,hero?{...a,role:'evelyn'}:a,time);return;}
 creature(c,a,time);
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
