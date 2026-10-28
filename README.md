# SiMie

**Mie-resonant silicon nanoparticle design for perovskite solar cells.**

A fresh, auditable implementation of the equations and methods in
`main_PNFA_V2.5.tex` and `SupplPNFA.pdf`. It computes the direct physical model
in the browser and provides a newly trained forward/inverse ensemble.
No earlier implementation, saved predictions, neural weights or Mie lookup
table is loaded. The manuscript and all legacy folders are preserved.

**App:** https://ronnismad.github.io/simie/

## Scientific scope

- Main-table nine-entry design vector, bounds and 120 nm architecture threshold.
- Green silicon and Phillips MAPbI3 optical data; nonabsorbing real-index host.
- Fresh Mie coefficients, absorption, asymmetry and forward-weighted scattering.
- Printed absorption-deficit weight, with a single irradiance-to-photon conversion.
- Exact S2 grids: wavelengths 320–900 nm, diameters 50–300 nm, both at 2 nm.
  The stated trapezoid size average is retained without renormalising tails;
  zero dispersion is the monodisperse limit. Numerical grid limitations are flagged.
- Normalised gain with near-field suppression, exposed-cap-only electrical cost,
  and the printed linearised current, voltage and fill-factor responses.
- Independently transcribed six Table S1 anchors, nonnegative weighted calibration,
  200 within-architecture bootstrap resamples and five member coefficient sets.
- New 12,000-design population, 80/20 split, He-normal tanh networks, full-batch
  Adam, 4,000 steps per stage/member, frozen-forward tandem inverse and S5's
  fabrication penalty. P and transport thickness are log-scaled/sampled.
- Browser-only evaluation, diameter sweeps, inverse targets, finite candidate
  risk-adjusted selection and next-experiment acquisition. Every proposal is
  checked against the original physical equations.

Provisional shared pixel SDs are 2.0%, 1.0%, 2.6% for relative J, V, FF,
with 20 pixels per condition, as authorised by the user. Standard errors are
SD/sqrt(20). These are not recovered condition-specific measurements.

## Specification decisions (do not hide these)

The supplied paper cannot be implemented without resolving conflicting text:

1. The printed spectral equation contains lambda/(hc), while its prose calls
   Phi a photon flux. ASTM supplies irradiance, converted once. Eta=0.83 is
   mentioned in prose but absent from that equation; it is used only in a
   separately labelled diagnostic baseline current.
2. Main Table 1 has nine entries; S5 describes eight forward-network inputs.
   Nine main-table entries are retained, including side. Doping is represented
   by the stated factor 1 or 0.85. No back-side optical kernel is invented.
3. S2's diameter-grid integration loses lognormal tails and can under-resolve
   very narrow distributions. This implementation preserves that prescription
   and reports its distribution integral instead of silently repairing it.
4. Mesoporous gamma/delta are unidentified at the anchors. Solver zeros are
   conventions, not measurements or evidence of zero uncertainty.
5. The equations do not saturate at a solar-current limit. Budget failures are
   diagnostics, not clips or added constraints. Failed proposals are explicitly
   unvalidated; selection is not reranked under an unstated physical constraint.
6. Direct optical evaluation gives a boundary maximum at 260 nm in the main
   design interval. Reported 184 nm is not a target used to adjust the code.

The five-member spread is conditional calibration uncertainty. It does not
measure shared model error or experimental validation. A necessary check passing
does not establish device feasibility. Selection searches 512 seeded candidates,
not a certified continuous global optimum. The acquisition threshold is the upper
quartile over that same candidate set. Targets can be unreachable.

## Run locally

Python 3.13, Node.js 22 or later:

```text
python -m pip install -r requirements.txt
python -B model/build.py --verify-only
python -B -m unittest discover -s tests -v
python -B model/verify.py
node tests/check_browser.mjs
python -m http.server 8765 --directory site
```

Open http://localhost:8765. Use an HTTP server; browsers cannot load module
workers or scientific assets correctly from a file:// URL. All deployed paths
are relative, including worker assets, so repository-subpath hosting works.
There are no runtime CDN, font, analytics, API or backend dependencies.

The interface supports English and Russian, light and dark themes, live updates
or explicit **Estimate**, and a dynamic network diagram displaying actual
activations of all 64 neurons per hidden layer for a selectable ensemble member.
Language and theme preferences persist locally; they do not change calculations.

To reproduce training from zero weights (does not consume old weights):

```text
python -B model/build.py
python -B model/train.py --workers 2
python -B model/verify.py
node tests/check_browser.mjs
python -B model/release.py
```

Sampling seed 4101, network/split seed 4201, bootstrap seed 1703. Learning rate
0.003 for 2,500 steps then 0.001 to step 4,000; Adam betas 0.9/0.999,
epsilon 1e-8. Each member uses the same initial seed/split, so bootstrap
calibration variation is isolated. Forward 9–64–64–64–3; inverse
(3 targets + 5 context entries)–64–64–4, with bounded outputs for diameter,
dispersion, spacing and shell. Context fixes bandgap, absorber thickness,
transport thickness, side and doping. Standardisation uses training data only.

## Verification and data

- Tests use an independent half-integer cylindrical-Bessel formulation to check
  the Mie coefficients, and check absorption/asymmetry over the full S2 grid.
- Calibration identifiability, reference normalisation, cap/overlap rules,
  finite-difference neural gradients, zero dispersion and grid truncation are tested.
- Browser parity includes all calibration anchors, random designs, boundary and
  narrow-dispersion cases, fresh network predictions and inverse export.
- `verification/` contains the numerical audit; `site/assets/verification.json`
  is the public summary. Passing software tests is not experimental validation.
- Optical tables are CC0 inputs from refractiveindex.info. ASTM G173 CSV is
  the reference spectrum distributed by pvlib. Original input hashes are in
  `site/assets/provenance.json`.
- Manuscript source SHA256:
  `ba9531ffb6abe313c168081aefc3eae4df10197fd4d44526e1129f740feb6f97`.
  The manuscript itself is not included in the public site.

## GitHub Pages

In repository **Settings → Pages**, select **GitHub Actions** as source.
The included workflow runs physical/browser checks and uploads only `site/`.
Pushes to `main` deploy; other branches and pull requests run checks only.
The implementation follows GitHub's [custom workflow documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
