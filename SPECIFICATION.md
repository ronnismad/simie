# Specification and implementation trace

Authority: `main_PNFA_V2.5.tex` (SHA256 in README), with S1–S5 of
`SupplPNFA.pdf` filling numerical and training details. The manuscript is not
edited. Figure annotations and previous implementations are not inputs.

| Paper item | New implementation | Acceptance check |
|---|---|---|
| Main Table 1 | `model/physics.py`, `BOUNDS`, `FEATURES`, `validate` | Browser and Python boundary cases |
| Main displayed Eqs. 1–4; S1 | `mie` | Independent half-integer Bessel formula, nine S6 points; absorption and asymmetry on full S2 grid |
| Spectral weight, displayed Eq. 5 | `spectral`, `descriptor`; `site/physics.mjs` | Python/browser parity; single photon conversion; no collection-deficit substitution |
| Descriptor and lognormal average, displayed Eqs. 6–7 | `descriptor` | Stated S2 grid and trapezoid prescription; explicit zero-width limit; captured-mass diagnostic |
| Array gain, displayed Eq. 8 | `basis` | Suppression, P<d zero gain, reference normalisation |
| Exposed cap, displayed Eq. 9 | `basis` | Fully covered and submerged caps give zero penalty; p-type factor 0.85 |
| Relative responses, displayed Eq. 10 | `response` | Direct reference evaluations; browser parity |
| S3 reference values | `PaperPhysics.__init__` | Sref approximately 6.64e-3; G/Gref=Pi/Piref=1 at reference |
| Main calibration objective; S4 | `model/calibration.py` | Exact S1 anchor transcription; WLS synthetic recovery; nonnegative coefficients; unidentified mesoporous terms |
| Main forward network and loss; S5 | `model/network.py`, `model/train.py` | Finite-difference gradients; all fresh full-batch training steps; exported inference parity |
| Main tandem inverse and bounded output; S5 | `train_one`, inverse stage | Forward weights frozen; bounded variables; original-physics re-evaluation; inverse export parity |
| Ensemble mean and spread | `site/networks.mjs`, `site/physics.mjs` | Scalarise each member before SD; population 1/B variance |
| Risk-adjusted and acquisition selection | `PaperNetworks.select` | Same finite candidates and threshold for both criteria; no added energy constraint; selected points independently recalculated |

Network context consists of five fixed quantities: Eg, absorber thickness,
transport thickness (selecting architecture), side and doping. The four bounded
free quantities are diameter, dispersion, spacing and shell. Fixing doping as
context is explicit; it is not differentiated as a continuous binary decision.

## Recorded implementation choices for validation

- Main text versus S5: nine design inputs versus eight network inputs. Follow
  the main-table nine inputs; no invented side dependence in physical labels.
- Spectral Phi terminology versus lambda/(hc): use irradiance before exactly
  one photon conversion. Eta is absent from the printed descriptor and is not
  silently introduced. Diagnostic current alone uses the discussed eta=0.83.
- Infinite-distribution notation versus finite S2 numerical grid: follow the
  supplement's explicit numerical prescription and show its integration-mass
  limitations. Do not make an undisclosed tail correction.
- Main and SI report different holdout values. Measure the new networks'
  actual holdout metrics; do not claim those earlier numerical results.
- S5's 8,000-design nominal-coefficient demonstration is distinct from the
  12,000-design calibrated ensemble. This release trains the latter; it does
  not claim to reproduce that separate nominal demonstration.

## Interpretation limits

Uncertainty estimates are provisional, authorised shared estimates. Gamma and
delta cannot be identified for the mesoporous anchors. Side has no specified
distinct optical law. Absolute voltage and fill-factor baselines are not
provided here, so their absolute feasibility cannot be established. The
linearised response can exceed a solar-current ceiling when extrapolated;
the app reports rather than clips it. No amount of surrogate accuracy removes
that shared limitation. The descriptor's boundary maximum is not a globally
established optimum. Tests establish software consistency, not validity of every
approximation or experimental accuracy.
