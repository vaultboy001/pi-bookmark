<p>
  <img src="assets/cover.png" alt="pi-bookmark" width="1100">
</p>

# pi-bookmark

**Pin important Pi sessions. Keep the thread. Resume it from any workspace.**

A [Pi coding agent](https://pi.dev) extension (`pi-package`) that gives you a short, global list of the sessions you actually want again — instead of scrolling Pi's `/resume` and hoping.

<https://raw.githubusercontent.com/vaultboy001/pi-bookmark/main/assets/demo.mp4>

## Why this exists

Pi's built-in [`/resume`](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/sessions.md) lists every session you ever started. After a week that's 50+ entries with no titles, no tags, and no order. The big session where you fixed the auth bug is buried between two scratch sessions.

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
/pin                      if already pinned, open the picker
/bookmarks auth           open the picker, filtered to "auth"
```

Press `enter` on a row to switch into that session. That's it — no config, no index to build, no files touched besides the bookmark store.

## Commands

| Command | What it does |
| --- | --- |
| `/pin [note]` | Pin (bookmark) the current Pi session |
| `/pin` | If already pinned, open the bookmark picker |
| `/unpin` | Unpin this session |
| `/bookmarks [query]` | `/resume`-style picker of pinned sessions |
| `/pin list` | Same as `/bookmarks` |
| `/pin rm` | Same as `/unpin` |
| `/pin prune` | Drop pins whose session files are gone |
| `ctrl+shift+b` | Toggle pin on this session |

The model can call the `pin_session` tool (`add` / `remove` / `list`) when you ask it to pin a session. It will not pin on its own.

## Picker

`/bookmarks` uses the same picker chrome as Pi `/resume` (SelectList + DynamicBorder, not a floating overlay) — so it feels native.

| Key | Action |
| --- | --- |
| type | filter |
| `↑` `↓` | move |
| `enter` | resume the selected session |
| `tab` | this folder / all |
| `ctrl+d` | unpin |
| `ctrl+r` | edit note |
| `esc` | close |

Current session is marked `★`. Missing files are marked `✕` and cannot be opened. A footer status `★ …` shows when the session you are in is pinned.

## Storage

Pins are **global**, not per-project:

```text
~/.pi/agent/pi-bookmark/bookmarks.json
```

Honors `PI_CODING_AGENT_DIR`. **Session JSONL files are never modified.**

## How this compares

| Need | Use |
| --- | --- |
| Pin a few important Pi sessions and jump back | **pi-bookmark** (`/pin` `/unpin` `/bookmarks`) |
| Browse every session in this project | Built-in `/resume` |
| Star sessions in a full TUI | `pisesh` |
| Score / rank / chain sessions | `pi-session-librarian` |
| Label a **message** inside `/tree` | Pi example `bookmark.ts` (not this package) |

`pi-session-bookmarks` and `pi-session-librarian` register `/bookmark`. This package uses `/pin` and `/unpin` so those commands do not collide.

## For coding agents and web search

Machine-readable summary: [`llms.txt`](./llms.txt)

Copy-paste facts:

```json
{
  "name": "pi-bookmark",
  "kind": "pi-package",
  "for": "@earendil-works/pi-coding-agent",
  "install": "pi install npm:pi-bookmark",
  "commands": ["/pin", "/unpin", "/bookmarks"],
  "shortcut": "ctrl+shift+b",
  "storage": "~/.pi/agent/pi-bookmark/bookmarks.json",
  "repository": "https://github.com/vaultboy001/pi-bookmark"
}
```

**Search phrases this package matches:** Pi coding agent bookmark session, pin Pi session, favorite Pi conversation, resume important Pi session, `/pin` extension for Pi, pi-package session bookmarks.

## License

MIT
