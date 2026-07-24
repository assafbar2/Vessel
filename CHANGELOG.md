# Changelog

All notable user-facing changes to Vessel are documented here.

## [0.3.0] - 2026-07-23

### Added

- Automatic and manually selected Still, Flow, and Surge atmosphere palettes
- User-controlled focus rhythm with reduced-motion defaults
- Optional 5–4–3–2–1 grounding, gentle breathing, present-time orientation,
  and post-writing check-out
- Initial frontend cadence tests and native cryptography, passphrase, and
  database tests
- A planning-only roadmap for possible releases after v0.3
- The separate Anchor offline-first grounding companion specification, plus its
  earlier Harborlines design history

### Changed

- Repositioned Vessel as a reflective-writing and grounding environment inspired
  by EMDR, with explicit language that it is not EMDR treatment or therapy
- Replaced emotion-like atmosphere labels with observable cadence language
- Improved Help, Vault, and grounding-overlay keyboard and screen-reader behavior
- Updated the application version to 0.3.0

### Fixed

- Prevented the editor from clearing when saving to the Vault, closing the app,
  or reaching the inactivity boundary fails
- Blocked vault reads and deletion through backend commands while the vault is
  locked
- Added confirmation before permanent session deletion
- Hardened passphrase creation, reset, and error handling

## [0.2.0] - 2026-03-08

### Added

- Passphrase-protected encrypted local vault
- Session browsing and deletion
- In-app Help guide
- Native macOS window controls

### Fixed

- Improved Vault block readability
- Restored editor focus after closing overlays

## [0.1.0]

### Added

- Breathing Canvas
- Cadence-responsive atmosphere
- Permanent and Transient writing modes
- Ash Command
- AES-256-GCM encrypted local storage with macOS Keychain key management
