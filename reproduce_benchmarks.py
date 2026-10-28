"""Reproduce the revised manuscript benchmarks from the original optical inputs."""
import os
os.environ['OPENBLAS_NUM_THREADS']='1'
os.environ['OMP_NUM_THREADS']='1'
import sys,json,time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import numpy as np
BASE=Path(__file__).resolve().parent
sys.path.insert(0,str(BASE/'model'))
from physics import *
from calibration import DESIGNS,OBSERVED,fit,STD,SE
from network import Network,Standard
OUT=BASE/'verification/benchmarks';OUT.mkdir(exist_ok=True)
p=PaperPhysics(np.fromfile(BASE/'site/assets/mie-kernel.bin',dtype='<f8').reshape(126,291))
ab,_=p.basis(DESIGNS)
theta=np.array([fit(ab[:2],OBSERVED[:2]),fit(ab[2:],OBSERVED[2:])])
boots=[]
for ids in [np.arange(2),np.arange(2,6)]:
    rng=np.random.default_rng(1)
    boots.append([fit(ab[j],OBSERVED[j]) for j in (rng.choice(ids,len(ids),replace=True) for _ in range(200))])
boots=np.array(boots)
choices=np.random.default_rng(0).choice(200,5,replace=False)
members=boots[:,choices].transpose(1,0,2)
np.savez(OUT/'calibration.npz',basis=ab,theta=theta,boots=boots,members=members,choices=choices)
def enc(x):
    z=x[:,[0,1,2,3,4,5,6,8]].copy();z[:,[2,6]]=np.log(z[:,[2,6]]);return z
def ctx(x):
    z=x[:,[4,5,6,8]].copy();z[:,2]=np.log(z[:,2]);return z
def metrics(y,pred):
    v=((y-y.mean(0))**2).sum(0)
    return dict(r2=[float(1-((y[:,j]-pred[:,j])**2).sum()/v[j]) if v[j]>1e-20 else None for j in range(3)],mae=(abs(y-pred).mean(0)*100).tolist())
def train(job):
    name,n,coeff,seed,inverse=job
    x=sample(n,seed);basis,mass=p.basis(x);y=response(x,basis,coeff)
    rng=np.random.default_rng(4201);order=rng.permutation(n);tr=order[:int(.8*n)];te=order[int(.8*n):]
    xs=Standard(enc(x[tr]));ys=Standard(y[tr]);cs=Standard(ctx(x[tr]));xx=xs.enc(enc(x[tr]));yy=ys.enc(y[tr])
    net=Network([8,64,64,64,3],rng);start=time.time()
    for step in range(1,4001):
        diff=net.forward(xx)-yy;net.backward(2*diff/len(tr));net.adam(step)
        if step%1000==0:print(name,'forward',step,'seconds',round(time.time()-start),flush=True)
    pred=ys.dec(net.forward(xs.enc(enc(x[te]))));m=metrics(y[te],pred)
    np.savez_compressed(OUT/(name+'-holdout.npz'),true=y[te],pred=pred,designs=x[te],mass=mass[te])
    result=dict(name=name,n=n,metrics=m,mass_outside_one_percent=int((abs(mass[te]-1)>.01).sum()),mass_max=float(mass.max()))
    artifact=dict(forward=net.json(),xs=xs.json(),ys=ys.json(),cs=cs.json(),coefficients=np.asarray(coeff).tolist())
    if inverse:
        inv=Network([7,64,64,4],rng,sigmoid=True);inp=np.column_stack([yy,cs.enc(ctx(x[tr]))]);lo,hi=BOUNDS[:4].T;span=hi-lo
        for step in range(1,4001):
            free=lo+span*inv.forward(inp);proposed=np.column_stack([free,x[tr,4:]])
            diff=net.forward(xs.enc(enc(proposed)))-yy
            grad=net.backward(2*diff/len(tr),update=False)[:,:4]/xs.scale[:4];grad[:,2]/=free[:,2]
            grad[:,1]-=2*np.maximum(0,.08-free[:,1])/len(tr)
            inv.backward(grad*span);inv.adam(step)
            if step%1000==0:print(name,'inverse',step,'seconds',round(time.time()-start),flush=True)
        target_designs=np.array([[130,.1,1000,0,1.53,880,60,0,1],[155,.1,1000,0,1.53,880,60,0,1],[150,.2,295,0,1.59,500,200,0,1]])
        target,_=p.evaluate(target_designs,coeff)
        proposed=np.column_stack([lo+span*inv.forward(np.column_stack([ys.enc(target),cs.enc(ctx(target_designs))])),target_designs[:,4:]])
        direct,imass=p.evaluate(proposed,coeff);sur=ys.dec(net.forward(xs.enc(enc(proposed))))
        result['inverse']=dict(target_percent=(100*target).tolist(),designs=proposed.tolist(),direct_percent=(100*direct).tolist(),surrogate_percent=(100*sur).tolist(),captured_mass=imass.tolist())
        artifact['inverse']=inv.json()
    result['seconds']=time.time()-start
    (OUT/(name+'.json')).write_text(json.dumps(result,indent=2))
    (OUT/(name+'-networks.json')).write_text(json.dumps(artifact))
    print(name,'COMPLETE',m,flush=True);return result
jobs=[('nominal',8000,np.tile([1,.25,.5,1],(2,1)),0,False)]+[(f'member-{i}',12000,t,4101,True) for i,t in enumerate(members)]
if __name__=='__main__':
    with ThreadPoolExecutor(max_workers=2) as pool: results=list(pool.map(train,jobs))
    (OUT/'benchmarks.json').write_text(json.dumps(results,indent=2))
