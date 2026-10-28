/** Release gate for deployable paths, fresh assets and browser-script syntax. */
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),site=new URL('site/',root);
for(const file of readdirSync(site).filter(n=>/\.(mjs|js)$/.test(n))){
 const result=spawnSync(process.execPath,['--check',fileURLToPath(new URL(file,site))],{encoding:'utf8'});
 assert.equal(result.status,0,result.stderr);
}
const html=readFileSync(new URL('index.html',site),'utf8');
for(const [,path] of html.matchAll(/(?:src|href)="(\.\/[^"#]+)"/g))assert.ok(existsSync(new URL(path,site)),`Broken local link: ${path}`);
assert.match(html,/>SiMie</);assert.match(html,/id="language"/);assert.match(html,/id="theme-toggle"/);assert.match(html,/id="network-diagram"/);assert.match(html,/id="evaluate"/);
for(const file of ['README.md','SPECIFICATION.md','site/index.html','site/i18n.mjs']){
 const text=readFileSync(new URL(file,root),'utf8');
 assert.doesNotMatch(text,/main_PNFA|SupplPNFA|V2\.5|present run returns 260|open validation check|Текущий расчёт даёт 260/);
}
const assets=new URL('assets/',site),read=n=>JSON.parse(readFileSync(new URL(n,assets),'utf8'));
const model=read('networks.json'),cal=read('calibration.json');
assert.equal(model.members.length,5);assert.equal(model.n_designs,12000);
assert.equal(model.forward_steps,4000);assert.equal(model.inverse_steps,4000);
model.members.forEach((m,i)=>{
 assert.deepEqual(m.coefficients,cal.member_coefficients[i]);
 assert.deepEqual(m.forward.b.map(b=>b.length),[64,64,64,3]);
 assert.deepEqual(m.inverse.b.map(b=>b.length),[64,64,4]);
 assert.equal(m.forward.W[0].length,8);assert.equal(m.inverse.W[0].length,7);
 for(const key of ['forward','inverse'])for(const w of m[key].W)assert.ok(w.flat().every(Number.isFinite));
});
for(const [name,hash] of Object.entries(read('release-hashes.json'))){
 const actual=createHash('sha256').update(readFileSync(new URL(name,assets))).digest('hex');
 assert.equal(actual,hash,`Release asset changed after verification: ${name}`);
}
assert.ok(read('verification.json').browser_parity.neural);
console.log('SiMie release: scripts parse, local assets exist, fresh models match calibration, release hashes pass.');
