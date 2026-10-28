"""Re-evaluate the manuscript benchmarks using the deployable scientific assets."""
import os
os.environ['OPENBLAS_NUM_THREADS']='1'
import json,subprocess,sys
from pathlib import Path
import numpy as np
from physics import PaperPhysics,ROOT,response
from network import encode,context
from verify import reconstruct

BASE=ROOT.parent
def main():
    folder=BASE/'verification/benchmarks'
    expected=json.loads((folder/'analysis.json').read_text())
    subprocess.run([sys.executable,'-B',str(BASE/'analyse_benchmarks.py')],check=True,capture_output=True)
    actual=json.loads((folder/'analysis.json').read_text())
    def compare(a,b):
        if isinstance(a,dict):
            assert a.keys()==b.keys()
            for k in a:compare(a[k],b[k])
        elif isinstance(a,list):
            assert len(a)==len(b)
            for x,y in zip(a,b):compare(x,y)
        elif isinstance(a,(int,float)):np.testing.assert_allclose(a,b,rtol=1e-10,atol=1e-12)
        else:assert a==b
    compare(expected,actual)
    assert actual['peak_nm']==184
    assert list(actual['optima'].values())==[186,140,104,68]
    physics=PaperPhysics(np.fromfile(BASE/'site/assets/mie-kernel.bin',dtype='<f8').reshape(126,291))
    models=json.loads((BASE/'site/assets/networks.json').read_text())['members']
    nominal=json.loads((folder/'nominal-networks.json').read_text())
    models=[dict(forward=nominal['forward'],x_scaler=nominal['xs'],y_scaler=nominal['ys'],coefficients=nominal['coefficients']),*models]
    reports=json.loads((folder/'benchmarks.json').read_text())
    errors=[]
    for m,report in zip(models,reports):
        data=np.load(folder/(report['name']+'-holdout.npz'))
        x=data['designs'];truth,_=physics.evaluate(x,m['coefficients'])
        np.testing.assert_allclose(truth,data['true'],rtol=1e-11,atol=1e-12)
        f=reconstruct(m['forward']);xs=m['x_scaler'];ys=m['y_scaler']
        pred=f.forward((encode(x)-xs['mean'])/xs['scale'])*ys['scale']+ys['mean']
        np.testing.assert_allclose(pred,data['pred'],rtol=1e-10,atol=1e-12)
        v=((truth-truth.mean(0))**2).sum(0)
        metrics=dict(r2=[float(1-((truth[:,j]-pred[:,j])**2).sum()/v[j]) if v[j]>1e-20 else None for j in range(3)],mae=(100*abs(truth-pred).mean(0)).tolist())
        compare(report['metrics'],metrics)
        if 'inverse' in m:
            case=report['inverse'];designs=np.array(case['designs']);target=np.array(case['target_percent'])/100
            cs=m['context_scaler'];inp=np.column_stack([(target-ys['mean'])/ys['scale'],(context(designs)-cs['mean'])/cs['scale']])
            free=reconstruct(m['inverse']).forward(inp)*np.array([200,.25,1350,1])+np.array([60,0,150,0])
            np.testing.assert_allclose(free,designs[:,:4],rtol=1e-11,atol=1e-9)
            direct,_=physics.evaluate(designs,m['coefficients'])
            np.testing.assert_allclose(100*direct,case['direct_percent'],rtol=1e-10,atol=1e-10)
        errors.append(dict(name=report['name'],holdout_designs=len(x),max_prediction_error=float(abs(pred-data['pred']).max())))
    out=dict(passed=True,analysis_recomputed=True,holdouts=errors,inverse_cases_checked=15)
    (BASE/'verification/benchmark-checks.json').write_text(json.dumps(out,indent=2))
    print(json.dumps(out,indent=2))

if __name__=='__main__':main()
