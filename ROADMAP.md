# Vessel: The Planning

This document describes possible next versions of Vessel after v0.3. It is a
planning artifact, not a promise, schedule, or indication that the work has
started.

Vessel should remain a private, local-first reflective-writing and grounding
environment. It must not diagnose a condition, infer emotion, guide trauma
reprocessing, or represent itself as EMDR treatment.

## Planning principles

1. Protect writing before expanding the experience.
2. Keep every motion, prompt, save, deletion, and support tool optional.
3. Describe observable cadence, never a presumed emotional state.
4. Keep content local by default and make export deliberate.
5. Treat accessibility, recovery, and security as product behavior.
6. Require clinical and lived-experience review before expanding trauma-related
   language or support tools.

## v0.3 — Reflective writing and grounding foundation

The v0.3 release establishes the current product direction:

- Reflective-writing and grounding positioning with explicit EMDR boundaries
- Still, Flow, and Surge cadence atmospheres
- Automatic or manually selected atmosphere
- User-controlled focus rhythm with reduced-motion defaults
- Optional 5–4–3–2–1 grounding, gentle breathing, present-time orientation,
  and post-writing check-out
- Initial frontend cadence tests and native cryptography, passphrase, and
  database tests

## v0.4 — Writing recovery and failure safety

Goal: ordinary crashes and save failures should not cost the user their writing.

Planned work:

- Encrypted draft autosave after a short debounce and at lifecycle boundaries
- Separate draft storage from committed vault sessions
- Restore prompt after a crash, forced shutdown, or interrupted upgrade
- Quiet saving, saved, and error status on the writing surface
- Explicit **Save to Vault** action
- Retry paths that preserve the editor contents
- Application error boundary with a safe recovery screen
- Content-free local diagnostic log
- Versioned SQLite migrations and migration recovery tests
- Transactional, atomic draft-to-session transitions
- Defined retention and cleanup rules for recovered drafts
- Typed IPC errors and complete user-visible failure states

Exit signal: a forced shutdown loses no more than the documented autosave
interval, and every persistence failure leaves recoverable writing.

## v0.5 — Vault ownership, portability, and stronger cryptography

Goal: users should be able to understand, protect, move, and recover their vault.

Planned work:

- Change-passphrase flow
- Passphrase-derived key-encryption key that wraps the random data-encryption key
- Safe migration of existing Keychain-backed vaults
- Encrypted export and import
- Backup authentication and integrity verification before replacement
- Clear recovery guidance for a missing Keychain entry or forgotten passphrase
- Unlock throttling and review of locked backend command authorization
- Sensitive-buffer zeroization where practical
- Search, session naming, and optional tags without content analysis
- Undo window for deletion
- Written threat model covering device loss, database theft, compromised webview,
  malicious local processes, Keychain loss, and forgotten credentials
- CSP, Tauri capability, IPC, and dependency security review

Exit signal: a vault can be moved to a clean installation and restored using its
documented credentials, while locked content cannot be read or deleted through
backend commands.

## v0.6 — Accessibility, input correctness, and performance

Goal: Vessel should remain calm and usable across assistive technology, input
methods, window sizes, and long sessions.

Planned work:

- Complete keyboard navigation, focus trapping, and focus restoration
- Screen-reader labels and status announcements
- Automated contrast testing for generated vault colors
- 200% zoom, Dynamic Type, and small-window layouts
- Removal of hover-only information
- Correct cadence handling for paste, dictation, IME composition, and non-text keys
- Pause measurement based on elapsed time rather than the next keystroke
- Explicit session duration and idle duration behavior
- Replace function references in Zustand with a session controller/service
- Lazy-load Vault and Help
- Split large editor and vendor bundles
- Move the focus rhythm to compositor-friendly transforms
- Cap Ash particles using device capability and reduced-motion settings
- Startup, memory, and long-session performance budgets
- Expanded React, Rust, Tauri integration, keyboard, and accessibility tests

Exit signal: the supported accessibility and input matrix passes automated and
manual testing, and the application stays within documented performance budgets.

## v0.7 — User-authored support and governance

Goal: expand grounding support without turning Vessel into an automated therapist.

Planned work:

- User-authored grounding card
- Personal support plan with trusted contacts
- Region-appropriate crisis-resource configuration
- Configurable grounding choices and immediate stop controls
- Post-writing options to keep, dissolve, pause, ground, or contact support
- Clinical review by licensed trauma clinicians
- Lived-experience review across varied cultures, disabilities, and trauma contexts
- Versioned ownership and review dates for safety-related content

Not planned:

- Trauma-memory prompts or exposure ladders
- Emotional-state, PTSD, dissociation, or crisis detection
- Generative interpretation of private writing
- Automatic contact with another person or emergency service

Exit signal: safety-related language and interactions have documented clinical and
lived-experience review, and every support action remains optional and user-led.

## v1.0 — Trustworthy public release

Goal: make Vessel reproducibly installable and maintainable as a public macOS app.

Planned work:

- Resolve the bundle-identifier and application-data migration strategy
- CI for frontend lint, build, and tests plus Rust formatting, Clippy, tests,
  dependency audit, and Tauri compilation
- Apple signing, hardened runtime, and notarization
- Release artifact checksums
- Upgrade testing from every public version using copied encrypted vaults
- Privacy statement
- Accurate safety and limitations page
- Recovery and backup documentation
- Signed, notarized Apple Silicon installer
- Documented decision on Intel Mac and other platform support

Exit signal: automated checks pass, existing vaults survive a tested upgrade, and
the signed release includes accurate privacy, safety, and recovery documentation.

## Separate concept: Anchor

[Anchor](ANCHOR_SPEC.md), formerly the Harborlines working concept, is an
adjacent offline-first mobile grounding companion. It is not currently planned
as a Vessel version. Any decision to merge the concepts should be made explicitly
rather than inferred from this roadmap. The original
[Harborlines specification](HARBORLINES_SPEC.md) remains available as design
history.
