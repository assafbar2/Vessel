<p align="center">
  <h1 align="center">Vessel</h1>
  <p align="center"><em>The Breathing Canvas</em></p>
  <p align="center">A therapeutic writing environment inspired by EMDR.</p>
</p>

---

## The Idea

[EMDR](https://www.emdria.org/about-emdr-therapy/) (Eye Movement Desensitization and Reprocessing) is a clinically validated psychotherapy that helps people process traumatic and distressing memories. At its core is **bilateral stimulation** — rhythmic, alternating engagement (eye movements, taps, tones) that appears to help the brain reprocess difficult material, reducing its emotional charge.

Vessel translates these principles into a writing tool:

- **The Breathing Canvas** gently expands and contracts as you write, creating a rhythmic bilateral pulse that mirrors EMDR's core mechanism
- **Adaptive Atmosphere** reads your writing cadence and shifts the environment — colors, weight, energy — in response to your state
- **Transient Mode** lets words dissolve after they've been written, reflecting the EMDR principle that processing doesn't require holding on
- **The Vault** provides encrypted, passphrase-protected storage — a safe container for what you choose to keep

**This is not therapy.** Vessel is a writing tool. But it is designed with therapeutic principles in mind, for people who find that writing helps them process.

## Who Is This For

- People who use writing to process difficult experiences
- Those exploring therapeutic or reflective writing practices
- Anyone who values privacy and security in their personal writing
- Writers who want an environment that responds to their emotional state

> **Important:** Vessel is not a substitute for professional mental health support. If you are experiencing a mental health crisis, please reach out to a qualified professional or contact a crisis helpline (see [Resources](#if-you-need-support) below).

## Features

### The Breathing Canvas

The writing surface gently breathes — expanding and contracting on a 5.5-second cycle. This subtle bilateral rhythm creates a meditative pace that supports focused, embodied writing.

### Vibe Shift

Vessel tracks your writing cadence in real time and adapts the entire atmosphere:

- **Grounding** (slow, deliberate typing) — dark, warm tones
- **Neutral** (steady flow) — soft, light palette
- **Inspiration** (rapid bursts) — vivid, energetic colors

Transitions happen over 12–15 seconds, like weather shifting — never jarring.

### Writing Modes

Toggle between two modes with `⌘T`:

- **Permanent Mode** — your words stay on the canvas and are saved to the vault
- **Transient Mode** — each block of text fades after a few seconds. Write without attachment. Nothing is kept.

### The Ash Command `⌘⇧D`

In transient mode, invoke the Ash Command to dissolve all remaining text instantly. Characters scatter like embers, then vanish. A ritual of release.

### The Vault `⌘⇧V`

Every permanent-mode session is automatically encrypted and stored in your local vault. Opening the vault moves your current text into storage and clears the canvas.

The vault is:

- **Passphrase-protected** — you set it on first use
- **Encrypted with AES-256-GCM** — military-grade encryption for all stored content
- **Stored locally** — never in the cloud
- **Browsable** — sessions displayed as colored blocks reflecting the emotional tone of each writing session

## Security & Privacy

Vessel was designed with the understanding that therapeutic writing is deeply private.

| Layer | Detail |
|-------|--------|
| **Encryption** | AES-256-GCM for all stored content |
| **Key Storage** | macOS Keychain — encryption key never touches disk |
| **Vault Access** | SHA-256 hashed passphrase — second layer of protection |
| **Architecture** | Local-first — no cloud, no accounts, no telemetry |
| **Data Policy** | Nothing leaves your machine. Ever. |

## Installation (macOS)

### Requirements

- macOS on Apple Silicon (M1 / M2 / M3 / M4)

### Install

1. Download **`Vessel_0.2.0_aarch64.dmg`** from the [Releases](../../releases) page
2. Open the DMG and drag **Vessel** to your Applications folder
3. On first launch, macOS may block the unsigned app:
   - Go to **System Settings → Privacy & Security**
   - Scroll down and click **"Open Anyway"** next to the Vessel warning
4. Vessel opens maximized. Start writing.

> **Note:** v0.2 is built for Apple Silicon. Intel Mac and other platform support is planned.

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

Produces a signed `.dmg` installer in `src-tauri/target/release/bundle/dmg/`.

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
| `⌘?` | Help guide |
| `Esc` | Return from Vault to canvas |

### Writing Flow

1. **Open Vessel.** The canvas breathes. Start writing.
2. **Let the atmosphere shift** with your pace — don't fight it.
3. **To write without keeping anything,** press `⌘T` for transient mode.
4. **When you're done,** press `⌘⇧V` to move your text to the vault.
5. **Set a passphrase** the first time. Enter it each time you open the vault.
6. **Your vault grows** over time — a private archive of your processed writing.

## Using Vessel Responsibly

Vessel is designed to support reflective and therapeutic writing. It is **not** a replacement for professional therapy or mental health treatment.

### Guidelines

- Take breaks when writing becomes overwhelming
- This tool works best **alongside** professional support, not instead of it
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

**v0.2.0 — Early Access**

Vessel is functional and secure, but still evolving. Feedback, bug reports, and ideas are welcome via [Issues](../../issues).

### Changelog

**v0.2.0**
- Passphrase-protected vault — set on first use, required every time you open the vault
- Vault session management — view sessions with date/time, delete sessions you no longer need
- In-app Help guide accessible from menu bar or `⌘?`
- macOS native window controls (close, minimize, maximize)
- Improved vault block readability — adaptive text color based on background luminance
- Fixed editor focus recovery after closing overlays

**v0.1.0**
- The Breathing Canvas — 5.5-second rhythmic breathing animation
- Vibe Shift — atmosphere adapts to your writing cadence (grounding, neutral, inspiration)
- Permanent and Transient writing modes
- The Ash Command — dissolve all text instantly
- The Vault — AES-256-GCM encrypted local storage with visual session grid
- macOS Keychain key management

## License

MIT

---

<p align="center"><em>Vessel was created with the belief that the right environment can make writing feel like breathing.</em></p>
