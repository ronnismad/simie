"""Fresh NumPy tanh networks and full-batch Adam, Supplement S5."""
import numpy as np

class Standard:
    def __init__(self,x):
        self.mean=x.mean(0);self.scale=x.std(0);self.scale[self.scale<1e-12]=1
    def enc(self,x): return (x-self.mean)/self.scale
    def dec(self,x): return x*self.scale+self.mean
    def json(self): return {'mean':self.mean.tolist(),'scale':self.scale.tolist()}

def encode(x):
    a=x[:,[0,1,2,3,4,5,6,8]].copy();a[:,[2,6]]=np.log(a[:,[2,6]]);return a

def context(x):
    a=x[:,[4,5,6,8]].copy();a[:,2]=np.log(a[:,2]);return a

class Network:
    def __init__(self,sizes,rng,sigmoid=False):
        self.W=[rng.normal(0,np.sqrt(2/a),(a,b)) for a,b in zip(sizes[:-1],sizes[1:])]
        self.b=[np.zeros(b) for b in sizes[1:]];self.sigmoid=sigmoid
        self.params=[*self.W,*self.b];self.m=[np.zeros_like(p) for p in self.params];self.v=[np.zeros_like(p) for p in self.params]
    def forward(self,x):
        self.activations=[x]
        for i,(w,b) in enumerate(zip(self.W,self.b)):
            z=x@w+b
            x=np.tanh(z) if i<len(self.W)-1 else 1/(1+np.exp(-np.clip(z,-60,60))) if self.sigmoid else z
            self.activations.append(x)
        return x
    def backward(self,gradient,update=True):
        dw=[];db=[]
        for i in range(len(self.W)-1,-1,-1):
            out=self.activations[i+1]
            if i<len(self.W)-1: gradient=gradient*(1-out*out)
            elif self.sigmoid: gradient=gradient*out*(1-out)
            dw.append(self.activations[i].T@gradient);db.append(gradient.sum(0));gradient=gradient@self.W[i].T
        if update:self.grad=[*dw[::-1],*db[::-1]]
        return gradient
    def adam(self,step):
        lr=.003 if step<=2500 else .001
        for p,g,m,v in zip(self.params,self.grad,self.m,self.v):
            m*=.9;m+=.1*g;v*=.999;v+=.001*g*g
            p-=lr*(m/(1-.9**step))/(np.sqrt(v/(1-.999**step))+1e-8)
    def json(self):return {'W':[w.tolist() for w in self.W],'b':[b.tolist() for b in self.b],'sigmoid':self.sigmoid}
