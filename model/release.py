"""Require complete new weights and passing cross-language checks before release."""
import json,hashlib
from pathlib import Path
import numpy as np
BASE=Path(__file__).resolve().parents[1]

def main():
    assets=BASE/'site/assets';model=json.loads((assets/'networks.json').read_text())
    # Keep downloadable checksums stable across Windows and Linux line endings.
    for path in [*assets.glob('*.json'),*[BASE/'verification'/n for n in ['browser-parity.json','inverse-direct-checks.json','benchmark-checks.json']]]:
        path.write_bytes(path.read_bytes().replace(b'\r\n',b'\n'))
    checks=json.loads((BASE/'verification/browser-parity.json').read_text())
    if not checks['passed'] or checks['neural'] is None: raise RuntimeError('Fresh network and direct-physics parity checks must pass')
    if model['n_designs']!=12000 or len(model['members'])!=5 or model['forward_steps']!=4000 or model['inverse_steps']!=4000: raise RuntimeError('Incomplete S5 training')
    if not all(np.isfinite(np.asarray(layer)).all() for m in model['members'] for key in ['forward','inverse'] for layer in m[key]['W']): raise RuntimeError('Nonfinite weights')
    benchmark_checks=json.loads((BASE/'verification/benchmark-checks.json').read_text())
    if not benchmark_checks['passed']:raise RuntimeError('Manuscript benchmark checks must pass')
    summary=dict(implementation='SiMie 2.0',source='Computational companion to the revised manuscript and Supplementary Information',manuscript_sha256='f6c690ef989c695a654b8645d0f5c95e15dc9925dbc90858e16d386392d67759',training={'designs':12000,'members':5,'forward_steps':4000,'inverse_steps':4000,'sampling_seed':4101,'network_seed':4201,'bootstrap_seed':1,'member_selection_seed':0,'forward_inputs':8,'inverse_inputs':7},browser_parity=checks,benchmark_checks=benchmark_checks,manuscript_benchmarks=json.loads((BASE/'verification/benchmarks/benchmarks.json').read_text()),reference_calculations=json.loads((BASE/'verification/benchmarks/analysis.json').read_text()),forward_holdout=[m['test_metrics'] for m in model['members']],inverse_direct_checks=json.loads((BASE/'verification/inverse-direct-checks.json').read_text()),scope='Computational reproduction of the revised manuscript. Holdout agreement is with the physical model, not independent experimental validation. Extrapolation and finite-grid diagnostics retain the stated scope of the equations.')
    summary['implementation_files_sha256']={str(p.relative_to(BASE)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted([*(BASE/'model').glob('*.py'),*(BASE/'site').glob('*.mjs'),*(BASE/'site').glob('*.html'),*(BASE/'site').glob('*.css')])}
    (assets/'verification.json').write_bytes(json.dumps(summary,indent=2).encode('utf-8'))
    hashes={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in assets.iterdir() if p.name!='release-hashes.json'}
    (assets/'release-hashes.json').write_bytes(json.dumps(hashes,indent=2).encode('utf-8'))
    print('Release checks passed; scientific verification and asset hashes written.')

if __name__=='__main__':main()
