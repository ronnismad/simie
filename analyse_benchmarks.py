import os
os.environ['OPENBLAS_NUM_THREADS']='1'
import json,itertools
import numpy as np
from reproduce_benchmarks import p,theta,boots,members,ab,OUT,DESIGNS,OBSERVED,fit,STD,SE,REFERENCE,DIAMETER,WAVELENGTH,HC,photon_flux,absorption,E_CHARGE,response,sample
grid=np.arange(60.,261.,2.);x=np.tile(REFERENCE,(len(grid),1));x[:,0]=grid;basis,_=p.basis(x)
summary=dict(normalisation=[p.sref,p.gref,p.piref],coefficients=theta.tolist(),planar_prediction_percent=(100*response(DESIGNS,ab,theta)[:2]).tolist(),peak_nm=float(DIAMETER[np.argmax(p.spectral(1.53,880))]),optima={str(l):float(grid[np.argmax(basis[:,0]-l*basis[:,1])]) for l in [0,.3,1,3]})
summary['bootstrap']=[]
for k,ids in enumerate([np.arange(2),np.arange(2,6)]):
    loo=[fit(ab[j],OBSERVED[j]).tolist() for j in (np.delete(ids,i) for i in range(len(ids)))]
    # Enumerate all equally likely ordered resamples: exact finite empirical bootstrap.
    exact=np.array([fit(ab[list(j)],OBSERVED[list(j)]) for j in itertools.product(ids,repeat=len(ids))])
    rng=np.random.default_rng(29);noisy=np.array([fit(ab[ids],OBSERVED[ids]+rng.normal(0,SE,(len(ids),3))) for _ in range(1000)])
    q=np.percentile(boots[k,:,0],[5,95]);eq=np.percentile(exact[:,0],[5,95],method='inverted_cdf')
    mat=np.zeros((len(ids),3,4));g,pi=ab[ids].T;mat[:,0,0]=g;mat[:,1,1]=g;mat[:,1,2]=-pi;mat[:,2,3]=-pi
    convergence={}
    for b in [5,20,50,100,200]:
        rng=np.random.default_rng(30);sd=np.array([boots[k,rng.choice(200,b,replace=False),0].std() for _ in range(200)])
        convergence[str(b)]={'median_sd':float(np.median(sd)),'sd_range_5_95':np.percentile(sd,[5,95]).tolist()}
    summary['bootstrap'].append(dict(rank=int(np.linalg.matrix_rank(mat.reshape(-1,4))),loo=loo,alpha_5_95=q.tolist(),ratio=float(q[1]/q[0]),exact_alpha_5_95=eq.tolist(),exact_ratio=float(eq[1]/eq[0]),noise_alpha_5_95=np.percentile(noisy[:,0],[5,95]).tolist(),convergence=convergence))
# Direct-model candidate comparison. No surrogate approximation enters these scores.
candidates=np.tile(REFERENCE,(101,1));candidates[:,0]=np.arange(60.,261.,2.);bb,mass=p.basis(candidates)
draw=np.array([response(candidates,bb,t).sum(1) for t in boots.transpose(1,0,2)])
mu=draw.mean(0);sd=draw.std(0);tau=np.quantile(mu,.75)
indexes={'risk_adjusted':int(np.argmax(mu-sd)),'uncertainty':int(np.argmax(np.where(mu>=tau,sd,-np.inf))),'maximum_gain':int(np.argmax(mu)),'random':int(np.random.default_rng(6102).integers(len(candidates)))}
flux=photon_flux();A=1-np.exp(-absorption(1.53)*880);mask=WAVELENGTH<HC/1.53
j0=float(E_CHARGE*np.sum(flux*A*mask)*2*.826*.1);jlim=float(E_CHARGE*np.sum(flux*mask)*2*.1)
summary['selection']={'candidate_count':101,'random_baseline_seed':6102,'tau':float(tau),'baseline_mA_cm2':j0,'unity_ceiling_mA_cm2':jlim,'rows':{}}
for name,i in indexes.items():
    yr=np.array([response(candidates[i:i+1],bb[i:i+1],t)[0] for t in boots.transpose(1,0,2)])
    summary['selection']['rows'][name]=dict(index=i,design=candidates[i].tolist(),mean_score=float(mu[i]),sd_score=float(sd[i]),direct_mean_percent=(100*yr.mean(0)).tolist(),current_mA_cm2=float(j0*(1+yr[:,0].mean())),captured_mass=float(mass[i]))
# Explicit isolated-particle estimate, separate from calibrated volume descriptor.
w=flux*(1-.826*A)*mask
currents=[]
for d in [130,155,184]:
    i=np.where(DIAMETER==d)[0]
    spectrum=np.array([np.interp(d,DIAMETER,p.kernel[:,j]) for j in range(len(WAVELENGTH))])
    for spacing in [500,1000,1500]:
        cross_fraction=np.pi*d*d/(4*spacing*spacing)
        dj=E_CHARGE*2*np.sum(w*spectrum)*cross_fraction*.1
        currents.append(dict(d=d,P=spacing,delta_mA_cm2=float(dj),gain_percent=float(100*dj/j0),measured13_over_prediction=float(.131/(dj/j0))))
summary['single_scattering']=currents
summary['gain_spacing_sensitivity']=[dict(P=P,G=float((p.basis(np.array([[160,.1,P,0,1.53,880,60,0,1]]))[0])[0,0]),elasticity=float(-2+(2*P/160)/np.expm1(2*(P/160-1)))) for P in [180,210,295,400,1000,1500]]
(OUT/'analysis.json').write_text(json.dumps(summary,indent=2))
print(json.dumps(summary,indent=2))
