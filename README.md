<p>
  <img src="assets/cover.png" alt="pi-bookmark — pin and bookmark important Pi coding agent sessions" width="1100">
</p>

# pi-bookmark

**Pin important Pi sessions. Keep the thread. Resume it from any workspace.**

[![npm](https://img.shields.io/npm/v/pi-bookmark.svg?color=c9a227)](https://www.npmjs.com/package/pi-bookmark)
[![license](https://img.shields.io/npm/l/pi-bookmark.svg)](LICENSE)
[![pi.dev](https://img.shields.io/badge/pi.dev-package-c9a227)](https://pi.dev/packages/pi-bookmark)
[![node](https://img.shields.io/node/v/pi-bookmark.svg)](package.json)
[![dependencies](https://img.shields.io/badge/dependencies-0-brightgreen)](package.json)

A [Pi coding agent](https://pi.dev) extension (`pi-package`) that gives you a short, global list of the sessions you actually want again — instead of scrolling Pi's `/resume` and hoping. Think of it as a lightweight **session manager** and **favorites** list: pin (bookmark) a session, then jump back from any repo.

<https://raw.githubusercontent.com/vaultboy001/pi-bookmark/main/assets/demo.mp4>

## Why this exists

Pi's built-in [`/resume`](https://pi.dev/docs/latest/sessions) lists every session you ever started. After a week that's 50+ entries with no titles, no tags, and no order. The big session where you fixed the auth bug is buried between two scratch sessions.

pi-bookmark fixes that with three commands: `/pin` (bookmark the current session), `/unpin`, and `/bookmarks` (a `/resume`-style picker of only your pinned sessions). Pins are global — a bookmark made in `~/code/webapp` can be opened from anywhere, and Pi's runtime cwd follows the session.

## Install

```bash
pi install npm:pi-bookmark
```

That is the only required step. Then `/reload` or restart Pi.

Requires the [Pi coding agent](https://www.npmjs.com/package/@earendil-works/pi-coding-agent) (`pi` on your PATH), Node `>= 22.19`.

## Quick start

```text
/pin auth refactor        pin the current session, give it a note
/pin                      pin the current session (already pinned? shows it)
/bookmarks auth           open the picker, filtered to "auth"
```

Press `enter` on a row to switch into that session. That's it — no config, no index to build, no files touched besides the bookmark store.

## Commands

| Command | What it does |
| --- | --- |
| `/pin [note]` | Pin (bookmark) the current Pi session |
| `/bookmarks [query]` | `/resume`-style picker of pinned sessions |
| `/unpin` | Unpin this session |
| `/pin list` | Same as `/bookmarks` |
| `/pin rm` | Same as `/unpin` |
| `/pin prune` | Drop pins whose session files are gone |
| `ctrl+shift+b` | Toggle pin on this session |

The model can call the `pin_session` tool (`add` / `remove` / `list`) when you ask it to pin a session. It will not pin on its own.

## Picker

`/bookmarks` **reuses the same SelectList + DynamicBorder chrome as Pi [`/resume`](https://pi.dev/docs/latest/sessions)** — not a floating overlay — so the resume picker feels native.

| Key | Action |
| --- | --- |
| type | filter |
| `↑` `↓` | move |
| `enter` | resume the selected session |
| `tab` | this folder / all |
| `ctrl+d` | unpin |
| `ctrl+r` | edit note |
| `esc` | close |

Rows are unmarked — the picker simply lists pinned sessions (the current session is auto-selected; pressing enter on it says "Already in this session"). Missing files show `missing` and cannot be opened. A solid `◢` appears at the far right of the footer, under the model name, when the session you are in is pinned.

## Storage

Pins are **global**, not per-project:

```text
~/.pi/agent/pi-bookmark/bookmarks.json
```

Honors `PI_CODING_AGENT_DIR`. **Session JSONL files are never modified.**

## How this compares

pi-bookmark is the small pin list. It is a lightweight Pi session-manager alternative, not a full TUI and not a scoring engine.

| Need | Use |
| --- | --- |
| Pin / favorite a few important Pi sessions and jump back | **pi-bookmark** (`/pin` `/unpin` `/bookmarks`) |
| Browse every session in this project | Built-in `/resume` |
| Star sessions in a full TUI (`star` = full TUI, `pin` = short list) | `pisesh` |
| Score / rank / chain sessions | `pi-session-librarian` |
| Label a **message** inside `/tree` | Pi example `bookmark.ts` (not this package) |

`pi-session-bookmarks` and `pi-session-librarian` register `/bookmark`. This package uses `/pin` and `/unpin` so those commands do not collide.

## FAQ

### How do I bookmark a Pi session?

Install with `pi install npm:pi-bookmark`, then run `/pin` (optional note: `/pin auth refactor`). Open the list later with `/bookmarks`. Shortcut: `ctrl+shift+b` toggles the pin.

### Why /pin instead of /bookmark?

Other Pi packages already register `/bookmark`. pi-bookmark uses `/pin` and `/unpin` so it can sit next to `pi-session-bookmarks` or `pi-session-librarian` without the commands colliding. "Pin", "bookmark", and "favorite" all mean the same thing here.

### Where are bookmarks stored?

`~/.pi/agent/pi-bookmark/bookmarks.json` (or `$PI_CODING_AGENT_DIR/pi-bookmark/bookmarks.json`). One global store — not per-repo.

### Does it modify my session files?

No. Pi session JSONL files are immutable from this package's point of view. Only the bookmark store is written.

### Can I use it from another repo?

Yes. Pins are global. A bookmark made in `~/code/webapp` can be opened from `~/code/other`, and Pi's runtime cwd follows the session.

### Is this a Pi session manager? A favorites list? A plugin?

Yes, in the small-list sense: a favorites / pin list plus a resume picker. It is a Pi coding agent **extension** (`pi-package`). Some people search for "pi plugin bookmark" — this is that, without taking over `/bookmark`.

If you want a starred-session **full TUI**, use `pisesh` (`star` = TUI). If you want scores and ranking, use `pi-session-librarian`. If you only want the important threads one keystroke away, use pi-bookmark (`pin` = list).

## For coding agents and web search

Machine-readable summary: [`llms.txt`](./llms.txt)

Longer product page: [`docs/overview.md`](https://github.com/vaultboy001/pi-bookmark/blob/main/docs/overview.md)

Copy-paste facts:

```json
{
  "name": "pi-bookmark",
  "kind": "pi-package",
  "for": "@earendil-works/pi-coding-agent",
  "install": "pi install npm:pi-bookmark",
  "commands": ["/pin", "/unpin", "/bookmarks"],
  "shortcut": "ctrl+shift+b",
  "aliases": ["bookmark", "pin", "favorite", "session manager", "plugin"],
  "storage": "~/.pi/agent/pi-bookmark/bookmarks.json",
  "mutatesSessionJsonl": false,
  "repository": "https://github.com/vaultboy001/pi-bookmark"
}
```

**Search phrases this package matches:** Pi coding agent bookmark session, how to bookmark a Pi session, pin Pi session, favorite Pi session, Pi favorites sessions, Pi session manager, Pi coding agent resume picker, `/pin` extension for Pi, pi-package session bookmarks, Pi plugin bookmark, pin vs star Pi session.

## License

MIT. See [CHANGELOG](./CHANGELOG.md) for versions.
