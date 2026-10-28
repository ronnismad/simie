"""Independent numerical checks: conservation, grids, calibration and gradients."""
import os
os.environ['OPENBLAS_NUM_THREADS']='1'
import unittest,sys,json
from pathlib import Path
import numpy as np
from scipy.special import jv,yv
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'model'))
from physics import PaperPhysics,mie,interp,SI,PVK,REFERENCE,DIAMETER,ROOT,response,sample
from calibration import calibrate,fit,DESIGNS,OBSERVED
from network import Network,Standard,encode

class Tests(unittest.TestCase):
 @classmethod
 def setUpClass(cls): cls.p=PaperPhysics(np.load(ROOT/'cache/kernel.npy'))
 def test_reference_normalisation(self):
  b,_=self.p.basis(REFERENCE);np.testing.assert_allclose(b,[[1,1]],atol=1e-13)
  self.assertAlmostEqual(self.p.sref,0.013623887003006666,delta=1e-13)
 def test_mie_half_integer_bessel_reference(self):
  # Independently assemble each coefficient with cylindrical Bessel functions.
  for d in [100,160,220]:
   for lam in [450,600,800]:
    host=interp(lam,PVK,1);q=np.pi*host*d/lam;m=(interp(lam,SI,1)+1j*interp(lam,SI,2))/host
    n=np.arange(1,int(np.floor(q+4*np.cbrt(q)+3))+1)
    def riccati(z,hankel=False):
     f=lambda order:jv(order,z)+(1j*yv(order,z) if hankel else 0)
     value=np.sqrt(np.pi*z/2)*f(n+.5)
     derivative=np.sqrt(np.pi*z/2)*(f(n-.5)-n/z*f(n+.5))
     return value,derivative
    p,dp=riccati(q);pm,dpm=riccati(m*q);xi,dxi=riccati(q,True)
    a=(m*pm*dp-p*dpm)/(m*pm*dxi-xi*dpm);b=(pm*dp-m*p*dpm)/(pm*dxi-m*xi*dpm)
    sca=2*np.sum((2*n+1)*(abs(a)**2+abs(b)**2))/q**2
    ext=2*np.sum((2*n+1)*(a+b).real)/q**2
    nn=n[:-1];g=4/(q*q*sca)*(np.sum(nn*(nn+2)/(nn+1)*(a[:-1]*a[1:].conj()+b[:-1]*b[1:].conj()).real)+np.sum((2*n+1)/(n*(n+1))*(a*b.conj()).real))
    np.testing.assert_allclose(np.ravel(mie(d,[lam])),[sca,ext-sca,g],atol=1e-12,rtol=1e-12)
 def test_full_grid_conservation(self):
  for d in DIAMETER:
   qs,qa,g=mie(d);self.assertGreaterEqual(qa.min(),-1e-12);self.assertLessEqual(abs(g).max(),1+1e-12)
 def test_cap_and_near_field(self):
  x=np.tile(REFERENCE,(4,1));x[0,0]=200;x[0,2]=150;x[1,3]=1;x[2,6]=200;x[3,8]=.85
  b,_=self.p.basis(x)
  self.assertEqual(b[0,0],0);self.assertEqual(b[1,1],0);self.assertEqual(b[2,1],0);self.assertAlmostEqual(b[3,1],.85)
 def test_lognormal_monodisperse_and_s2_rule(self):
  x=REFERENCE.copy();x[1]=0;s,mass=self.p.descriptor(x)
  self.assertEqual(s[0],np.interp(x[0],DIAMETER,self.p.spectral(x[4],x[5])))
  x[1]=1e-320;tiny,_=self.p.descriptor(x);self.assertEqual(tiny[0],s[0])
  x[0]=260;x[1]=.25;_,mass=self.p.descriptor(x);self.assertLess(mass[0],.8)
 def test_calibration_and_zero_mesoporous_information(self):
  c=calibrate(self.p);t=np.array(c['coefficients']);self.assertTrue((t>=0).all());np.testing.assert_allclose(t[1,2:],[0,0])
  b,_=self.p.basis(DESIGNS);np.testing.assert_array_equal(b[2:,1],0)
  truth=np.array([.1,.02,.03,.01]);z=np.array([[1,.1],[.4,.8],[1.6,.3]])
  y=np.column_stack([truth[0]*z[:,0],truth[1]*z[:,0]-truth[2]*z[:,1],-truth[3]*z[:,1]])
  np.testing.assert_allclose(fit(z,y),truth,atol=1e-12)
 def test_network_gradients(self):
  rng=np.random.default_rng(8);n=Network([3,4,2],rng);x=rng.normal(size=(5,3));y=rng.normal(size=(5,2));diff=n.forward(x)-y
  gx=n.backward(2*diff/len(x));grad=n.grad[0].copy();eps=1e-6
  def loss():return np.sum((n.forward(x)-y)**2)/len(x)
  old=n.W[0][1,2];n.W[0][1,2]=old+eps;plus=loss();n.W[0][1,2]=old-eps;minus=loss();n.W[0][1,2]=old
  self.assertAlmostEqual(grad[1,2],(plus-minus)/(2*eps),delta=1e-7)
  old=x[2,1];x[2,1]=old+eps;plus=loss();x[2,1]=old-eps;minus=loss();x[2,1]=old
  self.assertAlmostEqual(gx[2,1],(plus-minus)/(2*eps),delta=1e-7)
 def test_tandem_gradient_and_frozen_forward(self):
  rng=np.random.default_rng(19);x=sample(5,13);xs=Standard(encode(x));f=Network([8,5,3],rng);inv=Network([8,5,4],rng,True)
  inputs=rng.normal(size=(5,8));target=rng.normal(size=(5,3));lo=np.array([60,0,150,0]);span=np.array([200,.25,1350,1])
  before=[p.copy() for p in f.params]
  unit=inv.forward(inputs);free=lo+span*unit;proposed=np.column_stack([free,x[:,4:]])
  diff=f.forward(xs.enc(encode(proposed)))-target
  grad=f.backward(2*diff/len(x),update=False)[:,:4]/xs.scale[:4];grad[:,2]/=free[:,2]
  penalty=np.maximum(0,.08-free[:,1]);grad[:,1]-=2*penalty/len(x)
  inv.backward(grad*span);analytic=inv.grad[0][1,2]
  def loss():
   free=lo+span*inv.forward(inputs);proposed=np.column_stack([free,x[:,4:]])
   return np.sum((f.forward(xs.enc(encode(proposed)))-target)**2)/len(x)+np.mean(np.maximum(0,.08-free[:,1])**2)
  old=inv.W[0][1,2];eps=1e-6;inv.W[0][1,2]=old+eps;plus=loss();inv.W[0][1,2]=old-eps;minus=loss();inv.W[0][1,2]=old
  self.assertAlmostEqual(analytic,(plus-minus)/(2*eps),delta=1e-7)
  inv.adam(1)
  for old,new in zip(before,f.params):np.testing.assert_array_equal(old,new)

if __name__=='__main__':unittest.main()
