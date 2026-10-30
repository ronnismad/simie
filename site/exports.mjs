export function saveFile(text,name,type){const u=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
export function saveCSV(rows,name){saveFile('\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v??'').replaceAll('"','""')+'"').join(',')).join('\r\n'),name,'text/csv;charset=utf-8');}
export async function savePNG(source,name){
 if(!source)throw Error('Estimate the design before exporting.');
 const clone=source.cloneNode(true),nodes=[source,...source.querySelectorAll('*')],copies=[clone,...clone.querySelectorAll('*')];
 nodes.forEach((node,i)=>{const css=getComputedStyle(node);for(const key of ['fill','stroke','stroke-width','opacity','font-family','font-size','font-weight','text-anchor'])copies[i].style.setProperty(key,css.getPropertyValue(key));if(node.classList.contains('network-layer'))copies[i].style.opacity='1';});
 const vb=source.viewBox.baseVal,w=Math.round(vb.width*2),h=Math.round(vb.height*2);clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('width',w);clone.setAttribute('height',h);
 const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)],{type:'image/svg+xml;charset=utf-8'}));
 try{const img=new Image();img.src=url;await img.decode();const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--white').trim()||'#fff';ctx.fillRect(0,0,w,h);ctx.drawImage(img,0,0);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('Image export failed.');const out=URL.createObjectURL(blob),a=document.createElement('a');a.href=out;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(out),1000);}finally{URL.revokeObjectURL(url);}
}
