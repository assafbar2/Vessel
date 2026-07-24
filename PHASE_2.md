# Vessel Phase 2

## Purpose

Phase 2 should make Vessel resilient, explainable, accessible, and release-ready without discarding the quiet writing experience that already works well.

Vessel should be positioned as a private reflective-writing and grounding companion. It should not diagnose PTSD, infer a user's emotional state, or present itself as EMDR treatment. EMDR is an evidence-based, structured trauma-focused psychotherapy; a breathing canvas or bilateral visual rhythm is not the full protocol.

Authoritative context:

- [VA National Center for PTSD: EMDR for PTSD](https://www.ptsd.va.gov/professional/treat/txessentials/emdr_pro.asp)
- [VA National Center for PTSD: psychotherapy overview](https://www.ptsd.va.gov/professional/treat/txessentials/overview_therapy.asp)
- [WHO: psychological interventions for adults with PTSD](https://www.who.int/teams/mental-health-and-substance-use/treatment-care/mental-health-gap-action-programme/evidence-centre/conditions-related-to-stress/posttraumatic-stress-disorder-%28ptsd%29--psychological-interventions---adults)

### Implemented in the v0.3 foundation

- Reflective-writing and grounding positioning with explicit EMDR-treatment boundaries
- Focus-rhythm terminology and an on/off control
- Observable cadence states: Still, Flow, and Surge
- Auto and manually selected atmosphere palettes
- Optional 5–4–3–2–1 grounding, gentle breathing, present-time orientation, and post-writing check-out
- Initial frontend cadence tests and native cryptography/passphrase tests

## Product principles

1. Preserve agency. Motion, prompts, saving, deletion, and transient behavior must be explicit and controllable.
2. Never claim to know how the user feels from typing behavior. Describe detected signals as cadence, pace, or editing intensity.
3. Do not guide unsupervised trauma exposure or memory reprocessing.
4. Protect writing against ordinary failures before adding more expressive features.
5. Keep all content local by default and make every export deliberate.
6. Co-design trauma-related features and language with a licensed trauma clinician and people with lived experience.

## Required functionality

### P0 — Crash-safe writing

- Encrypted draft autosave after a short debounce and at lifecycle boundaries.
- Restore prompt after a crash, forced shutdown, or interrupted upgrade.
- Explicit saved/saving/error status that does not disturb the writing surface.
- Manual **Save to Vault** action in addition to automatic lifecycle saves.
- Never clear the editor until durable storage has confirmed success.

### P0 — Trustworthy failure handling

- User-visible errors for save, unlock, load, delete, keychain, and database failures.
- Retry paths that preserve content.
- Application-level error boundary with a safe recovery screen.
- Local diagnostic log containing technical events only—never writing, passphrases, or decrypted session content.

### P1 — User-controlled atmosphere (implemented in v0.3 work)

- Controls for breathing on/off, pace, intensity, and static canvas.
- Respect `prefers-reduced-motion` by default and expose the same option in-app.
- Keep all adaptive labels tied to observable cadence, never inferred emotion.
- Offer manual atmosphere selection; adaptive mode should remain optional.
- Use transform/opacity animation rather than continuously animated padding.

### P1 — Vault ownership and portability

- Change-passphrase flow.
- Encrypted export and import with clear recovery instructions.
- Backup integrity check before accepting an imported vault.
- Recovery story for a missing Keychain entry; clearly explain what can and cannot be recovered.
- Search, session naming, and optional tags without analyzing private content.
- Undo window or deliberate confirmation for destructive deletion.

### P1 — Accessibility

- Complete keyboard navigation and visible focus behavior.
- Focus trapping and focus restoration for overlays.
- Screen-reader labels and status announcements.
- Contrast testing for every generated vault color.
- Dynamic Type/zoom testing and layouts for smaller windows.
- Avoid hover-only information.

### P2 — Evidence-aware support tools (initial set implemented in v0.3 work)

These should be optional coping aids, not treatment claims:

- A user-authored grounding card: “What helps me return to the present?”
- A configurable sensory-orientation exercise such as 5-4-3-2-1.
- Paced breathing or progressive muscle relaxation with an immediate stop control.
- A personal support plan with trusted contacts and region-appropriate crisis resources.
- A post-writing check-out that asks what the user wants next: keep, dissolve, pause, contact someone, or do a grounding exercise.

Do not add trauma-memory prompts, exposure ladders, or therapist-like interpretation without clinical governance and a validated protocol.

## Required technical work

### Persistence and database

- Add versioned SQLite migrations and migration rollback/recovery tests.
- Store encrypted drafts separately from committed sessions.
- Use transactions and atomic replacement for draft/session transitions.
- Test crash points before encryption, after encryption, before commit, and after commit.
- Define retention and cleanup behavior for recovered drafts.

### Security model

- Write a threat model covering lost device, malicious local process, compromised webview, database theft, Keychain loss, and forgotten passphrase.
- Decide whether the passphrase is only an application access gate or cryptographically protects the data.
- For cryptographic passphrase protection, derive a key-encryption key with Argon2id and use it to wrap the random data-encryption key; migrate existing vaults safely.
- Add unlock throttling and avoid exposing sensitive backend commands while locked.
- Zeroize sensitive buffers where practical and document platform limitations.
- Security-review CSP, Tauri capabilities, IPC command authorization, and release dependencies.

### Test coverage

- Rust unit tests for AES-GCM round trips, invalid nonces/ciphertext, Argon2 verification, lock enforcement, database operations, and migrations.
- React tests for save failure, close behavior, inactivity boundaries, transient timers, cadence classification, and legacy passphrase reset.
- Tauri integration tests for create/unlock/lock/reopen, crash recovery, Keychain failures, and vault migration.
- End-to-end keyboard and accessibility tests.
- Test fixtures must contain synthetic text only.

### Architecture and UX reliability

- Replace function references stored in Zustand with an explicit session service or controller.
- Use typed IPC error codes instead of matching error strings.
- Add loading, empty, success, and error states to every asynchronous vault action.
- Handle paste, dictation, IME composition, and non-text keys correctly in cadence tracking.
- Measure pauses on elapsed time rather than only when the next key arrives.
- Keep session duration separate from idle duration.

### Performance

- Lazy-load Vault and Help.
- Split editor/vendor bundles where it improves startup time.
- Replace layout-triggering breathing animation with compositor-friendly transforms.
- Cap Ash particles based on device capability and reduced-motion settings.
- Add startup, memory, and long-session performance budgets.

### Release engineering

- Resolve the bundle-identifier warning without orphaning existing user data. Changing the identifier requires an application-data migration plan.
- Add CI for frontend lint/build, Rust formatting, Clippy, tests, dependency audit, and Tauri compilation.
- Configure Apple signing, hardened runtime, notarization, and release artifact checksums.
- Test upgrades from the currently released version with a copy of an existing encrypted vault.
- Produce a privacy statement and an accurate limitations/safety page.

## Phase 2 exit criteria

Phase 2 is complete when:

- A forced shutdown does not lose more than the documented autosave interval.
- Every persistence failure leaves recoverable writing and a visible recovery action.
- Locked vault content cannot be read or deleted through backend commands.
- Existing vaults migrate without losing sessions or Keychain access.
- All automated checks pass in CI, including native macOS packaging.
- Motion and adaptive atmosphere can be disabled completely.
- Product language has clinical review and does not claim that Vessel itself delivers EMDR or treats PTSD.
- The app is signed, notarized, upgrade-tested, and accompanied by recovery documentation.
