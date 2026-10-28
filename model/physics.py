"""Independent implementation of main_PNFA_V2.5 and Supplement S1-S3.

The wavelength and diameter grids and trapezoid rule are exactly S2's.
No legacy model code, weights, kernels or predictions are loaded.
"""
from pathlib import Path
import numpy as np
from scipy.special import spherical_jn, spherical_yn

ROOT = Path(__file__).resolve().parent
WAVELENGTH = np.arange(320., 901., 2.)
DIAMETER = np.arange(50., 301., 2.)
BOUNDS = np.array([[60,260],[0,.25],[150,1500],[0,1],[1.45,1.75],[300,1000],[30,400],[0,1],[.85,1.]])
REFERENCE = np.array([160.,.1,1000.,0.,1.53,880.,60.,0.,1.])
H, C, E_CHARGE = 6.62607015e-34, 299792458., 1.602176634e-19
HC = 1239.8419843320026
FEATURES = ['diameter_nm','relative_dispersion','spacing_nm','shell_coverage','bandgap_eV','absorber_nm','transport_nm','side','doping_factor']

def read_optics(path):
    active=False; rows=[]
    for line in path.read_text(encoding='utf-8').splitlines():
        if 'data: |' in line: active=True; continue
        if active:
            fields=line.split()
            if len(fields)==3: rows.append(list(map(float,fields)))
            elif rows: break
    a=np.array(rows); a[:,0]*=1000
    if len(a)<2: raise ValueError('Optical data missing')
    return a

SI=read_optics(ROOT/'data/Si_Green2008.yml')
PVK=read_optics(ROOT/'data/MAPbI3_Phillips.yml')
ASTM=np.loadtxt(ROOT/'data/ASTMG173.csv',delimiter=',',skiprows=2)

def interp(z,table,column):
    if np.any(np.asarray(z)<table[0,0]) or np.any(np.asarray(z)>table[-1,0]):
        raise ValueError('Optical table extrapolation is not permitted')
    return np.interp(z,table[:,0],table[:,column])

def mie(d, wavelength=WAVELENGTH):
    lam=np.atleast_1d(wavelength); host=interp(lam,PVK,1)
    q=np.pi*host*d/lam; m=(interp(lam,SI,1)+1j*interp(lam,SI,2))/host
    maximum=np.floor(q+4*np.cbrt(q)+3).astype(int)
    n=np.arange(1,maximum.max()+1)[:,None]; z=m*q
    j=spherical_jn(n,q); dj=spherical_jn(n,q,derivative=True)
    y=spherical_yn(n,q); dy=spherical_yn(n,q,derivative=True)
    jm=spherical_jn(n,z); djm=spherical_jn(n,z,derivative=True)
    psi=q*j; dpsi=j+q*dj; xi=q*(j+1j*y); dxi=j+q*dj+1j*(y+q*dy)
    pm=z*jm; dpm=jm+z*djm
    a=(m*pm*dpsi-psi*dpm)/(m*pm*dxi-xi*dpm)
    b=(pm*dpsi-m*psi*dpm)/(pm*dxi-m*xi*dpm)
    a=np.where(n<=maximum,a,0); b=np.where(n<=maximum,b,0)
    sca=2*np.sum((2*n+1)*(abs(a)**2+abs(b)**2),axis=0)/q**2
    ext=2*np.sum((2*n+1)*(a+b).real,axis=0)/q**2
    nn=n[:-1]
    adjacent=np.sum(nn*(nn+2)/(nn+1)*(a[:-1]*a[1:].conj()+b[:-1]*b[1:].conj()).real,axis=0)
    cross=np.sum((2*n+1)/(n*(n+1))*(a*b.conj()).real,axis=0)
    g=4*(adjacent+cross)/(q*q*sca)
    return sca,ext-sca,g

def photon_flux(lam=WAVELENGTH):
    return np.interp(lam,ASTM[:,0],ASTM[:,2])*np.asarray(lam)*1e-9/(H*C)

def absorption(eg,lam=WAVELENGTH):
    shifted=HC/(HC/np.asarray(lam)-(eg-1.59))
    return 4*np.pi*interp(shifted,PVK,2)/shifted

def validate(x):
    x=np.atleast_2d(np.asarray(x,float))
    if x.shape[1]!=9 or not np.isfinite(x).all(): raise ValueError('Nine finite inputs required')
    if np.any(x<BOUNDS[:,0]-1e-10) or np.any(x>BOUNDS[:,1]+1e-10): raise ValueError('Outside Table 1 bounds')
    if not np.isin(x[:,7],[0,1]).all() or not np.isin(x[:,8],[.85,1]).all(): raise ValueError('Invalid side or doping')
    return x

class PaperPhysics:
    def __init__(self,kernel=None):
        self.kernel=np.array([.5*(1+g)*qs-qa for qs,qa,g in (mie(d) for d in DIAMETER)]) if kernel is None else np.asarray(kernel)
        if self.kernel.shape!=(126,291): raise ValueError('Wrong S2 lookup shape')
        self.sref=self.descriptor(REFERENCE)[0][0]
        self.gref=self.sref/1e6*(-np.expm1(-(1000-160)/80))
        self.piref=np.pi*160*100/1e6

    def spectral(self,eg,tp):
        w=photon_flux()*np.exp(-absorption(eg)*tp)
        w=np.where(WAVELENGTH<HC/eg,w,0)
        return 1.5/DIAMETER*(self.kernel@w)/w.sum()

    def descriptor(self,x):
        x=np.atleast_2d(x); result=np.empty(len(x)); captured=np.empty(len(x))
        # Batch spectra, followed by S2 trapezoid integration. No tail renormalisation.
        for start in range(0,len(x),512):
            a=x[start:start+512]; w=photon_flux()[:,None]*np.exp(-absorption(a[:,4,None],WAVELENGTH[None,:]).T*a[:,5])
            w=np.where(WAVELENGTH[:,None]<HC/a[:,4],w,0)
            values=(1.5/DIAMETER[:,None])*(self.kernel@w)/w.sum(axis=0)
            for k,row in enumerate(a):
                d,sf=row[:2]
                if sf==0 or sf*sf==0:
                    result[start+k]=np.interp(d,DIAMETER,values[:,k]);captured[start+k]=1.;continue
                width=np.sqrt(np.log1p(sf*sf)); centre=np.log(d)-.5*width*width
                density=np.exp(-.5*((np.log(DIAMETER)-centre)/width)**2)/(DIAMETER*width*np.sqrt(2*np.pi))
                result[start+k]=np.trapezoid(values[:,k]*density,DIAMETER)
                captured[start+k]=np.trapezoid(density,DIAMETER)
        return result,captured

    def basis(self,x):
        x=validate(x); s,mass=self.descriptor(x);d,sf,p,shell,eg,tp,te,side,dop=x.T
        gain=s/p**2*(-np.expm1(-np.maximum(p-d,0)/(d/2)))
        cap=np.pi*d*np.maximum(d-te,0)/p**2*(1-shell)*dop
        return np.column_stack((gain/self.gref,cap/self.piref)),mass

    def evaluate(self,x,theta):
        x=validate(x);basis,mass=self.basis(x)
        return response(x,basis,theta),mass

def response(x,basis,theta):
    t=np.asarray(theta)[(np.asarray(x)[:,6]>120).astype(int)]
    g,pi=basis.T
    return np.column_stack((t[:,0]*g,t[:,1]*g-t[:,2]*pi,-t[:,3]*pi))

def sample(n,seed):
    rng=np.random.default_rng(seed);x=rng.uniform(BOUNDS[:,0],BOUNDS[:,1],(n,9))
    for j in [2,6]: x[:,j]=np.exp(rng.uniform(*np.log(BOUNDS[j]),n))
    x[:,7]=rng.integers(0,2,n);x[:,8]=np.where(rng.integers(0,2,n),.85,1.)
    return x
