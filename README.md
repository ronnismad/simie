# SiMie

**Mie-resonant silicon nanoparticle design for perovskite solar cells.**

A computational companion to the revised manuscript and Supplementary Information.
SiMie evaluates the physical equations in the browser and provides the calibrated
forward/inverse ensemble used in the revised computational benchmarks.

**[Open SiMie](https://ronnismad.github.io/simie/)**

## Paper and authors

**Machine-Learned Selection of the Size and Placement of Mie-Resonant Silicon Nanoparticles in Perovskite Solar Cells**

S. Chatterjee, A. Furasova, S. Makarov.

School of Physics and Engineering, **ITMO University**, St. Petersburg, Russia;
Qingdao Innovation and Development Center, Harbin Engineering University, Qingdao, China.

ITMO logo assets come from the university's [brand resources](https://itmo.ru/ru/page/213/logotipy_i_firmennyy_stil.htm).

## Reproduced computational results

| Calculation | Revised benchmark |
|---|---|
| Monodisperse optical descriptor, reference absorber | Maximum at **184 nm** |
| Reference objective, coupling 0 / 0.3 / 1 / 3 | **186 / 140 / 104 / 68 nm** |
| Nominal 8,000-design holdout R², current / voltage / fill factor | **0.9670 / 0.9960 / 0.9971** |
| Calibrated planar current changes, fractions M / L | **11.503% / 12.741%** |
| Supplement acquisition example: risk-adjusted / uncertainty / maximum-gain diameter | **184 / 158 / 182 nm** |

The optical maximum and device objective are different quantities. The latter
includes dispersion and array/electrical terms. The acquisition example fixes the
reference context and uses all 200 calibration resamples over 101 diameters.
The app's interactive selection explores 512 seeded candidates with the five
trained networks; it is explicitly labelled exploratory.

The release checks exported networks against saved holdout populations, checks
inverse proposals against the direct equations, and compares Python with the
browser across 116 physical designs. Detailed results are available in the
[verification report](https://ronnismad.github.io/simie/assets/verification.json).

## Equations and data

- Green silicon and Phillips MAPbI₃ optical constants, real-index host, and ASTM
  G173 global-tilt irradiance converted to photon flux once.
- Uncollected-photon weight: `w = φ[1 − η(1 − exp(−αt))]`, with `η = 0.826`.
- Supplement grids: wavelengths 320–900 nm and diameters 50–300 nm, both at 2 nm.
  Trapezoid lognormal averaging retains the stated finite grid; zero dispersion
  uses the monodisperse limit.
- Normalised optical gain, array suppression, exposed-cap electrical penalty,
  and linearised current, voltage and fill-factor responses.
- Six calibration conditions; nonnegative weighted least squares; 200 bootstrap
  resamples per architecture and five selected network members.
- Provisional shared pixel SDs of 2.0%, 1.0% and 2.6% for current, voltage and
  fill factor, with an assumed 20 pixels per condition. Standard errors are
  SD/√20, as disclosed in the Supplement.

## Neural models

The forward network is **8–64–64–64–3**; the bounded tandem inverse is
**7–64–64–4**. Side remains a design annotation because the optical equations do
not specify a separate back-side kernel. The inverse receives three targets and
four context inputs: bandgap, absorber thickness, transport thickness and doping.

Spacing and transport thickness are log-scaled; standardisation uses training
data only. The nominal demonstration uses 8,000 designs (sampling seed 0);
the calibrated ensemble uses 12,000 designs (seed 4101), an 80/20 split and
initialisation seed 4201. Bootstrap seed 1 is reset per architecture; member
selection uses seed 0. Full-batch Adam runs 4,000 steps per stage: learning rate
0.003 for 2,500 steps, then 0.001; betas 0.9/0.999 and epsilon 1e-8.
The inverse learns through a frozen forward network with the stated dispersion penalty.

## Interpretation

These are computational reproduction checks. Holdout accuracy measures agreement
with the physical model, not independent experimental validation. Inverse target
residuals are reported explicitly; the three first-member current residuals in
the Supplement are −1.019, −1.151 and −3.874 percentage points.

The bootstrap spread is conditional calibration variation. Mesoporous cap-loss
coefficients cannot be identified from zero-cap calibration conditions. The
finite diameter grid can under-resolve very narrow distributions. The linearised
response can exceed its physical range under extrapolation; the app retains
current-budget and positivity checks without clipping the equations. These scope
conditions are also discussed in the revised manuscript and Supplement.

## Run and verify

Python 3.13 and Node.js 22 or later:

```text
python -m pip install -r requirements.txt
python -B model/build.py --verify-only
python -B -m unittest discover -s tests -v
python -B model/verify.py
node tests/check_browser.mjs
python -B model/check_benchmarks.py
python -B model/release.py
node tests/check_site.mjs
python -m http.server 8765 --directory site
```

Open http://localhost:8765. The interface supports English/Russian, light/dark
themes, live updates or **Estimate**, and actual network activations.
Calculations run locally in the browser, without a backend or runtime CDN.

To recompute benchmark training from initial weights:

```text
python -B model/build.py
python -B reproduce_benchmarks.py
python -B analyse_benchmarks.py
```

To train and export the calibrated browser ensemble directly, run
`python -B model/train.py --workers 2`, then run the verification sequence above.
Scientific data and model-file paths in these commands refer to files included
in this repository. Optical input checksums accompany the downloadable release.

## Deployment

GitHub Actions verifies the model and publishes `site/` to GitHub Pages on pushes
to `main`. The manuscript and response letter are maintained separately.
