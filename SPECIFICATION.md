# Scientific implementation trace

Reference: the revised manuscript and Supplementary Information for
*Machine-Learned Selection of the Size and Placement of Mie-Resonant Silicon
Nanoparticles in Perovskite Solar Cells*.

| Paper item | Implementation | Verification |
|---|---|---|
| Table 1 | Nine design entries; side is an annotation | Bounds and categorical inputs |
| Eqs. 1–4; Supplement S1 | Mie coefficients and forward-weighted scattering | Independent cylindrical-Bessel formulation; absorption and asymmetry checks |
| Eq. 5 | Uncollected photon flux, η = 0.826; one irradiance conversion | Optical maximum at 184 nm; Python/browser agreement |
| Eqs. 6–7; S2 | Finite-grid trapezoid size average | Monodisperse limit and integration-mass diagnostics |
| Eq. 8 | Normalised gain with array suppression | Reference normalisation and coupling optima |
| Eq. 9 | Exposed-cap-only electrical penalty | Covered/submerged cap and doping checks |
| Eq. 10 | Linearised relative responses | Calibration and browser agreement |
| S3 | Sref = 0.013623887003006666 nm⁻¹; Gref = 1.3623511849532262e−8 nm⁻³; Πref = 0.050265482457436686 | Independent recomputation |
| Eq. 11; S4 | Weighted nonnegative calibration; 200 resamples per architecture | Anchor transcription, identifiability and coefficient agreement |
| Forward model; S5 | Eight inputs, three 64-unit tanh layers, three linear outputs | Gradients and saved holdout populations |
| Tandem inverse; S5 | Three targets plus four context inputs; two 64-unit tanh layers; four bounded outputs | Frozen-forward gradient, direct residuals and browser parity |
| Ensemble | Member-wise scalarisation; population variance with 1/B | Python/browser agreement |
| Supplement acquisition example | 101 diameters, reference context, 200 direct calibration draws | Risk-adjusted 184 nm; uncertainty 158 nm; maximum-gain 182 nm |

The nominal demonstration (8,000 designs) and calibrated ensemble (12,000
designs) are separate benchmarks. Their actual metrics and inverse residuals
are included in the verification report. A constant target has undefined R².

Interactive selection is an exploratory extension over 512 seeded candidates,
using the five-member surrogate ensemble and the same selection criteria.
It does not replace the Supplement's fixed-context acquisition example.

The stated grids, provisional calibration errors, real-index host approximation,
unidentified mesoporous cap coefficients and local linearised response define
the scope of interpretation. Numerical checks and surrogate agreement do not
establish independent experimental validation or a continuous global optimum.
