/** New S5-trained weights only. No legacy models or stored predictions. */
const scale=(x,s)=>x.map((v,j)=>(v-s.mean[j])/s.scale[j]);
function net(input,n){
  let x=input;
  n.W.forEach((w,k)=>{
    x=n.b[k].map((b,j)=>b+w.reduce((s,row,i)=>s+row[j]*x[i],0));
    if(k<n.W.length-1)x=x.map(Math.tanh);
    else if(n.sigmoid)x=x.map(v=>1/(1+Math.exp(-Math.max(-60,Math.min(60,v)))));
  });return x;
}
function summary(rows){
  const mean=rows[0].map((_,j)=>rows.reduce((s,r)=>s+r[j],0)/rows.length);
  return {mean,std:mean.map((m,j)=>Math.hypot(...rows.map(r=>r[j]-m))/Math.sqrt(rows.length))};
}
export class PaperNetworks{
  constructor(data){if(data.schema!=='pnfa-paper-v1'||data.members.length!==5)throw Error('Fresh paper ensemble required.');this.data=data;}
  predict(x){
    const encoded=x.slice();[2,6].forEach(j=>encoded[j]=Math.log(encoded[j]));
    const rows=this.data.members.map(m=>net(scale(encoded,m.x_scaler),m.forward).map((v,j)=>v*m.y_scaler.scale[j]+m.y_scaler.mean[j]));
    const stats=summary(rows),scores=summary(rows.map(r=>[r.reduce((a,b)=>a+b,0)]));
    return {member_responses:rows,...stats,score_mean:scores.mean[0],score_std:scores.std[0],finite_positive:rows.every(r=>r.every(v=>Number.isFinite(v)&&1+v>0))};
  }
  trace(x,index=0){
    const member=this.data.members[index];if(!member)throw Error('Unknown ensemble member.');
    const encoded=x.slice();[2,6].forEach(j=>encoded[j]=Math.log(encoded[j]));
    let a=scale(encoded,member.x_scaler);const activations=[a];
    member.forward.W.forEach((w,l)=>{
      a=member.forward.b[l].map((b,j)=>b+w.reduce((s,row,i)=>s+row[j]*a[i],0));
      if(l<member.forward.W.length-1)a=a.map(Math.tanh);
      activations.push(a);
    });
    const output=a.map((v,j)=>v*member.y_scaler.scale[j]+member.y_scaler.mean[j]);
    const edges=member.forward.W.map(w=>w.flatMap((row,i)=>row.map((weight,j)=>({i,j,weight}))).sort((a,b)=>Math.abs(b.weight)-Math.abs(a.weight)).slice(0,20));
    return {member:index+1,activations,edges,output};
  }
  inverse(target,context){
    const c=context.slice();c[2]=Math.log(c[2]);
    return this.data.members.map(m=>{
      const unit=net([...scale(target,m.y_scaler),...scale(c,m.context_scaler)],m.inverse);
      return [...unit.map((u,j)=>this.data.bounds[j][0]+u*(this.data.bounds[j][1]-this.data.bounds[j][0])),...context];
    });
  }
  select(candidates,kappa=1){
    if(!candidates.length||!Number.isFinite(kappa)||kappa<0)throw Error('A nonempty candidate set and nonnegative finite kappa are required.');
    const predictions=candidates.map(x=>this.predict(x)),sorted=predictions.map(r=>r.score_mean).sort((a,b)=>a-b);
    const at=.75*(sorted.length-1),i=Math.floor(at),tau=sorted[i]+(at-i)*(sorted[Math.ceil(at)]-sorted[i]);
    let robust=-1,next=-1,objective=-Infinity,uncertainty=-Infinity;
    const riskScale=Math.max(1,kappa);
    predictions.forEach((p,i)=>{
      const adjusted=p.score_mean/riskScale-(kappa/riskScale)*p.score_std;
      if(adjusted>objective){objective=adjusted;robust=i;}
      if(p.score_mean>=tau&&p.score_std>uncertainty){uncertainty=p.score_std;next=i;}
    });
    return {tau,kappa,robust:robust<0?null:{design:candidates[robust],prediction:predictions[robust]},next:next<0?null:{design:candidates[next],prediction:predictions[next]},count:candidates.length};
  }
}
