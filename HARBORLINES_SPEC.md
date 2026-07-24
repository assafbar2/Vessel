# Harborlines — Functional and Technical Specification

## 1. Product definition

**Harborlines is an offline-first mobile companion that helps a person follow a pre-authored route back to the present during stress or a trauma reminder.**

The user builds the route while feeling relatively settled. During distress, the app does not ask for a trauma narrative, diagnose a condition, infer emotion, or generate treatment advice. It presents a short sequence of familiar sensory anchors, grounding actions, supportive people, and values-based next steps chosen in advance by the user.

The central metaphor is a personal coastline:

- **Lighthouses** are trusted people and professional resources.
- **Harbors** are places, objects, sounds, and practices that help the user feel oriented.
- **Routes** are short sequences the user can follow when thinking becomes difficult.
- **Weather** is a state selected by the user, never inferred by an algorithm.
- **The horizon** is the simplified emergency interface: one screen, one choice at a time.

Harborlines is a coping and self-management tool. It is not PTSD treatment, EMDR, exposure therapy, diagnosis, crisis monitoring, or a replacement for professional care.

### Evidence-informed boundaries

Harborlines borrows from established self-help and coping patterns without claiming that the product itself is a validated treatment:

- [WHO's *Doing What Matters in Times of Stress*](https://www.who.int/publications/i/item/9789240003927) includes grounding, noticing and naming, unhooking from difficult thoughts, making room, and values-oriented action.
- [VA PTSD Coach Online](https://www.ptsd.va.gov/professional/treat/txessentials/use_coach_online.asp) demonstrates the appropriate category: self-help, coping, problem-solving, and skill-building rather than autonomous trauma treatment.
- [VA's EMDR overview](https://www.ptsd.va.gov/professional/treat/txessentials/emdr_pro.asp) describes EMDR as a structured trauma-focused psychotherapy; an app animation or alternating cue should not be represented as the complete treatment.

## 2. Product goals

1. Reduce decision load during distress.
2. Help the user reconnect with current place, time, body, choices, and support.
3. Let the user discover which pre-selected routes are personally useful without scoring recovery or interpreting symptoms.
4. Work fully offline and reveal no private content to a server.
5. Make stopping, skipping, leaving, and contacting support available from every step.

## 3. Non-goals

- Asking users to revisit or describe traumatic memories.
- Conducting bilateral stimulation as EMDR treatment.
- Detecting PTSD, panic, dissociation, suicidality, or emotional state.
- Using generative AI to interpret entries or choose interventions.
- Reward streaks, compliance scores, leaderboards, or shame-based reminders.
- Automatically contacting another person or emergency service.
- Replacing clinician assessment or a locally appropriate crisis plan.

## 4. Intended users and contexts

### Primary user

An adult who experiences stress reactions or trauma reminders and wants a private, low-friction way to use coping strategies they already trust.

### Secondary use

A clinician or peer-support worker can help the user prepare a route in person. Harborlines does not create a clinician portal or transmit health information in the initial release.

### Common contexts

- Waking after a nightmare
- Becoming disoriented or overwhelmed in a public place
- Recovering after an intrusive memory
- Preparing before a difficult but safe activity
- Transitioning out of a therapy session
- Reconnecting with daily life after a period of high stress

## 5. Core user experience

### 5.1 First-run setup

The app explains its boundaries in plain language and asks the user to create one minimal route. Setup can be skipped and resumed.

Required setup:

1. Choose an app lock preference.
2. Add one orientation statement, such as “I am in my apartment in Oakland.”
3. Add one sensory anchor.
4. Add one small physical action.
5. Add one next step.
6. Optionally add a trusted contact and local crisis resource.
7. Preview the route in a clearly marked practice mode.

No trauma history or diagnosis is requested.

### 5.2 The Horizon

The primary action is always visible: **Find the horizon**.

Activating it opens a distraction-free state machine:

1. **Arrive** — “You are here. There is nothing to complete perfectly.”
2. **Locate** — Show the current date and time plus the user's orientation statement.
3. **Notice** — Present one chosen sensory anchor.
4. **Move** — Offer one pre-selected physical grounding action.
5. **Choose** — Offer a values-based next action, another anchor, or a support contact.
6. **Land** — Ask only: “What next?” with choices to finish, repeat, rest, or contact support.

Every screen includes **Stop**, **Skip**, and **Support**. No route is longer than six steps by default.

### 5.3 Route builder

Users construct routes from cards. A card contains one action and optional private media.

Card types:

- Orientation statement
- Current date/time
- Photo
- Color or visual texture
- Sound or recorded message
- Tactile-object reminder
- Sensory noticing prompt
- Gentle movement
- Breathing prompt
- Self-authored phrase
- Values-based next action
- Trusted contact
- Professional or crisis resource

The builder previews duration, accessibility requirements, media usage, and offline availability. It warns when a route relies on a sense or physical action the user has marked unavailable.

### 5.4 Anchor library

The library stores reusable cards in Harbors. Suggested categories are optional and editable. The app never analyzes media or text.

An anchor can be marked:

- Always available
- Home only
- Public-place safe
- Audio required
- Eyes-closed unsafe
- Movement required
- Avoid when dizzy

### 5.5 Check-in and learning

After a route, the user may answer:

- “Did any step help?” — Yes, No, Unsure, or Skip
- “Keep this route as it is?” — Keep, Edit later, or Hide

Harborlines records selections, skipped steps, completion, and voluntary usefulness feedback. It does not calculate a mental-health score. Insights remain local and use neutral language such as “You often choose sound anchors at night.”

### 5.6 Support network

The user can add trusted people and professional resources. Contact actions always require an explicit tap and open the system phone or messaging interface with no automatic message.

The app ships with a versioned, region-aware resource catalog. If location permission is not granted, the user chooses a region manually. Emergency calling and messaging are never automatic.

### 5.7 Practice mode

Practice mode lets users and clinicians rehearse routes when calm. It is visually distinct from the live Horizon flow and never contributes to usage insights unless the user opts in.

## 6. Functional requirements

### P0 — Initial release

| ID | Requirement |
|---|---|
| HL-F-001 | The complete core experience works without network connectivity. |
| HL-F-002 | A user can create, reorder, duplicate, archive, and delete a route. |
| HL-F-003 | A route supports orientation, sensory, movement, phrase, action, and contact cards. |
| HL-F-004 | The Horizon opens from the home screen in one tap. |
| HL-F-005 | Every Horizon step exposes Stop, Skip, and Support. |
| HL-F-006 | The user can disable animation, sound, vibration, breathing, and time-based transitions independently. |
| HL-F-007 | The app supports a device lock plus optional app PIN/biometric lock. |
| HL-F-008 | All user-created content is encrypted at rest. |
| HL-F-009 | The app never uploads content or behavioral events. |
| HL-F-010 | The user can export and restore an encrypted backup. |
| HL-F-011 | Contact actions require a deliberate user tap and system confirmation where applicable. |
| HL-F-012 | A failed write never replaces the last valid route or backup. |
| HL-F-013 | The app restores an interrupted route without assuming the user wants to continue. |
| HL-F-014 | Accessibility settings are available before route creation. |
| HL-F-015 | Product language consistently states that Harborlines is not treatment or crisis monitoring. |

### P1 — Follow-up

- Multiple named routes for night, public places, post-session, and general grounding
- User-recorded audio anchors with waveform-free playback
- Scheduled practice reminders, disabled by default
- Local-only usage insights
- Clinician-assisted setup using an on-device review mode
- Printable route card and QR-free encrypted transfer between the user's own devices
- Localization and region-specific support resources
- Apple Watch and Android wearable “Horizon” shortcut with no private text on the lock screen

### P2 — Research candidates

- Optional alternating haptic focus rhythm, explicitly not labeled EMDR
- A clinician-governed protocol pack that contains no generative content
- Anonymous, opt-in research export requiring a separate consent flow and separate build review

## 7. Interaction and visual design

### Design character

- Calm, grounded, adult, and non-clinical
- No red alert styling except platform emergency affordances
- No gamification, mascots, badges, or completion celebrations
- Large targets, short sentences, and one primary decision per Horizon screen
- The coastline develops through user-authored resources, not usage streaks

### Motion

- Reduced motion is the default when requested by the operating system.
- No essential information depends on animation.
- Horizon transitions use opacity only by default.
- Optional horizon drift and haptics require explicit activation and have an immediate stop control.

### Accessibility

- WCAG 2.2 AA contrast and target-size requirements
- Dynamic Type and 200% text scaling
- VoiceOver and TalkBack labels, order, and announcements
- Switch Control and external-keyboard navigation
- Alternatives for every visual, auditory, tactile, respiratory, and movement-based activity
- No instruction assumes vision, hearing, speech, smell, mobility, or safe breath control

## 8. Safety and clinical governance

### Content rules

- Use invitational language: “If useful,” “You might,” and “Stop at any time.”
- Never tell the user they are safe; help them assess their present surroundings and choices.
- Never ask for a trauma narrative during the Horizon flow.
- Never infer improvement from route completion.
- Never block app exit behind a check-in.
- Breathing guidance includes a dizziness/discomfort stop instruction.

### Governance

- Clinical content reviewed by at least two licensed trauma clinicians.
- Lived-experience review includes varied cultures, disabilities, and trauma contexts.
- Every content change has an owner, source, review date, and expiry date.
- Crisis resources are tested before each release and can be corrected through an app update without changing user data.
- Claims are reviewed against current WHO and VA/DoD guidance.

### Adverse-event preparation

- In-app reporting distinguishes technical failure, harmful content, and incorrect resource information.
- The public safety page explains limitations and provides a non-app route to support resources.
- No monitoring claim is made; the company does not promise to detect or respond to crises.

## 9. Technical architecture

### Client

- **Framework:** React Native with TypeScript, using native iOS and Android projects for security- and lifecycle-critical integrations
- **State:** Explicit finite-state machines for setup, Horizon, backup, and lock flows
- **Navigation:** Native stack navigation; Horizon runs in a modal root isolated from the route editor
- **Storage:** SQLite for structured records and an encrypted file store for media
- **Secure storage:** iOS Keychain and Android Keystore for device-bound wrapping keys
- **Cryptography:** A random 256-bit data-encryption key, AES-256-GCM per record/file, unique nonces, and authenticated metadata
- **Backup protection:** Argon2id-derived key-encryption key wrapping the random backup key
- **Networking:** No content API; optional resource-catalog and update checks only

The initial release should not use a webview for the Horizon interaction because lifecycle handling, lock-screen privacy, audio, haptics, accessibility, and secure storage are central requirements.

### Modules

```text
App Shell
├── Lock and lifecycle controller
├── Horizon state machine
├── Route builder
├── Anchor library
├── Support network
├── Local insights
├── Encrypted repository
│   ├── SQLite records
│   ├── Media vault
│   └── Atomic backup/restore
├── Platform services
│   ├── Keychain / Keystore
│   ├── Biometrics
│   ├── Audio and haptics
│   ├── Contacts handoff
│   └── Local notifications
└── Safety content catalog
```

### Horizon state machine

```text
idle
  → consent_to_begin
  → arrive
  → locate
  → notice
  → move
  → choose
  → land
  → complete

Any active state may transition to:
  paused | support | stopped | app_backgrounded
```

The next state is deterministic from the saved route and the user's explicit action. There is no recommendation model.

## 10. Data model

### `routes`

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `name_ciphertext` | BLOB | Encrypted |
| `context_flags` | INTEGER | Non-sensitive bit flags where possible |
| `is_archived` | BOOLEAN | Soft archive |
| `created_at` | DATETIME | Local device time |
| `updated_at` | DATETIME | Local device time |
| `revision` | INTEGER | Optimistic concurrency and recovery |

### `route_steps`

| Field | Type | Notes |
|---|---|---|
| `id` | UUID | Primary key |
| `route_id` | UUID | Foreign key |
| `position` | INTEGER | Unique per route |
| `kind` | ENUM | Orientation, sensory, movement, phrase, action, contact |
| `payload_ciphertext` | BLOB | Authenticated encrypted JSON |
| `accessibility_flags` | INTEGER | Used to warn about incompatible routes |

### `anchors`

Stores reusable encrypted payloads and references to encrypted media files. Deleting an anchor requires a reference check so active routes are not corrupted.

### `route_runs`

Contains timestamps, route revision, steps displayed/skipped, completion state, and optional usefulness selection. It never stores free-form trauma content or inferred emotion.

### `contacts`

Stores user-entered display name, relationship label, and system contact identifier when permitted. Phone numbers should be resolved through the operating system at action time where possible.

### `settings`

Contains accessibility choices, app-lock policy, notification policy, region, and consent versions. Sensitive values are encrypted.

## 11. Persistence and recovery

- All route edits are written in a transaction.
- Media is written to a temporary encrypted file, verified, then atomically renamed before its database reference is committed.
- The database uses versioned forward migrations with backup-before-migrate.
- The app keeps the last known valid route revision after an interrupted edit.
- Interrupted Horizon state is stored without private rendered text and expires after a user-configurable interval.
- Backup restore validates version, authentication tags, record counts, and media hashes before replacing local data.
- A restore never destroys the existing vault until the imported copy opens successfully.

## 12. Security and privacy requirements

### Threats in scope

- Lost or stolen locked device
- Database or backup copied without authorization
- Malicious app attempting to read shared files
- Screenshot or notification leakage
- Interrupted writes and corrupt upgrades
- Forgotten backup passphrase
- Missing Keychain or Keystore entry

### Controls

- Platform data-protection APIs plus application-layer authenticated encryption
- No plaintext in logs, analytics, crash reports, notifications, widgets, or app switcher snapshots
- Screen obscured whenever the app backgrounds
- Optional biometric unlock with passcode fallback
- Rate-limited app-PIN verification
- Clipboard disabled for sensitive fields by default
- Explicit export destination and confirmation
- Dependency, mobile application security, and cryptographic design reviews before release

Harborlines cannot protect data after an attacker unlocks the user's operating-system account and can inspect the running process. This limitation must be documented.

## 13. Observability

The default build contains no third-party analytics or session replay.

Local diagnostics may record:

- App and schema version
- Migration result codes
- Route state transitions without route or step identifiers
- Cryptographic operation result categories
- Crash stack traces after symbol scrubbing

Diagnostics export is manual, previewable, and excludes content. Any future telemetry requires a separate privacy design and explicit opt-in.

## 14. Testing strategy

### Unit tests

- Horizon transition table, including Stop/Skip/Support from every state
- Route validation and accessibility compatibility
- Encryption round trips, nonce uniqueness, tamper rejection, and wrong-key rejection
- Atomic media commit and rollback
- Backup derivation, wrapping, verification, restore, and corruption handling
- Resource-catalog validation and expiry

### Integration tests

- Keychain/Keystore creation, loss, denial, and biometric cancellation
- Background/foreground at every Horizon state
- Phone and message handoff without automatic transmission
- Database migration from every released schema
- Storage-full and interrupted-write behavior
- Encrypted backup across supported OS versions

### End-to-end tests

- First run to completed practice route
- One-tap Horizon through every normal step
- Stop, Skip, Support, and app-background flows
- Complete VoiceOver and TalkBack journeys
- Offline cold start and route completion
- Reduced-motion, large-text, screen-reader, and no-audio configurations
- Upgrade with existing routes and encrypted media

### Human validation

- Trauma-clinician content review
- Facilitated usability sessions with lived-experience participants and a safety protocol
- Accessibility testing with disabled participants
- Red-team review of coercive language, false reassurance, and crisis-resource failures

## 15. Release plan

### Milestone A — Safety prototype

- Static Horizon state machine
- No accounts, media, contacts, or analytics
- Clinical and lived-experience review
- Accessibility prototype testing

### Milestone B — Private alpha

- Encrypted routes and anchors
- App lock and lifecycle privacy
- Atomic persistence and local backup
- Internal iOS and Android distribution

### Milestone C — Evaluated beta

- Route builder, support handoff, accessibility matrix, and migration tests
- Structured usability and safety evaluation
- Public safety, privacy, recovery, and limitations documentation

### Milestone D — Public release

- Independent security review
- Store review assets with restrained, accurate claims
- Signed release provenance and software bill of materials
- Support process and resource-correction SLA

## 16. Initial release acceptance criteria

- A new user can build and practice a route without providing trauma details.
- The Horizon is reachable in one tap and usable offline.
- Stop, Skip, and Support work from every step.
- No user content appears in network traffic, logs, notifications, or app-switcher snapshots.
- Killing the app during any database or media write preserves the last valid revision.
- An encrypted backup can be restored on a clean device using only its passphrase.
- Every function is operable with VoiceOver and TalkBack at maximum supported text size.
- Reduced-motion mode contains no nonessential movement.
- Clinical and lived-experience reviewers approve all P0 language.
- Product materials never describe Harborlines as EMDR, PTSD treatment, diagnosis, or crisis monitoring.
