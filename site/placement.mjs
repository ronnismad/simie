// Display-only geometry. This module never supplies values to the physical model.
export function placementDiagram(d,t,coverage,back){
  if(![d,t,coverage].every(Number.isFinite)||d<60||d>260||t<30||t>400||coverage<0||coverage>1)return '';
  const scale=.65,r=d*scale/2,h=Math.max(0,d-t),base=440,edge=base-t*scale,cy=base-r;
  const mirror=y=>back?520-y:y;
  const layerY=back?80:edge,absorberY=back?80+t*scale:80;
  const absorberH=360-t*scale;
  const theta=h>0?Math.acos(Math.max(-1,Math.min(1,1-h*coverage*scale/r))):0;
  const x=300,x1=x-r*Math.sin(theta),x2=x+r*Math.sin(theta),arcY=cy-r*Math.cos(theta);
  const shell=theta>0?`<path data-shell="${coverage}" d="M ${x1} ${mirror(arcY)} A ${r} ${r} 0 ${theta>Math.PI/2?1:0} ${back?0:1} ${x2} ${mirror(arcY)}" fill="none" stroke="#087da5" stroke-width="7"/>`:'';
  const dim=(x,y1,y2,label)=>`<path d="M ${x} ${mirror(y1)} V ${mirror(y2)} M ${x-5} ${mirror(y1)} H ${x+5} M ${x-5} ${mirror(y2)} H ${x+5}" stroke="#183239" fill="none"/><text x="${x+10}" y="${mirror((y1+y2)/2)+5}" font-size="16">${label}</text>`;
  return `<svg viewBox="0 0 600 520" role="img" aria-label="Particle cross-section for the current inputs"><rect width="600" height="520" fill="#fff"/><g fill="#183239" font-family="Arial, sans-serif"><rect x="90" y="${absorberY}" width="410" height="${absorberH}" fill="#ead0a5"/><rect x="90" y="${layerY}" width="410" height="${t*scale}" fill="${back?'#b9afce':'#91bdcc'}"/><rect x="90" y="${back?440:60}" width="410" height="20" fill="${back?'#91bdcc':'#b9afce'}"/><rect x="90" y="${back?460:440}" width="410" height="${back?24:44}" fill="#daeaf0"/><text x="105" y="${absorberY+absorberH/2}" font-size="18">Perovskite</text><text x="105" y="${layerY+t*scale/2+5}" font-size="16">${back?'HTL':'ETL'}</text><text x="105" y="${back?455:75}" font-size="14">${back?'ETL':'HTL'}</text><circle data-particle="${d}" cx="${x}" cy="${mirror(cy)}" r="${r}" fill="#747474" stroke="#222" stroke-width="2"/>${shell}${dim(410,base-d*scale,base,'d')}${dim(515,base,edge,'t')}${h>0?dim(385,base-d*scale,edge,'h'):''}<path d="M 45 440 V 355 L 39 366 M 45 355 L 51 366" stroke="#183239" fill="none" stroke-width="2"/><text x="20" y="465" font-size="16">Light</text><text x="105" y="510" font-size="15">Glass / transparent contact</text></g></svg>`;
}
