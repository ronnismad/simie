import {placementDiagram} from './placement.mjs';
import {networkDiagram} from './diagram.mjs';
import {localise,language,setLanguage} from './i18n.mjs?v=placement-engineering-10';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const pct=v=>`${v>0?'+':''}${Math.abs(100*v)>=1e4?(100*v).toExponential(2):(100*v).toFixed(2)}%`;
const number=v=>Math.abs(v)>=1e6||(Math.abs(v)<1e-4&&v!==0)?Number(v).toExponential(3):Number(v).toLocaleString('en-US',{maximumFractionDigits:3});
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const inputHelp=["Mean diameter of the silicon particles.", "Standard deviation divided by mean diameter; 0 means a single size.", "Density-based spacing P = nA⁻¹ᐟ², where nA is the number of particles per unit area. It equals centre-to-centre pitch for a square array; for disorder it is an effective spacing.", "Fraction of the exposed cap covered by a transport-layer shell: 0 is uncovered, 1 is fully covered.", "Bandgap of the perovskite absorber.", "Thickness of the light-absorbing perovskite layer.", "Sets the device architecture: planar up to 120 nm, mesoporous above 120 nm."];
const definitions=[
 ['Mean diameter','nm',60,260,1,160],['Relative dispersion','σ/d',0,.25,.001,.1],
 ['Mean spacing','nm',150,1500,1,1000],['Shell coverage','fraction',0,1,.01,0],
 ['Absorber bandgap','eV',1.45,1.75,.01,1.53],['Absorber thickness','nm',300,1000,1,880],
 ['Transport-layer thickness','nm',30,400,1,60]
];
let ready=false,current=null,metadata=null,lastExport=null,jobCounter=0,latestEvaluation=0,timer;
const pending=new Map(),worker=new Worker(new URL('./worker.mjs',import.meta.url),{type:'module'});
worker.onmessage=({data})=>{const p=pending.get(data.id);if(!p)return;pending.delete(data.id);data.error?p.reject(Error(data.error)):p.resolve(data.result);};
worker.onerror=event=>{for(const p of pending.values())p.reject(Error(event.message||'Scientific worker could not start.'));pending.clear();error('The model could not load. Open SiMie through its website or a local web server.');};
function request(type,payload){return new Promise((resolve,reject)=>{const id=++jobCounter;pending.set(id,{resolve,reject});worker.postMessage({id,type,payload});});}
function error(message){if(message.startsWith('Missing model asset:'))message='A required model resource could not be loaded. Reload the page.';$('#global-error').textContent=message;$('#global-error').hidden=!message;localise();}
function notify(text){$('#toast').textContent=text;$('#toast').hidden=false;localise();setTimeout(()=>$('#toast').hidden=true,4000);}
function download(data,name){const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function readDesign(){const x=definitions.map((_,i)=>{const el=$(`#value-${i}`);if(!el.value.trim())throw Error('Complete all design fields.');return Number(el.value);});return [...x,Number($('#side').value),Number($('#doping').value)];}
function refreshPlacement(){
  const ids=['value-0','value-6','value-3'],valid=ids.every(id=>$('#'+id)?.checkValidity());
  const [d,t,c]=ids.map(id=>Number($('#'+id)?.value)),back=$('#side').value==='1';
  $('#live-placement').innerHTML=valid?placementDiagram(d,t,c,back):'<p class="micro">Enter valid diameter, transport thickness and shell coverage to display the geometry.</p>';
  for(const [key,value] of [['d',d],['t',t],['c',c*100],['side',back?'1':'0']]){const el=$('#placement-'+key);if(document.activeElement!==el)el.value=Number.isFinite(Number(value))?value:'';}
  $('#placement-values').innerHTML=valid?`<span>${back?'Back placement':'Front placement'}</span> · <span>${t>120?'Mesoporous':'Planar'}</span> · d = ${d} nm · t = ${t} nm · <span>Exposed cap height</span>: h = ${Math.max(0,d-t)} nm · c_shell = ${Number((c*100).toFixed(6))}%`:'';
  requestAnimationFrame(()=>{const el=$('#live-placement');if(el.clientWidth>0)el.scrollLeft=Math.max(0,(el.scrollWidth-el.clientWidth)/2);});
  $('#placement-back').hidden=!valid||!back;
  $('#placement-buried').hidden=!valid||d>t;
}
function updateContext(){
  refreshPlacement();
  const x=readDesign(),arch=x[6]>120?'Mesoporous':'Planar';$('#architecture').textContent=arch;
  $$('.context-display').forEach(el=>el.textContent=`Fixed context: Eg ${number(x[4])} eV · absorber ${number(x[5])} nm · transport ${number(x[6])} nm (${arch.toLowerCase()}) · ${x[7]?'back':'front'} side · ${x[8]===1?'intrinsic':'p-type'} silicon.`);
  localise();
}
function setDesign(x){definitions.forEach((_,i)=>{$(`#value-${i}`).value=x[i];$(`#slider-${i}`).value=x[i];});$('#side').value=String(x[7]);$('#doping').value=String(x[8]);updateContext();}
function route(){
  const page=['explorer','inverse','selection','methods'].includes(location.hash.slice(1))?location.hash.slice(1):'explorer';
  $$('.page').forEach(el=>el.hidden=el.id!==`page-${page}`);
  $$('nav a').forEach(a=>{if(a.dataset.page===page)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
  document.title=`SiMie · ${{explorer:'Design explorer',inverse:'Inverse design',selection:'Next experiment',methods:'Methods & data'}[page]}`;
  localise();
}
function controls(){
  definitions.forEach(([label,unit,min,max,step,value],i)=>{
    const div=document.createElement('div');div.className='control';
    div.innerHTML=`<div class="control-top"><label for="value-${i}">${label}</label><div class="input-unit"><input type="number" id="value-${i}" min="${min}" max="${max}" step="any" value="${value}" required aria-describedby="help-${i}" aria-label="${label} (${unit})"><span>${unit}</span></div></div><input type="range" id="slider-${i}" min="${min}" max="${max}" step="${step}" value="${value}" aria-describedby="help-${i}" aria-label="${label} slider"><p class="field-help" id="help-${i}">${inputHelp[i]}</p><div class="range-ends"><span>${min}</span><span>${max}</span></div>`;
    $(i<4?'#particle-controls':'#device-controls').append(div);
    for(const mode of ['value','slider'])$(`#${mode}-${i}`).addEventListener('input',()=>{
      const from=$(`#${mode}-${i}`),to=$(`#${mode==='value'?'slider':'value'}-${i}`);to.value=from.value;
      $('#preset').value='custom';try{updateContext();}catch{}schedule();
    });
  });
  for(const id of ['side','doping'])$(`#${id}`).addEventListener('change',()=>{$('#preset').value='custom';updateContext();schedule();});
  updateContext();
}
function setEstimateDisabled(value){$('#evaluate').disabled=value;$('#estimate-bottom').disabled=value;}
function schedule(){clearTimeout(timer);++latestEvaluation;setEstimateDisabled(!ready);$('#export-result').disabled=true;$('#stale-notice').hidden=false;if(!$('#live-update').checked){$('#forward-results').setAttribute('aria-busy','false');$('#estimate-mode-label').textContent='Press Estimate to update';localise();return;}$('#forward-results').setAttribute('aria-busy','true');localise();timer=setTimeout(()=>{if($('#design-form').checkValidity())evaluate();else $('#forward-results').setAttribute('aria-busy','false');},350);}
function draw(){
  if(!current)return;
  const mode=$('#chart-mode').value,rows=current.curve,xDesign=current.evaluation.design[0];
  const value=r=>mode==='score'?r.score*100:mode==='S'?r.S:r.mean[0]*100;
  const spread=r=>mode==='S'?0:mode==='score'?r.spread*100:r.std[0]*100;
  const vals=rows.flatMap(r=>[value(r)-spread(r),value(r)+spread(r)]);
  if(!vals.every(Number.isFinite)){ $('#chart').textContent='The prescribed numerical grid gives nonfinite values for this sweep.';return;}
  let min=Math.min(0,...vals),max=Math.max(...vals);if(max-min<1e-10)max=min+1;
  const pad=(max-min)*.12;min-=pad;max+=pad;
  const W=660,H=272,left=58,right=15,top=22,bottom=45;
  const sx=d=>left+(d-60)/200*(W-left-right),sy=v=>H-bottom-(v-min)/(max-min)*(H-top-bottom);
  const line=rows.map((r,i)=>`${i?'L':'M'}${sx(r.diameter).toFixed(2)},${sy(value(r)).toFixed(2)}`).join(' ');
  const band=rows.map((r,i)=>`${i?'L':'M'}${sx(r.diameter).toFixed(2)},${sy(value(r)+spread(r)).toFixed(2)}`).join(' ')+rows.slice().reverse().map(r=>` L${sx(r.diameter).toFixed(2)},${sy(value(r)-spread(r)).toFixed(2)}`).join(' ')+' Z';
  let grid='';for(let i=0;i<=4;i++){const v=min+(max-min)*i/4,y=sy(v);grid+=`<line x1="${left}" x2="${W-right}" y1="${y}" y2="${y}" stroke="#e9eeea"/><text x="${left-9}" y="${y+3}" text-anchor="end" fill="#687b78" font-size="10">${mode==='S'?v.toExponential(1):v.toFixed(Math.abs(max-min)<5?1:0)}</text>`;}
  for(const d of [60,100,140,180,220,260])grid+=`<text x="${sx(d)}" y="${H-bottom+20}" text-anchor="middle" fill="#687b78" font-size="10">${d}</text>`;
  const label=mode==='S'?'S̄ (nm⁻¹)':mode==='J'?'Relative current change (%)':'Linearised efficiency change (%)';
  const yvalue=mode==='S'?current.evaluation.basis.S:mode==='J'?current.evaluation.mean[0]*100:current.evaluation.score_mean*100;
  $('#chart').innerHTML=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${label} across particle diameters 60 to 260 nm"><title>${label} versus mean diameter. Current context and dispersion fixed.</title>${grid}<text x="${left}" y="12" fill="#63767b" font-size="10">${label}</text>${mode!=='S'?`<path d="${band}" fill="#dcece5" opacity=".85"/>`:''}<path d="${line}" fill="none" stroke="#216b68" stroke-width="2.3"/><line x1="${sx(xDesign)}" x2="${sx(xDesign)}" y1="${top}" y2="${H-bottom}" stroke="#c49b54" stroke-dasharray="3 5" opacity=".7"/><circle cx="${sx(xDesign)}" cy="${sy(yvalue)}" r="4.5" fill="#c49b54" stroke="white" stroke-width="2"/><text x="${(left+W-right)/2}" y="${H-5}" text-anchor="middle" fill="#63767b" font-size="11">Mean particle diameter (nm)</text></svg>`;
  $('#chart').setAttribute('aria-label',`${label} versus diameter, from 60 to 260 nanometres. Current design ${xDesign} nanometres.`);
  $('#band-label').hidden=mode==='S';
  localise();
}
function renderForward(){
  const r=current.evaluation;
  $('#stale-notice').hidden=true;
  $('#metrics').innerHTML=['Short-circuit current','Open-circuit voltage','Fill factor'].map((label,j)=>`<article class="metric"><span>${label}</span><h3>${['J<sub>sc</sub>','V<sub>oc</sub>','FF'][j]}</h3><strong>${pct(r.mean[j])}</strong><small>± ${(100*r.std[j]).toFixed(2)}% ensemble SD<br>Full-data fit: ${pct(r.best_fit[j])}</small></article>`).join('');
  const checks=[{level:'ok',title:'Direct paper-equation evaluation',text:'Mie lookup, spectral weighting, S2 size average and exposed-cap response; no output clipping.'},...r.flags];
  if(r.diagnostics.budget_pass&&r.diagnostics.finite_positive)checks.push({level:'ok',title:'Necessary physical checks passed',text:'For all five members, absolute current, voltage and fill factor are positive and finite, and current is below the diagnostic ceiling. Relative changes may be negative. This does not establish device feasibility.'});
  if(current.surrogate){const diff=Math.max(...r.mean.map((v,j)=>Math.abs(v-current.surrogate.mean[j])))*100;checks.push({level:diff>1?'warn':'ok',title:'Surrogate cross-check',text:`Largest difference between surrogate and direct-equation ensemble means: ${diff.toFixed(3)} percentage points. The cards above use the direct calculation.`});}
  $('#diagnostics').innerHTML=checks.map(c=>`<div class="check-row ${c.level}"><span class="check-dot"></span><div><h3>${escape(c.title)}</h3><p>${escape(c.text)}</p></div></div>`).join('');
  const failed=!r.diagnostics.budget_pass||!r.diagnostics.finite_positive;
  const review=checks.some(c=>c.level==='warn');
  $('#result-guidance').textContent=failed?'Failed physical checks. These results are diagnostic only; this design is not recommended for an experiment.':'Review the scientific checks below. Passing necessary checks does not establish experimental feasibility.';
  $('#result-guidance').className=failed?'message error':'micro';
  $('#check-badge').textContent=failed?'Unvalidated · failed check':review?'Limits to review':'Necessary checks passed';
  $('#check-badge').className=`badge ${failed?'error':review?'warn':''}`;
  const q=[['Optical descriptor S̄',`${r.basis.S.toExponential(6)} nm⁻¹`],['Normalised gain G/Gref',number(r.basis.g)],['Normalised cap penalty Π/Πref',number(r.basis.pi)],['S2 distribution integral',r.basis.grid_mass.toFixed(6)],['Diagnostic baseline current',`${number(r.diagnostics.reference_current)} mA/cm²`],['Unity-collection ceiling',`${number(r.diagnostics.ideal_current)} mA/cm²`]];
  $('#quantities').innerHTML=`<dl class="quantity-grid">${q.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
  draw();const diagram=networkDiagram(current.trace,r.design);if(diagram)$('#network-diagram').innerHTML=diagram;
  $('#estimate-mode-label').textContent=$('#live-update').checked?'Inputs update the estimate':'Estimate on click';
  lastExport={implementation:'SiMie 2.0',manuscript_sha256:metadata.optics.manuscript_sha256,features:metadata.optics.features,uncertainty_status:metadata.calibration.uncertainty_status,...current};localise();
}
async function evaluate(){
  if(!ready)return;const ticket=++latestEvaluation;clearTimeout(timer);error('');
  if(!$('#design-form').reportValidity())return;
  setEstimateDisabled(true);$('#export-result').disabled=true;$('#forward-results').setAttribute('aria-busy','true');
  try{const result=await request('evaluate',readDesign());if(ticket!==latestEvaluation)return;let member=result.trace?.member-1;while(metadata.networks_available&&member!==Number($('#network-member').value)){member=Number($('#network-member').value);result.trace=await request('trace',{design:result.evaluation.design,member});if(ticket!==latestEvaluation)return;}current=result;renderForward();$('#export-result').disabled=false;}
  catch(e){if(ticket===latestEvaluation)error(e.message);}
  finally{if(ticket===latestEvaluation){setEstimateDisabled(false);$('#forward-results').setAttribute('aria-busy','false');}}
}
function proposalHTML(r,title,id,target=null,memberIndex=null,prediction=null){
  const x=r.design,failed=!r.diagnostics.budget_pass||!r.diagnostics.finite_positive;
  return `<article class="panel proposal"><div class="eyebrow">DIRECT-EQUATION VERIFICATION</div><h2>${failed?'Rejected candidate':title}</h2>${failed?`<p class="micro">${title}</p><p class="message error">Failed physical checks. Shown for diagnosis only; not recommended for an experiment.</p>`:''}<span class="badge ${failed?'error':r.flags.length?'warn':''}">${failed?'Rejected · failed physical checks':r.flags.length?'Assumptions and extrapolation to review':'Necessary checks passed'}</span><dl class="quantity-grid"><div><dt>Diameter</dt><dd>${number(x[0])} nm</dd></div><div><dt>Dispersion σ/d</dt><dd>${number(x[1])}</dd></div><div><dt>Spacing</dt><dd>${number(x[2])} nm</dd></div><div><dt>Shell coverage</dt><dd>${number(x[3])}</dd></div></dl><p class="micro">Ensemble mean · direct equations</p><div class="response">ΔJ/J <strong>${pct(r.mean[0])}</strong> · ΔV/V <strong>${pct(r.mean[1])}</strong><br>ΔFF/FF <strong>${pct(r.mean[2])}</strong></div>${target?`<p class="micro">Direct-equation mean − target (percentage points): ${r.mean.map((v,j)=>(100*(v-target[j])).toFixed(3)).join(', ')}.</p>${memberIndex===null?'':`<p class="micro">Member physics − target (percentage points): ${r.member_responses[memberIndex].map((v,j)=>(100*(v-target[j])).toFixed(3)).join(', ')}.</p>`}`:''}${prediction?`<p class="micro">Surrogate μ ± s: ${(100*prediction.score_mean).toFixed(2)}% ± ${(100*prediction.score_std).toFixed(2)}%.</p><p class="micro">Direct μ ± s: ${(100*r.score_mean).toFixed(2)}% ± ${(100*r.score_std).toFixed(2)}%.</p>`:''}<p class="micro">${r.flags.length?escape(r.flags.map(f=>f.title).join(' · ')):'Checks are necessary, not experimental validation.'}</p><button class="button secondary" data-open="${id}">${failed?'Inspect failed calculation →':'Inspect in explorer →'}</button></article>`;
}
function attachProposals(container,designs){
  container.querySelectorAll('[data-open]').forEach(button=>button.addEventListener('click',()=>{setDesign(designs[Number(button.dataset.open)]);$('#preset').value='custom';location.hash='explorer';evaluate();}));
}
function populateMethods(){
  const c=metadata.calibration;
  $('#calibration-table').innerHTML=c.names.map((name,i)=>{const x=c.designs[i];return `<tr><td>${escape(name)}</td>${[x[0],x[1],x[2],x[6],...c.observed[i].map(v=>100*v)].map(v=>`<td>${number(v)}</td>`).join('')}</tr>`;}).join('');
  $('#coefficient-table').innerHTML=`<table><thead><tr><th>Full-data calibration</th><th>α</th><th>β</th><th>γ</th><th>δ</th></tr></thead><tbody>${c.coefficients.map((t,i)=>`<tr><td>${i?'Mesoporous':'Planar'}</td>${t.map((v,j)=>`<td>${i&&j>=2?'Unidentified':v.toPrecision(5)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  $('#training-description').textContent=metadata.training?`${metadata.training.n.toLocaleString()} newly sampled designs · ${metadata.training.members} newly trained forward/inverse pairs · 4,000 full-batch Adam steps per stage and member · 80/20 train/holdout split. Forward and inverse run in the browser; no server is required.`:'The direct physics and new calibration are ready. Fresh network weights are not yet packaged; inverse and experiment selection are disabled.';
  if(metadata.training)$('#training-metrics').innerHTML=`<table><thead><tr><th>Member</th><th>J R²</th><th>V R²</th><th>FF R²</th><th>Mean absolute errors J, V, FF (percentage points)</th></tr></thead><tbody>${metadata.training.metrics.map((m,i)=>`<tr><td>${i+1}</td>${m.r2.map(v=>`<td>${v===null?'Undefined (constant target)':v.toFixed(5)}</td>`).join('')}<td>${m.mae.map(v=>(100*v).toFixed(3)).join(', ')}</td></tr>`).join('')}</tbody></table>`;
  localise();
}
for(const [key,source,scale] of [['d','value-0',1],['t','value-6',1],['c','value-3',.01],['side','side',1]]){
 $('#placement-'+key).addEventListener(key==='side'?'change':'input',e=>{const target=$('#'+source);target.value=e.target.value===''?'':Number(e.target.value)*scale;target.dispatchEvent(new Event(key==='side'?'change':'input',{bubbles:true}));});
}
$('#placement-zoom').addEventListener('click',()=>{const enlarged=$('#live-placement').classList.toggle('enlarged');$('#live-placement').scrollLeft=Math.max(0,($('#live-placement').scrollWidth-$('#live-placement').clientWidth)/2);$('#placement-zoom').setAttribute('aria-pressed',String(enlarged));$('#placement-zoom').textContent=enlarged?'Standard view':'Enlarge diagram';localise();});
controls();route();window.addEventListener('hashchange',route);
$('#language').value=language();$('#language').addEventListener('change',()=>{setLanguage($('#language').value);route();});
function themeState(){const dark=document.documentElement.dataset.theme==='dark';$('#theme-toggle').setAttribute('aria-pressed',String(dark));$('#theme-toggle span').textContent=dark?'Light mode':'Dark mode';localise();}
themeState();$('#theme-toggle').addEventListener('click',()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('simie-theme',document.documentElement.dataset.theme);}catch{}themeState();});
$('#live-update').addEventListener('change',()=>{clearTimeout(timer);$('#estimate-mode-label').textContent=$('#live-update').checked?'Inputs update the estimate':'Estimate on click';localise();if($('#live-update').checked)evaluate();});
$('#network-member').addEventListener('change',async()=>{if(!current)return;const design=current.evaluation.design.slice(),key=JSON.stringify(design),member=Number($('#network-member').value);try{const trace=await request('trace',{design,member});if(trace&&JSON.stringify(current.evaluation.design)===key&&Number($('#network-member').value)===member){current.trace=trace;if(lastExport)lastExport.trace=trace;$('#network-diagram').innerHTML=networkDiagram(trace,design);localise();}}catch(e){error(e.message);}});
$('#design-form').addEventListener('submit',async e=>{e.preventDefault();await evaluate();if(e.submitter?.id==='estimate-bottom')$('#forward-results').scrollIntoView({block:'start'});});
$('#reset').addEventListener('click',()=>{if(!ready)return;setDesign(metadata.optics.reference);$('#preset').value='reference';evaluate();});
$('#preset').addEventListener('change',()=>{if(!ready||$('#preset').value==='custom')return;setDesign($('#preset').value==='reference'?metadata.optics.reference:metadata.calibration.designs[Number($('#preset').value)]);evaluate();});
$('#chart-mode').addEventListener('change',draw);
$('#export-result').addEventListener('click',()=>{if(lastExport)download(lastExport,'simie-design-result.json');});
$('#copy-link').addEventListener('click',async()=>{try{const url=new URL(location.href);url.searchParams.set('design',readDesign().join(','));url.hash='explorer';await navigator.clipboard.writeText(url.href);notify('Design link copied.');}catch{notify('Clipboard unavailable. Export the result to save this design.');}});
$('#inverse-form').addEventListener('submit',async e=>{
  e.preventDefault();error('');if(!$('#design-form').reportValidity()){location.hash='explorer';return;}
  const b=$('#inverse-button');b.disabled=true;b.textContent='Calculating…';localise();
  try{const target=['J','V','FF'].map(k=>Number($(`#target-${k}`).value)/100);const result=await request('inverse',{target,context:readDesign().slice(4)});const el=$('#inverse-results');el.className='proposal-grid';el.innerHTML=result.map((r,i)=>proposalHTML(r.evaluation,`Ensemble member ${i+1}`,i,target,i)).join('');attachProposals(el,result.map(r=>r.evaluation.design));}
  catch(e){error(e.message);}finally{b.disabled=false;b.textContent='Propose designs →';localise();}
});
$('#selection-form').addEventListener('submit',async e=>{
  e.preventDefault();error('');if(!$('#design-form').reportValidity()){location.hash='explorer';return;}
  const b=$('#selection-button');b.disabled=true;b.textContent='Comparing 512 candidates…';localise();
  try{const result=await request('select',{context:readDesign().slice(4),kappa:Number($('#kappa').value)});const el=$('#selection-results');el.className='';const found=[result.robust,result.next].filter(Boolean);el.innerHTML=`<p class="micro">512 seeded candidates · τ = ${(100*result.tau).toFixed(2)}% linearised gain · κ = ${result.kappa}. No photon-budget cap or feasibility constraint has been added to the selection equations.</p><div class="proposal-grid">${[result.robust,result.next].map((r,i)=>r?proposalHTML(r.evaluation,i?'Uncertainty criterion':'Risk-adjusted criterion',found.indexOf(r),null,null,r.prediction):`<article class="panel proposal"><h2>No eligible ${i?'uncertainty candidate':'risk-adjusted candidate'}</h2></article>`).join('')}</div>`;attachProposals(el,found.map(r=>r.design));}
  catch(e){error(e.message);}finally{b.disabled=false;b.textContent='Compare candidates →';localise();}
});
try{
  metadata=await request('init');ready=true;
  const shared=new URL(location.href).searchParams.get('design');
  if(shared){const x=shared.split(',').map(Number);if(x.length!==9||!x.every(Number.isFinite))throw Error('The shared design link is invalid.');setDesign(x);$('#preset').value='custom';}
  else setDesign(metadata.optics.reference);
  populateMethods();$('#runtime').textContent='Calculated in your browser';setEstimateDisabled(false);$('#reset').disabled=false;
  $('#inverse-button').disabled=$('#selection-button').disabled=!metadata.networks_available;
  localise();
  await evaluate();
}catch(e){error(e.message);$('#runtime').textContent='Model unavailable';}
