"""Export independent Python checks for browser comparison and release audit."""
import os
os.environ['OPENBLAS_NUM_THREADS']='1'
from pathlib import Path
import numpy as np,json
from physics import PaperPhysics,ROOT,REFERENCE,sample,FEATURES
from calibration import DESIGNS
from network import Network,Standard,encode,context

def reconstruct(row):
 n=Network([len(row['W'][0]),*map(len,row['b'])],np.random.default_rng(0),sigmoid=row['sigmoid'])
 n.W=[np.array(a) for a in row['W']];n.b=[np.array(b) for b in row['b']];return n

def main():
 p=PaperPhysics(np.load(ROOT/'cache/kernel.npy'));target=ROOT.parent/'verification';cal=json.loads((ROOT.parent/'site/assets/calibration.json').read_text())
 x=np.vstack([REFERENCE,DESIGNS,sample(100,991)]);x=np.vstack([x,*[np.array([d,sf,1000,0,1.53,880,60,0,1]) for d in [60,160,260] for sf in [0,1e-5,.25]]])
 basis,mass=p.basis(x);y,_=p.evaluate(x,cal['coefficients'])
 expected=[dict(best_fit=row.tolist(),basis=dict(S=float(b[0]*p.gref*xx[2]**2/(-np.expm1(-max(xx[2]-xx[0],0)/(xx[0]/2)))) if xx[2]>xx[0] else float(p.descriptor(xx)[0][0]),G=float(b[0]*p.gref),Pi=float(b[1]*p.piref),g=float(b[0]),pi=float(b[1]),grid_mass=float(m))) for row,b,xx,m in zip(y,basis,x,mass)]
 cases=dict(designs=x.tolist(),expected=expected,invalid_energy_design=[180,.1,260,0,1.53,880,60,0,1],target=[.12,.02,0],context=REFERENCE[4:].tolist())
 path=ROOT.parent/'site/assets/networks.json'
 if path.exists():
  data=json.loads(path.read_text());predictions=[];inverses=[];fidelity=[]
  for member in data['members']:
   f=reconstruct(member['forward']);inv=reconstruct(member['inverse'])
   enc=lambda z,s:(z-np.array(s['mean']))/np.array(s['scale'])
   yp=f.forward(enc(encode(x),member['x_scaler']))*member['y_scaler']['scale']+member['y_scaler']['mean'];predictions.append(yp)
   c=np.array([cases['context']]);c[:,2]=np.log(c[:,2])
   inp=np.column_stack([enc(np.array([cases['target']]),member['y_scaler']),enc(c,member['context_scaler'])])
   lo=np.array(data['bounds'])[:4,0];span=np.diff(np.array(data['bounds'])[:4],axis=1).ravel()
   design=np.column_stack([lo+span*inv.forward(inp),np.array([cases['context']])])[0];inverses.append(design.tolist())
   calculated,_=p.evaluate(design,member['coefficients']);fidelity.append(dict(design=design.tolist(),recalculated=calculated[0].tolist(),error=(calculated[0]-cases['target']).tolist()))
  cases['network_expected']=np.mean(predictions,axis=0).tolist();cases['inverse_expected']=inverses
  scores=np.array(predictions).sum(axis=2);mu=scores.mean(0);sd=scores.std(0);tau=np.quantile(mu,.75)
  cases['selection_expected']={'robust_index':int(np.argmax(mu-sd)),'next_index':int(np.argmax(np.where(mu>=tau,sd,-np.inf))),'tau':float(tau)}
  (target/'inverse-direct-checks.json').write_text(json.dumps(fidelity,indent=2))
 (target/'cases.json').write_text(json.dumps(cases,separators=(',',':')))
 print(f'{len(x)} independent physical cases exported; fresh networks included: {path.exists()}',flush=True)

if __name__=='__main__':main()
