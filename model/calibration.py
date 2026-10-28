"""Table S1 transcribed independently; S4 nonnegative weighted calibration."""
import numpy as np
from scipy.optimize import nnls
from physics import response

DESIGNS=np.array([
 [130,.1,1000,0,1.53,880,60,0,1],
 [155,.1,1000,0,1.53,880,60,0,1],
 [150,.2,400,0,1.59,500,200,0,1],
 [150,.2,295,0,1.59,500,200,0,1],
 [150,.2,210,0,1.59,500,200,0,1],
 [150,.2,180,0,1.59,500,200,0,1]])
OBSERVED=np.array([[13.1,1.9,-.5],[11.3,2.9,.7],[5.2,-.1,-2.9],[7.5,2.1,.1],[0,1,.6],[4.2,-1.9,-4.7]])/100
NAMES=['Planar M','Planar L','Mesoporous 1:180','Mesoporous 1:120','Mesoporous 1:60','Mesoporous 1:30']
STD=np.array([.02,.01,.026]);PIXELS=20
SE=STD/np.sqrt(PIXELS)

def fit(basis,y):
    a=np.zeros((len(basis),3,4));g,p=basis.T
    a[:,0,0]=g;a[:,1,1]=g;a[:,1,2]=-p;a[:,2,3]=-p
    a=(a/SE[None,:,None]).reshape(-1,4);b=(y/SE).ravel()
    active=np.linalg.norm(a,axis=0)>1e-12;t=np.zeros(4)
    t[active]=nnls(a[:,active],b)[0]
    return t

def calibrate(physics,seed=1703):
    basis,mass=physics.basis(DESIGNS);rng=np.random.default_rng(seed)
    coefficients=[];boots=[]
    for indices in [np.arange(2),np.arange(2,6)]:
        coefficients.append(fit(basis[indices],OBSERVED[indices]))
        boots.append([fit(basis[j],OBSERVED[j]) for j in (rng.choice(indices,len(indices),replace=True) for _ in range(200))])
    boots=np.array(boots);choices=np.random.default_rng(seed+1).choice(200,5,replace=False)
    return dict(coefficients=np.array(coefficients).tolist(),bootstrap=boots.tolist(),member_coefficients=boots[:,choices].transpose(1,0,2).tolist(),member_indices=choices.tolist(),seed=seed,names=NAMES,designs=DESIGNS.tolist(),observed=OBSERVED.tolist(),predicted=response(DESIGNS,basis,coefficients).tolist(),pixel_std=STD.tolist(),pixels=PIXELS,standard_errors=SE.tolist(),uncertainty_status='provisional shared estimates, authorised by the user',unidentified={'mesoporous':['gamma','delta']},captured_probability=mass.tolist())
