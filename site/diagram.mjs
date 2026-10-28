/** Draw actual member activations. No simulated/fabricated neural signals. */
export function networkDiagram(trace,design){
  if(!trace)return null;
  const {activations,edges,output}=trace;
  const point=(layer,index)=>layer===0?[87,56+index*23]:layer===4?[802,85+index*70]:[190+(layer-1)*200+(index%8)*13,75+Math.floor(index/8)*21];
  const colour=v=>v<0?`rgba(50,137,161,${.22+.78*Math.min(1,Math.abs(v))})`:`rgba(200,152,66,${.22+.78*Math.min(1,Math.abs(v))})`;
  let paths='';edges.forEach((layer,k)=>layer.forEach(({i,j,weight})=>{
    const [x1,y1]=point(k,i),[x2,y2]=point(k+1,j),mid=(x1+x2)/2;
    paths+=`<path d="M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}" fill="none" stroke="${weight<0?'#428da1':'#c5a15d'}" opacity=".3" stroke-width=".8"><title>Weight ${weight.toFixed(5)}</title></path>`;
  }));
  const inputNames=['d','σ/d','P','c_shell','E_g','t_pvk','t_ETL','side','κ_dop'];
  let nodes='';activations.forEach((layer,k)=>{
    nodes+=`<g class="network-layer" style="--layer:${k}">`;
    layer.forEach((v,i)=>{
      const [x,y]=point(k,i);nodes+=`<circle cx="${x}" cy="${y}" r="${k===0||k===4?5:4.1}" fill="${colour(k===0||k===4?Math.tanh(v):v)}" stroke="var(--white)" stroke-width=".5"><title>Layer ${k}, unit ${i+1}: ${v.toFixed(6)}</title></circle>`;
      if(k===0)nodes+=`<text x="${x-11}" y="${y+3}" text-anchor="end" fill="var(--muted)" font-size="13">${inputNames[i]} ${Number(design[i].toPrecision(4))}</text>`;
      if(k===4)nodes+=`<text x="${x+13}" y="${y+3}" fill="var(--ink)" font-size="13">${['ΔJ/J','ΔV/V','ΔFF/FF'][i]} ${(100*output[i]).toFixed(2)}%</text>`;
    });nodes+='</g>';
  });
  const labels=['9 inputs','64 tanh','64 tanh','64 tanh','3 outputs'];
  return `<svg viewBox="0 0 920 285" role="img" aria-label="Nine input forward network with three hidden layers of 64 tanh units and three outputs"><title>Actual forward activations from ensemble member ${trace.member}</title>${paths}${nodes}${labels.map((v,k)=>`<text x="${k===0?87:k===4?802:235.5+(k-1)*200}" y="27" text-anchor="middle" fill="var(--muted)" font-size="13">${v}</text>`).join('')}<text x="451" y="267" text-anchor="middle" fill="var(--muted)" font-size="12">Standardised inputs → tanh hidden layers → linear relative-response outputs</text></svg>`;
}
