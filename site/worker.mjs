import {PaperPhysics} from './physics.mjs';
import {PaperNetworks} from './networks.mjs';
let physics,networks;
async function load(){
  const manifestResponse=await fetch('./assets/release-hashes.json',{cache:'no-store'});
  if(!manifestResponse.ok)throw Error('The verified model release is not available yet.');
  const manifest=await manifestResponse.json();
  const checked=async(name,json=true)=>{
    const r=await fetch(`./assets/${name}`,{cache:'no-store'});if(!r.ok)throw Error(`Missing model asset: ${name}`);
    const binary=await r.arrayBuffer();
    const digest=[...new Uint8Array(await crypto.subtle.digest('SHA-256',binary))].map(v=>v.toString(16).padStart(2,'0')).join('');
    if(digest!==manifest[name])throw Error('Model asset integrity check failed. Reload the page or review the deployment.');
    return json?JSON.parse(new TextDecoder().decode(binary)):binary;
  };
  const [optics,calibration,binary,trained]=await Promise.all([checked('optics.json'),checked('calibration.json'),checked('mie-kernel.bin',false),checked('networks.json')]);
  const view=new DataView(binary),kernel=Float64Array.from({length:binary.byteLength/8},(_,i)=>view.getFloat64(i*8,true));
  physics=new PaperPhysics(optics,kernel,calibration);
  if(JSON.stringify(trained.members.map(m=>m.coefficients))!==JSON.stringify(calibration.member_coefficients))throw Error('Network calibration does not match the physical model.');
  networks=new PaperNetworks(trained);
  return {optics,calibration,networks_available:!!networks,training:networks?.data?{n:networks.data.n_designs,members:networks.data.members.length,metrics:networks.data.members.map(m=>m.test_metrics)}:null};
}
function sampleCandidates(context,n=512){
  let seed=6101;
  const rand=()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};
  return Array.from({length:n},()=>[60+200*rand(),.25*rand(),Math.exp(Math.log(150)+Math.log(10)*rand()),rand(),...context]);
}
self.onmessage=async({data:{id,type,payload}})=>{
  try{
    let result;
    if(type==='init')result=await load();
    else if(type==='evaluate')result={evaluation:physics.evaluate(payload),curve:physics.sweep(payload),surrogate:networks?.predict(payload),trace:networks?.trace(payload)};
    else if(type==='trace')result=networks?networks.trace(payload.design,payload.member):null;
    else if(type==='inverse'){
      if(!networks)throw Error('The new trained networks have not been packaged.');
      physics.validate([160,.1,1000,0,...payload.context]);
      result=networks.inverse(payload.target,payload.context).map((x,i)=>({member:i+1,evaluation:physics.evaluate(x),surrogate:networks.predict(x),target:payload.target}));
    }else if(type==='select'){
      if(!networks)throw Error('The new trained networks have not been packaged.');
      physics.validate([160,.1,1000,0,...payload.context]);
      result=networks.select(sampleCandidates(payload.context),payload.kappa);
      for(const key of ['robust','next'])if(result[key])result[key].evaluation=physics.evaluate(result[key].design);
    }else throw Error('Unknown calculation');
    self.postMessage({id,result});
  }catch(error){self.postMessage({id,error:error.message});}
};
