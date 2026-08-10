# CR-08.1 — Final Polish & Freeze Candidate

## 1. Executive summary

CR-08.1 resolves the two competition-video validation findings that could affect a polished recording: residual English presentation copy and raw floating-point uncertainty ranges in Spanish Case Detail, plus the missing Escape path for standalone Presentation Mode. The implementation remains limited to the Climate Recovery presentation layer and its regression tests.

Verdict: **READY FOR FREEZE WITH ACCEPTED LOW-RISK DEBT**.

The only accepted debt is CR08V-03, a minor mobile autofocus offset observed on later guided steps. It does not hide the active target, controls, or narration, and correcting it safely would require changing the shared guided-scroll coordinator rather than applying a tiny local polish.

## 2. Baseline

- Repository: ORBI PVMetrics IA.
- Required branch: `competition/ai-climate-recovery-2026`.
- Baseline HEAD and upstream: `bc045e716c63be2dc7357a9a3728169405efe598`.
- Baseline divergence: `0 ahead / 0 behind`.
- Baseline worktree: clean.
- `package.json` blob: `697b086d62c42d464a8cc32765d68ce6f350b9ac` in HEAD and worktree.
- `package-lock.json` blob: `9f9014336f8cabf6836d6e2a3b3a41f8c2d73c0e` in HEAD and worktree.
- Protected `master` and backup references: `e552ec0b66338b7b7d2f1c41f7ffd49d73a68f7a`.
- Frozen tag object: `79e10a4fef888e50117c2be5dba744f620817323`; frozen baseline resolves to `e552ec0b66338b7b7d2f1c41f7ffd49d73a68f7a`.

## 3. Original findings

### CR08V-01 — Medium

Spanish Case Detail exposed residual English copy in KPI explanations and field-safety notes. Its uncertainty line rendered raw JavaScript numbers, including a visible binary floating-point tail such as `34587.630000000005–42273.77 kWh`, and left the internal uncertainty descriptor in English.

### CR08V-02 — Medium

Escape worked in Guided Demo and Competition Video Mode but did nothing when standalone Presentation Mode was active. The key listener was not installed unless Guided or Video state was active.

### CR08V-03 — Low, optional

On narrow mobile viewports, autofocus on later guided steps can leave a small portion of contextual heading/timing content above the viewport even though the target, narrative, and controls remain usable.

## 4. Root cause

- The existing localization adapter covered KPI explanations and action lists but did not localize `recoveryOpportunity.uncertainty.confidenceDescriptor`.
- The uncertainty range in `CaseDetailView` interpolated raw numeric values instead of using the deterministic presentation formatter.
- A few known presentation strings and value tooltips required explicit registry entries to avoid ambiguous language detection around the cognate word “factor”.
- The global keydown effect returned early for standalone Presentation Mode, so its Escape branch could never run.
- The explicit Presentation control used a toggle callback rather than a named semantic enter/exit path.

## 5. Changes made

- Added explicit ES/EN registry entries for the residual KPI, safety, and emission-factor tooltip strings.
- Added `formatPresentationNumber`, using locale-aware `Intl.NumberFormat` with at most two fractional digits.
- Reused that formatter in the shared value display and the Case Detail uncertainty range.
- Localized the uncertainty confidence descriptor and value tooltips in the existing presentation adapter.
- Added named `enterPresentationMode` and `exitPresentationMode` callbacks.
- Routed both the explicit Presentation control and standalone Escape through `exitPresentationMode`.
- Preserved keyboard priority as Video → Guided → Presentation, so one Escape produces one semantic exit.
- Added 13 focused regression tests, numbered 298–310.

No domain engine, scoring rule, fixture, emission factor, portfolio value, claim, dependency, package script, hero, CTA, or competition narrative was changed.

## 6. CR08V-01 localization result

Spanish Case Detail now renders the observed strings in Spanish:

- `Estimación contrafactual con un factor configurable ficticio; no es impacto verificado.`
- `Solo asesoría; siga los procedimientos aprobados de seguridad y autorización del sitio antes de cualquier actividad en terreno.`
- `Convención demostrativa interna de ±20%` for the inspected Aurora case.

English Case Detail retains the approved English copy. Status badges continue to use the localized status registry, including `Suficiente` in Spanish.

## 7. Numeric formatting result

Presentation numbers now use a single deterministic formatter:

- ES example: `34587.630000000005` → `34.587,63`.
- EN example: `34587.630000000005` → `34,587.63`.
- Browser ES Aurora example: `Incertidumbre: 7.840–11.760 kWh · Convención demostrativa interna de ±20%`.
- Browser EN Aurora example: `Uncertainty: 7,840–11,760 kWh · Internal demonstrative ±20% convention`.

No calculation or stored value changed; only presentation formatting changed.

## 8. CR08V-02 Escape result

Standalone Presentation Mode now installs the keyboard listener and handles Escape with the same `exitPresentationMode` callback used by the explicit exit control.

The exit hierarchy is explicit and mutually exclusive:

1. Active Competition Video exits through `exitVideo(false)`.
2. Otherwise, active Guided Demo exits through `exitGuided(true)`.
3. Otherwise, active Presentation Mode exits through `exitPresentationMode()`.

Browser evidence confirmed that both Escape and the explicit control preserve the selected Aurora Case Detail, scroll context, and focus on the Presentation control while changing its label and pressed state back to the free-mode values.

## 9. CR08V-03 decision

**ACCEPTED LOW-RISK POLISH DEBT**.

No CR08V-03 code was implemented. The existing mobile coordinator already keeps the focused anchor, Guided shell, controls, and narration usable. At 360×800, the first guided target was entirely inside the viewport (`top 480.26`, `bottom 481.26`) with no horizontal page overflow. The remaining later-step offset is cosmetic and non-blocking.

A safe correction would need broader changes to the centralized scroll/focus coordinator, breakpoint offsets, or target composition. That exceeds the module’s “tiny, local, no timers/hacks” threshold and would create more freeze risk than it removes.

## 10. Regression tests

New tests cover:

- Spanish localization of the residual KPI explanation.
- English preservation of the approved KPI explanation.
- Spanish localization of the field-safety advisory.
- Absence of the known residual strings in rendered Spanish Case Detail.
- Spanish data-sufficiency status rendering.
- Deterministic ES and EN numeric formatting.
- Absence of long binary-float tails in rendered uncertainty ranges.
- Spanish uncertainty descriptor localization.
- Explicit Presentation exit delegation.
- Keyboard listener registration for standalone Presentation Mode.
- Escape priority across Video, Guided, and Presentation.
- Single bounded Presentation exit transition.

Full result: **553 tests passed, 0 failed**.

## 11. QA and build

- `npm.cmd ls --depth=0`: passed; existing dependency tree only.
- `npm.cmd test`: passed, 553/553.
- `npm.cmd run lint`: passed (`tsc --noEmit`).
- `npm.cmd run build`: passed; 2,566 modules transformed.
- `git diff --check`: passed. Git emitted only the repository’s normal LF→CRLF working-copy notices.
- Production build retained the existing non-blocking large-chunk warning; CR-08.1 adds no dependency or new bundle surface.

## 12. Visual smoke

The deterministic Vite application was started only on `127.0.0.1`, returned HTTP 200, and was stopped after validation. No advisory server, API key, external network exposure, or tunnel was used.

Validated viewports:

| Viewport | Locale / surface | Result |
| --- | --- | --- |
| 1440×900 | ES overview and ES/EN Case Detail | One H1, no page overflow, no clipped primary controls |
| 430×932 | EN Case Detail | No page overflow; all visible controls at least 44 px high |
| 390×844 | ES Case Detail | No residual observed copy, no float tail, no page overflow |
| 360×800 | ES Case Detail, Guided Demo, Competition Video | No page overflow; all visible controls at least 44 px high |

The single mobile control reported outside the viewport at 430/390 belongs to the intentionally horizontally scrollable section-tab strip; the document itself did not overflow (`scrollWidth === clientWidth`).

## 13. Accessibility and interaction

- Presentation control retains `aria-pressed` and localized enter/exit labels.
- Escape produces exactly one exit according to mode priority.
- Explicit Presentation exit leaves focus on the same semantic control.
- Guided Escape restores focus to `#guided-demo-launcher` and the pre-guided Aurora case.
- Video Escape restores focus to `#competition-video-launcher` and the pre-video Aurora case.
- At 360×800, the guided autofocus target was fully within the viewport.
- All inspected mobile controls met the 44 px minimum-height contract.
- Console warnings/errors during smoke: **0**.

## 14. Claims and data safety

- Synthetic, estimated, read-only, offline, and human-review boundaries remain visible.
- Climate impact remains explicitly unverified and counterfactual.
- No probability, certification, dispatch, telecontrol, maintenance execution, or verified-impact claim was introduced.
- Approved portfolio values, chapter facts, CTA, and narrative remain unchanged.
- No real data, client data, coordinates, credentials, persistence, authentication, API, GPT, or network integration was added.

## 15. Performance impact

The impact is negligible and presentation-only. Locale-aware number formatting runs for visible values during render, replacing duplicate inline formatting. The keydown listener is active in one additional in-memory UI state and is removed by the existing effect cleanup. No timer, interval, polling loop, network call, storage operation, or new dependency was added.

## 16. Risks and findings remaining

- Critical findings: none.
- High findings: none.
- Medium findings blocking recording: none.
- Medium findings blocking freeze: none.
- Remaining Low finding: CR08V-03 accepted mobile-offset polish debt.
- Competition Video remains deterministic, navigable, and recordable.
- ES/EN are sufficiently finished for competition freeze.

## 17. Freeze-candidate audit

- Competition Video is still recordable: yes.
- ES/EN Case Detail is polished for the observed findings: yes.
- Claims remain safe: yes.
- Guided, Video, and Presentation navigation remain deterministic: yes.
- The change set is limited to CR-08.1 presentation, regression tests, and this traceability document: yes.
- Recommendation for CR-09 Competition Edition Freeze: yes, with the documented low-risk debt.

Final verdict: **READY FOR FREEZE WITH ACCEPTED LOW-RISK DEBT**.

## 18. Git state and restrictions

The intended human-approval handoff stages only the five CR-08.1 source/test files and this document, with zero unstaged files and zero untracked files. `package.json` and `package-lock.json` remain unchanged and are not staged.

No commit, push, Pull Request, tag, deployment, branch, freeze, CR-09 implementation, video recording, backend, API, GPT integration, dependency installation, persistent Git configuration change, amend, reset, rebase, stash, clean, or restore was performed.

The proposed future commit message remains:

`fix: finalize Climate Recovery competition freeze candidate`

It requires explicit human approval before creation.
