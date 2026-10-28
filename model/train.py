"""Fresh 12,000-design, five-member tandem ensemble; no old weights loaded."""
import os
os.environ['OPENBLAS_NUM_THREADS']='1'
os.environ['OMP_NUM_THREADS']='1'
import json,time,argparse
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import numpy as np
from physics import PaperPhysics,ROOT,sample,response,BOUNDS,FEATURES
from network import Network,Standard,encode,context

def train_one(index,x,y,theta):
    rng=np.random.default_rng(4201)
    order=rng.permutation(len(x));tr=order[:9600];te=order[9600:]
    xs=Standard(encode(x[tr]));ys=Standard(y[tr]);cs=Standard(context(x[tr]))
    xx=xs.enc(encode(x[tr]));yy=ys.enc(y[tr]);n=len(tr)
    forward=Network([8,64,64,64,3],rng)
    started=time.time()
    for step in range(1,4001):
        difference=forward.forward(xx)-yy
        forward.backward(2*difference/n);forward.adam(step)
        if step%1000==0:print(f'Member {index+1}: forward {step}/4000; MSE={np.mean(difference**2):.6g}; elapsed {time.time()-started:.0f}s',flush=True)
    pred=ys.dec(forward.forward(xs.enc(encode(x[te]))))
    variance=np.sum((y[te]-y[te].mean(0))**2,axis=0)
    r2=[float(1-np.sum((pred[:,j]-y[te,j])**2)/variance[j]) if variance[j]>1e-20 else None for j in range(3)]
    inverse=Network([7,64,64,4],rng,sigmoid=True)
    inputs=np.column_stack([yy,cs.enc(context(x[tr]))]);lo,hi=BOUNDS[:4].T;span=hi-lo
    for step in range(1,4001):
        unit=inverse.forward(inputs);free=lo+span*unit
        proposed=np.column_stack([free,x[tr,4:]])
        out=forward.forward(xs.enc(encode(proposed)));difference=out-yy
        grad=forward.backward(2*difference/n,update=False)[:,:4]/xs.scale[:4]
        grad[:,2]/=free[:,2]
        penalty=np.maximum(0,.08-free[:,1]);grad[:,1]-=2*penalty/n
        inverse.backward(grad*span);inverse.adam(step)
        if step%1000==0:print(f'Member {index+1}: inverse {step}/4000; MSE={np.mean(difference**2):.6g}; elapsed {time.time()-started:.0f}s',flush=True)
    result=dict(coefficients=theta,x_scaler=xs.json(),y_scaler=ys.json(),context_scaler=cs.json(),forward=forward.json(),inverse=inverse.json(),test_metrics=dict(r2=r2,mae=np.mean(abs(pred-y[te]),axis=0).tolist()),seed=4201)
    (ROOT/'cache'/f'member-{index}.json').write_text(json.dumps(result,separators=(',',':')))
    return result

def main():
    p=argparse.ArgumentParser();p.add_argument('--workers',type=int,default=2);a=p.parse_args()
    physics=PaperPhysics(np.load(ROOT/'cache/kernel.npy'))
    cal=json.loads((ROOT.parent/'site/assets/calibration.json').read_text())
    x=sample(12000,4101);basis,_=physics.basis(x)
    labels=[response(x,basis,t) for t in cal['member_coefficients']]
    np.savez_compressed(ROOT/'cache/training-population.npz',designs=x,basis=basis)
    with ThreadPoolExecutor(max_workers=a.workers) as pool:
        members=list(pool.map(lambda i:train_one(i,x,labels[i],cal['member_coefficients'][i]),range(5)))
    payload=dict(schema='simie-revised-v1',features=FEATURES,bounds=BOUNDS.tolist(),members=members,n_designs=12000,forward_steps=4000,inverse_steps=4000,description='Fresh paper-only implementation; S2 grids and S5 Adam; eight optical/device inputs; side retained as a design annotation',sampling_seed=4101,initialisation_seed=4201,calibration_seed=cal['seed'])
    (ROOT.parent/'site/assets/networks.json').write_text(json.dumps(payload,separators=(',',':')))
    print('Fresh ensemble complete.',flush=True)

if __name__=='__main__':main()
