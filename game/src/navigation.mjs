export function nextStep(g,e){
 const clear=()=>{const d=Math.hypot(g.player.x-e.x,g.player.y-e.y);for(let t=0;t<=1;t+=12/Math.max(d,12))if(g.solid(e.x+(g.player.x-e.x)*t,e.y+(g.player.y-e.y)*t))return false;return true;};
 if(clear())return g.player;
 const cell=(x,y)=>[Math.max(0,Math.min(26,Math.round((x-64)/32))),Math.max(0,Math.min(13,Math.round((y-128)/32)))];
 const [sx,sy]=cell(e.x,e.y),[tx,ty]=cell(g.player.x,g.player.y);const start=sy*27+sx,target=ty*27+tx;
 const queue=[start],parents=new Map([[start,-1]]);
 for(let i=0;i<queue.length;i++){
  const id=queue[i];if(id===target)break;const x=id%27,y=Math.floor(id/27);
  for(const [dx,dy]of [[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy,n=ny*27+nx;
   if(nx<0||nx>26||ny<0||ny>13||parents.has(n)||g.solid(64+nx*32,128+ny*32))continue;
   parents.set(n,id);queue.push(n);
  }
 }
 if(!parents.has(target))return g.player;let n=target;
 while(parents.get(n)!==start&&parents.get(n)!==-1)n=parents.get(n);
 return {x:64+n%27*32,y:128+Math.floor(n/27)*32};
}
