"""Require complete new weights and passing cross-language checks before release."""
import json,hashlib
from pathlib import Path
import numpy as np
BASE=Path(__file__).resolve().parents[1]

def main():
    assets=BASE/'site/assets';model=json.loads((assets/'networks.json').read_text())
    checks=json.loads((BASE/'verification/browser-parity.json').read_text())
    if not checks['passed'] or checks['neural'] is None: raise RuntimeError('Fresh network and direct-physics parity checks must pass')
    if model['n_designs']!=12000 or len(model['members'])!=5 or model['forward_steps']!=4000 or model['inverse_steps']!=4000: raise RuntimeError('Incomplete S5 training')
    if not all(np.isfinite(np.asarray(layer)).all() for m in model['members'] for key in ['forward','inverse'] for layer in m[key]['W']): raise RuntimeError('Nonfinite weights')
    summary=dict(implementation='SiMie 1.0',source='Fresh implementation from main_PNFA_V2.5 and SupplPNFA; original data only',manuscript_sha256='ba9531ffb6abe313c168081aefc3eae4df10197fd4d44526e1129f740feb6f97',training={'designs':12000,'members':5,'forward_steps':4000,'inverse_steps':4000,'sampling_seed':4101,'network_seed':4201,'bootstrap_seed':1703},browser_parity=checks,forward_holdout=[m['test_metrics'] for m in model['members']],inverse_direct_checks=json.loads((BASE/'verification/inverse-direct-checks.json').read_text()),scope='Software consistency checks only; no independent experimental validation. Photon-budget and S2-grid limits are diagnostics and do not change the equations.')
    summary['implementation_files_sha256']={str(p.relative_to(BASE)).replace('\\','/'):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted([*(BASE/'model').glob('*.py'),*(BASE/'site').glob('*.mjs'),*(BASE/'site').glob('*.html'),*(BASE/'site').glob('*.css')])}
    (assets/'verification.json').write_text(json.dumps(summary,indent=2))
    hashes={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in assets.iterdir() if p.name!='release-hashes.json'}
    (assets/'release-hashes.json').write_text(json.dumps(hashes,indent=2))
    print('Release checks passed; scientific verification and asset hashes written.')

if __name__=='__main__':main()
