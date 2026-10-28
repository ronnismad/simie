import {readFileSync,writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {PaperPhysics} from '../site/physics.mjs';
import {PaperNetworks} from '../site/networks.mjs';
const read=p=>JSON.parse(readFileSync(new URL(p,import.meta.url),'utf8'));
const bytes=readFileSync(new URL('../site/assets/mie-kernel.bin',import.meta.url));
const kernel=new Float64Array(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
const model=new PaperPhysics(read('../site/assets/optics.json'),kernel,read('../site/assets/calibration.json'));
const cases=read('../verification/cases.json');
const actual=cases.designs.map(x=>model.evaluate(x));
let maxResponse=0,maxBasis=0;
actual.forEach((a,i)=>{
 const b=cases.expected[i];a.best_fit.forEach((v,j)=>{maxResponse=Math.max(maxResponse,Math.abs(v-b.best_fit[j]));});
 ['S','G','Pi','g','pi','grid_mass'].forEach(k=>{maxBasis=Math.max(maxBasis,Math.abs(a.basis[k]-b.basis[k]));});
});
assert.ok(maxResponse<1e-10,`Browser/reference response mismatch ${maxResponse}`);
assert.ok(maxBasis<1e-9,`Browser/reference basis mismatch ${maxBasis}`);
assert.equal(model.evaluate(cases.invalid_energy_design).diagnostics.budget_pass,false,'Must flag over-budget response');
assert.throws(()=>model.evaluate([40,.1,1000,0,1.53,880,60,0,1]));
let neural=null;
try{
 const ensemble=new PaperNetworks(read('../site/assets/networks.json'));
 if(cases.network_expected){
  let max=0;
  cases.designs.forEach((x,i)=>ensemble.predict(x).mean.forEach((v,j)=>max=Math.max(max,Math.abs(v-cases.network_expected[i][j]))));
  assert.ok(max<1e-10,`Fresh neural export mismatch ${max}`);
  const trace=ensemble.trace(cases.designs[0]);
  assert.deepEqual(trace.activations.map(layer=>layer.length),[9,64,64,64,3]);
  assert.equal(trace.edges.length,4);
  trace.output.forEach((v,j)=>assert.ok(Math.abs(v-ensemble.predict(cases.designs[0]).member_responses[0][j])<1e-12));
  const proposed=ensemble.inverse(cases.target,cases.context);
  let inverseMax=0;
  proposed.forEach((x,i)=>x.forEach((v,j)=>inverseMax=Math.max(inverseMax,Math.abs(v-cases.inverse_expected[i][j]))));
  assert.ok(inverseMax<1e-9,`Fresh inverse export mismatch ${inverseMax}`);
  proposed.forEach(x=>model.validate(x));
  const selection=ensemble.select(cases.designs);
  assert.equal(selection.robust.design.length,9);
  assert.deepEqual(selection.robust.design,cases.designs[cases.selection_expected.robust_index]);
  assert.deepEqual(selection.next.design,cases.designs[cases.selection_expected.next_index]);
  assert.ok(Math.abs(selection.tau-cases.selection_expected.tau)<1e-10);
  neural={prediction_max_abs_error:max,inverse_max_abs_error:inverseMax,selection_recomputed:true};
 }
}catch(e){if(e.code!=='ENOENT')throw e;}
const result={passed:true,n_designs:cases.designs.length,direct_response_max_abs_error:maxResponse,direct_basis_max_abs_error:maxBasis,neural,energy_violation_flagged:true};
writeFileSync(new URL('../verification/browser-parity.json',import.meta.url),JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
