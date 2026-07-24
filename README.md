<p align="center">
  <h1 align="center">Vessel</h1>
  <p align="center"><em>The Breathing Canvas</em></p>
  <p align="center">A reflective-writing and grounding environment inspired by EMDR.</p>
</p>

---

## The Idea

[EMDR](https://www.emdria.org/about-emdr-therapy/) (Eye Movement Desensitization and Reprocessing) is an evidence-based, structured psychotherapy for trauma. Bilateral stimulation is one component of that larger clinical protocol.

Vessel takes design inspiration from rhythm, attention, choice, and safe containment. It does **not** deliver EMDR or guide trauma reprocessing.

- **The Focus Rhythm** gently expands and contracts as you write and can be switched off at any time
- **Cadence Atmosphere** responds to observable writing pace—or lets you choose Still, Flow, or Surge manually
- **Transient Mode** lets words dissolve after they have been written
- **The Vault** provides encrypted, passphrase-protected storage — a safe container for what you choose to keep
- **Grounding Tools** offer optional sensory orientation, gentle breathing, and a post-writing check-out

**This is not therapy or EMDR treatment.** Vessel is a private writing and grounding tool for people who find reflective writing useful.

## Who Is This For

- People who use writing to process difficult experiences
- Those exploring reflective writing and grounding practices
- Anyone who values privacy and security in their personal writing
- Writers who want a calm environment that can respond to cadence or be set manually

> **Important:** Vessel is not a substitute for professional mental health support. If you are experiencing a mental health crisis, please reach out to a qualified professional or contact a crisis helpline (see [Resources](#if-you-need-support) below).

## Features

### The Focus Rhythm

The writing surface can gently expand and contract on a 5.5-second cycle. This optional visual focus rhythm can be turned off from the canvas controls and is disabled when the operating system requests reduced motion.

### Cadence Atmosphere

In **Auto**, Vessel uses typing pace and editing intensity—not emotional inference—to adapt the atmosphere:

- **Still** (slow, paused, or revision-heavy cadence) — dark, warm tones
- **Flow** (steady cadence) — soft, light palette
- **Surge** (rapid bursts) — vivid, energetic colors

Choose any atmosphere manually whenever you prefer. Transitions happen over 12–15 seconds, like weather shifting.

### Optional Grounding and Check-out

Open the grounding panel from the canvas or with `⌘⇧G`:

- **5–4–3–2–1** sensory orientation
- **Gentle breathing** with a four-in, six-out rhythm and immediate pause
- **Here, Now** orientation to the current date, time, place, and available choices
- **Post-writing check-out** to save and open the vault, ground before deciding, or keep writing

These are optional coping aids, not therapy or trauma-processing instructions.

### Writing Modes

Toggle between two modes with `⌘T`:

- **Permanent Mode** — your words stay on the canvas and are saved to the vault
- **Transient Mode** — each block of text fades after a few seconds. Write without attachment. Nothing is kept.

### The Ash Command `⌘⇧D`

In transient mode, invoke the Ash Command to dissolve all remaining text instantly. Characters scatter like embers, then vanish. A ritual of release.

### The Vault `⌘⇧V`

Permanent-mode writing is encrypted and stored when you open the vault, quit normally, or reach the inactivity cutoff. Opening the vault moves your current text into storage and clears the canvas. A crash or forced shutdown can still lose text that has not yet been stored.

The vault is:

- **Passphrase-protected** — you set it on first use
- **Encrypted with AES-256-GCM** — authenticated encryption for all stored content
- **Stored locally** — never in the cloud
- **Browsable** — sessions displayed as colored blocks reflecting the session's cadence palette

## Security & Privacy

Vessel was designed with the understanding that reflective writing is deeply private.

| Layer | Detail |
|-------|--------|
| **Encryption** | AES-256-GCM for all stored content |
| **Key Storage** | macOS Keychain — kept out of the application database |
| **Vault Access** | Argon2id-hashed passphrase — second layer of protection |
| **Architecture** | Local-first — no cloud, no accounts, no telemetry |
| **Data Policy** | Nothing leaves your machine. Ever. |

## Installation (macOS)

### Requirements

- macOS on Apple Silicon (M1 / M2 / M3 / M4)

### Install

1. Download **`Vessel_0.3.0_aarch64.dmg`** from the [Releases](../../releases) page
2. Open the DMG and drag **Vessel** to your Applications folder
3. On first launch, macOS may block the unsigned app:
   - Go to **System Settings → Privacy & Security**
   - Scroll down and click **"Open Anyway"** next to the Vessel warning
4. Vessel opens maximized. Start writing.

> **Note:** v0.3 is built for Apple Silicon. Intel Mac and other platform support is planned.

## Running from Source

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Rust](https://rustup.rs/) (stable toolchain)
- [Tauri CLI](https://v2.tauri.app/start/prerequisites/) — installed automatically via npm

### Setup

```bash
git clone https://github.com/assafbar2/Vessel.git
cd Vessel
npm install
```

### Development

```bash
npm run tauri dev
```

Starts the Vite dev server and opens the Tauri window with hot-reload enabled.

### Production Build

```bash
npm run tauri build
```

Produces a `.dmg` installer in `src-tauri/target/release/bundle/dmg/`. Code signing requires a separately configured Apple Developer identity.

### Lint

```bash
npm run lint
```

## How to Use

| Shortcut | Action |
|----------|--------|
| `⌘T` | Toggle Permanent / Transient mode |
| `⌘⇧D` | Ash Command — dissolve all text |
| `⌘⇧V` | Open the Vault |
| `⌘⇧G` | Open optional grounding tools |
| `⌘?` | Help guide |
| `Esc` | Return from Vault to canvas |

### Writing Flow

1. **Open Vessel.** The canvas breathes. Start writing.
2. **Use Auto or choose an atmosphere** — Still, Flow, or Surge.
3. **To write without keeping anything,** press `⌘T` for transient mode.
4. **When you're done,** press `⌘⇧V` to move your text to the vault.
5. **Set a passphrase** the first time. Enter it each time you open the vault.
6. **Your vault grows** over time — a private archive of your processed writing.

## Using Vessel Responsibly

Vessel supports reflective writing and optional grounding. It does **not** provide EMDR or replace professional mental health care.

### Guidelines

- Take breaks when writing becomes overwhelming
- If you are using Vessel around trauma, consider doing so alongside professional support
- If writing triggers distressing emotions, consider working with a therapist who can provide guidance
- You can always switch to transient mode and let the words dissolve

### If You Need Support

- **988 Suicide & Crisis Lifeline** — call or text 988 (US)
- **Crisis Text Line** — text HOME to 741741
- **EMDR International Association** — [emdria.org](https://www.emdria.org) — find a certified EMDR therapist
- **Psychology Today** — [therapist finder](https://www.psychologytoday.com/us/therapists)
- **International Association for Suicide Prevention** — [iasp.info](https://www.iasp.info/resources/Crisis_Centres/)

## Tech Stack

| Component | Technology |
|-----------|------------|
| Runtime | [Tauri v2](https://v2.tauri.app/) (Rust + WebView) |
| Frontend | React, TypeScript, Vite |
| Editor | TipTap v3 (ProseMirror) |
| Encryption | AES-256-GCM (`aes-gcm` crate) |
| Key Management | macOS Keychain (`keyring` crate) |
| Database | SQLite (`rusqlite`, bundled) |
| Animations | Framer Motion, CSS transitions |

## Version

**v0.3.0 — Early Access**

Vessel is functional and secure, but still evolving. Feedback, bug reports, and ideas are welcome via [Issues](../../issues).

See [CHANGELOG.md](CHANGELOG.md) for release history.

See [PHASE_2.md](PHASE_2.md) for the next-phase product, safety, reliability, and release plan.

See [ROADMAP.md](ROADMAP.md) for **The Planning**, a version-by-version outline
of possible work after v0.3. The roadmap is planning only; future-version work
has not started unless the repository shows otherwise.

The separate [Anchor specification](ANCHOR_SPEC.md) describes an offline-first
mobile grounding companion concept in functional and technical detail.
[HARBORLINES_SPEC.md](HARBORLINES_SPEC.md) preserves the concept's earlier
working-title specification.

### Changelog

**v0.3.0**
- Repositioned Vessel as a reflective-writing and grounding environment inspired by EMDR—not EMDR treatment
- Replaced emotional inference labels with observable cadence states: Still, Flow, and Surge
- Added Auto and manual atmosphere selection
- Added an explicit focus-rhythm toggle with reduced-motion defaults
- Added optional 5–4–3–2–1 grounding, gentle breathing, present-time orientation, and post-writing check-out
- Added the functional and technical Harborlines product specification

**v0.2.0**
- Passphrase-protected vault — set on first use, required every time you open the vault
- Vault session management — view sessions with date/time, delete sessions you no longer need
- In-app Help guide accessible from menu bar or `⌘?`
- macOS native window controls (close, minimize, maximize)
- Improved vault block readability — adaptive text color based on background luminance
- Fixed editor focus recovery after closing overlays

**v0.1.0**
- The Breathing Canvas — 5.5-second rhythmic breathing animation
- Cadence Atmosphere — responds to writing cadence with Still, Flow, and Surge palettes
- Permanent and Transient writing modes
- The Ash Command — dissolve all text instantly
- The Vault — AES-256-GCM encrypted local storage with visual session grid
- macOS Keychain key management

## License

MIT

---

<p align="center"><em>Vessel was created with the belief that the right environment can make writing feel like breathing.</em></p>
