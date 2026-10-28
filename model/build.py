"""Recompute optics/calibration and export static browser inputs from source data."""
import os
os.environ['OPENBLAS_NUM_THREADS']='1'
import json,hashlib
import argparse
from pathlib import Path
import numpy as np
from physics import PaperPhysics,WAVELENGTH,DIAMETER,PVK,photon_flux,REFERENCE,ROOT,BOUNDS,FEATURES
from calibration import calibrate

def build(verify_only=False):
    target=ROOT.parent/'site/assets';target.mkdir(parents=True,exist_ok=True)
    (ROOT/'cache').mkdir(parents=True,exist_ok=True)
    physics=PaperPhysics()
    if verify_only:
        published=np.fromfile(target/'mie-kernel.bin',dtype='<f8').reshape(126,291)
        if not np.allclose(physics.kernel,published,rtol=1e-11,atol=1e-11):raise RuntimeError('Fresh optics disagree with published release')
        fresh=calibrate(physics);saved=json.loads((target/'calibration.json').read_text())
        for key in ['coefficients','member_coefficients','bootstrap']:
            if not np.allclose(fresh[key],saved[key],rtol=1e-10,atol=1e-10):raise RuntimeError(f'Fresh calibration disagrees: {key}')
        np.save(ROOT/'cache/kernel.npy',physics.kernel)
        print('Independent optics and calibration agree with release; published assets preserved.',flush=True)
        return physics,fresh
    physics.kernel.astype('<f8').tofile(target/'mie-kernel.bin')
    np.save(ROOT/'cache/kernel.npy',physics.kernel)
    calibration=calibrate(physics)
    (target/'calibration.json').write_text(json.dumps(calibration,separators=(',',':')))
    data=dict(wavelength=WAVELENGTH.tolist(),diameter=DIAMETER.tolist(),pvk=PVK.tolist(),photon_flux=photon_flux().tolist(),reference=REFERENCE.tolist(),bounds=BOUNDS.tolist(),features=FEATURES,normalisation=dict(S=physics.sref,G=physics.gref,Pi=physics.piref),grid='S2: 320–900 nm / 2 nm; 50–300 nm / 2 nm; trapezoid lognormal average without tail renormalisation',manuscript_sha256='ba9531ffb6abe313c168081aefc3eae4df10197fd4d44526e1129f740feb6f97')
    (target/'optics.json').write_text(json.dumps(data,separators=(',',':')))
    manifest={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in (ROOT/'data').iterdir()}
    manifest['mie-kernel.bin']=hashlib.sha256((target/'mie-kernel.bin').read_bytes()).hexdigest()
    (target/'provenance.json').write_text(json.dumps(manifest,indent=2))
    print('Fresh Mie grid, six-condition calibration and bootstrap exported.',flush=True)
    return physics,calibration

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--verify-only',action='store_true');args=parser.parse_args();build(args.verify_only)
