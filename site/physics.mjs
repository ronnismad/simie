/** Independent browser evaluator of main Eqs. 5–10 and Supplement S2/S3.
 * The only precomputed physics is Qf-Qabs on the stated S2 Mie grid.
 * Predictions are never clipped, saturated or tuned to figure annotations.
 */
const HC=1239.8419843320026, Q=1.602176634e-19;
export function interpolate(x,y,z){
  if(z<x[0]||z>x.at(-1))throw Error('Optical-table extrapolation is not permitted.');
  let lo=0,hi=x.length-1;
  while(hi-lo>1){const mid=(hi+lo)>>1;if(x[mid]>z)hi=mid;else lo=mid;}
  return y[lo]+(y[hi]-y[lo])*(z-x[lo])/(x[hi]-x[lo]);
}
function moments(rows){
  const mean=rows[0].map((_,j)=>rows.reduce((s,r)=>s+r[j],0)/rows.length);
  return {mean,std:mean.map((v,j)=>Math.hypot(...rows.map(r=>r[j]-v))/Math.sqrt(rows.length))};
}
export class PaperPhysics{
  constructor(optics,kernel,calibration){
    this.o=optics;this.k=kernel;this.cal=calibration;this.cache=new Map();
    this.pvkLambda=optics.pvk.map(r=>r[0]);this.pvkK=optics.pvk.map(r=>r[2]);
    if(kernel.length!==126*291)throw Error('The S2 optical grid is incomplete.');
  }
  validate(x){
    if(x.length!==9||!x.every(Number.isFinite))throw Error('Enter nine finite design values.');
    x.forEach((v,j)=>{if(v<this.o.bounds[j][0]-1e-10||v>this.o.bounds[j][1]+1e-10)throw Error(`${this.o.features[j]} is outside Table 1.`);});
    if(![0,1].includes(x[7])||![.85,1].includes(x[8]))throw Error('Invalid side or doping selection.');
  }
  spectrum(eg,tp){
    const key=`${eg}|${tp}`;
    if(this.cache.has(key))return this.cache.get(key);
    const lam=this.o.wavelength,flux=this.o.photon_flux;
    const alpha=lam.map(l=>{const shifted=HC/(HC/l-(eg-1.59));return 4*Math.PI*interpolate(this.pvkLambda,this.pvkK,shifted)/shifted;});
    const w=lam.map((l,j)=>l<HC/eg?flux[j]*(1-.826*(1-Math.exp(-alpha[j]*tp))):0);
    const sum=w.reduce((a,b)=>a+b,0);
    const s=this.o.diameter.map((d,i)=>{let value=0;for(let j=0;j<lam.length;j++)value+=this.k[i*lam.length+j]*w[j];return 1.5/d*value/sum;});
    let ideal=0,baseline=0;
    lam.forEach((l,j)=>{if(l<HC/eg){ideal+=flux[j];baseline+=flux[j]*(1-Math.exp(-alpha[j]*tp));}});
    const out={s,weight:w,ideal:ideal*Q*2/10,baseline:baseline*.826*Q*2/10};
    if(this.cache.size>=128)this.cache.delete(this.cache.keys().next().value);
    this.cache.set(key,out);return out;
  }
  basis(x){
    this.validate(x);
    const [d,sf,p,shell,eg,tp,te,,dop]=x,spectrum=this.spectrum(eg,tp);
    let descriptor=0,mass=0;
    if(sf===0||sf*sf===0){descriptor=interpolate(this.o.diameter,spectrum.s,d);mass=1;}
    else{
      const width=Math.sqrt(Math.log1p(sf*sf)),centre=Math.log(d)-width*width/2;
      this.o.diameter.forEach((diam,j)=>{
        const density=Math.exp(-.5*((Math.log(diam)-centre)/width)**2)/(diam*width*Math.sqrt(2*Math.PI));
        const trap=(j===0||j===125)?1:2;
        descriptor+=trap*density*spectrum.s[j];mass+=trap*density;
      });
    }
    const G=descriptor/p**2*(-Math.expm1(-Math.max(p-d,0)/(d/2)));
    const Pi=Math.PI*d*Math.max(d-te,0)/p**2*(1-shell)*dop;
    return {S:descriptor,G,Pi,g:G/this.o.normalisation.G,pi:Pi/this.o.normalisation.Pi,mass,spectrum};
  }
  response(x,basis,theta){
    const [a,b,c,d]=theta[x[6]>120?1:0];return [a*basis.g,b*basis.g-c*basis.pi,-d*basis.pi];
  }
  evaluate(x){
    const b=this.basis(x),best=this.response(x,b,this.cal.coefficients);
    const rows=this.cal.member_coefficients.map(t=>this.response(x,b,t));
    const stats=moments(rows),score=moments(rows.map(r=>[r.reduce((a,v)=>a+v,0)]));
    const currents=rows.map(r=>b.spectrum.baseline*(1+r[0]));
    const finitePositive=rows.every(r=>r.every(v=>Number.isFinite(v)&&1+v>0));
    const budgetPass=currents.every(j=>j<=b.spectrum.ideal+1e-10);
    const flags=[];
    if(!finitePositive)flags.push({level:'error',title:'Nonpositive or nonfinite response',text:'At least one member gives an invalid absolute response. The equations have not been clipped.'});
    if(!budgetPass)flags.push({level:'error',title:'Photon-budget check failed',text:'Estimated current exceeds the unity-collection ceiling in the paper’s spectral window. This is a model extrapolation, not a validated device recommendation.'});
    if(Math.abs(b.mass-1)>.01)flags.push({level:'warn',title:'S2 diameter-grid limitation',text:`The prescribed trapezoid grid integrates the size distribution to ${b.mass.toFixed(4)}. Tails or a very narrow distribution are under-resolved; no renormalisation has been added.`});
    const minP=x[6]>120?180:1000,maxP=x[6]>120?400:1000;
    if(x[2]<minP-1||x[2]>maxP+1)flags.push({level:'warn',title:'Outside calibration spacing',text:`The ${x[6]>120?'mesoporous':'planar'} anchors use ${minP===maxP?minP:minP+'–'+maxP} nm spacing. Table 1 permits this value, but the prediction is an extrapolation.`});
    if(x[7]===1)flags.push({level:'warn',title:'Back-side response is unspecified',text:'The paper supplies no separate back-side optical kernel. The stated equations give the same response for front and back.'});
    if(x[6]>120)flags.push({level:'warn',title:'Mesoporous parameter identifiability',text:'Gamma and delta are unidentified by the calibration anchors because their exposed-cap penalty is zero. Solver zeros do not establish zero uncertainty.'});
    return {design:x,best_fit:best,member_responses:rows,...stats,score_mean:score.mean[0],score_std:score.std[0],basis:{S:b.S,G:b.G,Pi:b.Pi,g:b.g,pi:b.pi,grid_mass:b.mass},diagnostics:{finite_positive:finitePositive,budget_pass:budgetPass,ideal_current:b.spectrum.ideal,reference_current:b.spectrum.baseline,member_currents:currents},flags};
  }
  sweep(x){
    return Array.from({length:101},(_,i)=>{const design=x.slice();design[0]=60+2*i;const r=this.evaluate(design);return {diameter:design[0],mean:r.mean,std:r.std,score:r.score_mean,spread:r.score_std,S:r.basis.S,budget_pass:r.diagnostics.budget_pass};});
  }
}
