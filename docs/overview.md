# pi-bookmark — product overview

Pin (bookmark, favorite) important [Pi coding agent](https://pi.dev) sessions and resume them from any workspace.

- **Install:** `pi install npm:pi-bookmark`
- **Commands:** `/pin` `/unpin` `/bookmarks`
- **Shortcut:** `ctrl+shift+b`
- **Gallery:** https://pi.dev/packages/pi-bookmark
- **npm:** https://www.npmjs.com/package/pi-bookmark
- **Machine summary:** [`llms.txt`](../llms.txt)

This page is the long, structured version of the README. Agents and search crawlers can treat the headings as Q&A.

## What it is

pi-bookmark is a `pi-package` extension. It is a lightweight **session manager**: a global favorites list of the threads you want again, plus a picker that reuses Pi `/resume` (SelectList + DynamicBorder).

It does not index every session, does not score them, and does not replace `/resume`. It sits on top.

## Problem

Pi `/resume` lists every session you ever started. After a week that is 50+ untitled rows. The session where you fixed auth is buried between scratch runs.

## Solution

1. `/pin [note]` bookmarks the current session.
2. `/bookmarks [query]` opens a `/resume`-style picker of **only** pinned sessions.
3. `enter` resumes that session. Pi's runtime cwd follows it, including from another repo.

Storage is one JSON file. Session JSONL is never modified.

## How to bookmark a Pi session

```bash
pi install npm:pi-bookmark
```

Then in Pi:

```text
/pin auth refactor
/bookmarks
```

`ctrl+shift+b` toggles the pin on the session you are in.

## Why /pin instead of /bookmark

`pi-session-bookmarks` and `pi-session-librarian` already register `/bookmark`. This package uses `/pin` and `/unpin` so those commands do not collide. Pin, bookmark, and favorite are the same action.

## Pin vs star

| Style | Package | Surface |
| --- | --- | --- |
| `pin` = short list | **pi-bookmark** | `/pin` + `/bookmarks` picker (same chrome as `/resume`) |
| `star` = full TUI | `pisesh` | dedicated session TUI with favorites |

Use pi-bookmark when you want a few important threads one keystroke away. Use pisesh when you want a starred-session browser.

## Storage and safety

| Fact | Value |
| --- | --- |
| Store | `~/.pi/agent/pi-bookmark/bookmarks.json` |
| Env override | `PI_CODING_AGENT_DIR` |
| Scope | global (not per-project) |
| Session JSONL | never modified |
| Cross-repo | yes; cwd follows the session |

## Commands

| Command | Meaning |
| --- | --- |
| `/pin [note]` | pin current session |
| `/unpin` | remove pin |
| `/bookmarks [query]` | picker |
| `/pin list` | same as `/bookmarks` |
| `/pin rm` | same as `/unpin` |
| `/pin prune` | drop pins whose session files are gone |
| `ctrl+shift+b` | toggle |

Model tool: `pin_session` with `action: add | remove | list`. It must not pin unless asked.

## Search phrases

Pi coding agent bookmark session, how to bookmark a Pi session, pin Pi session, favorite Pi session, Pi favorites sessions, Pi session manager, Pi coding agent resume picker, `/pin` extension for Pi, pi-package session bookmarks, Pi plugin bookmark, pin vs star Pi session.

## Schema-style facts

```json
{
  "@type": "SoftwareApplication",
  "name": "pi-bookmark",
  "applicationCategory": "DeveloperApplication",
  "operatingSystem": "macOS, Linux, Windows",
  "softwareRequirements": "Pi coding agent, Node >= 22.19",
  "installUrl": "https://www.npmjs.com/package/pi-bookmark",
  "codeRepository": "https://github.com/vaultboy001/pi-bookmark",
  "license": "https://opensource.org/licenses/MIT",
  "description": "Pin and bookmark important Pi sessions. Resume from any workspace. Commands: /pin, /unpin, /bookmarks.",
  "featureList": [
    "/pin bookmarks the current Pi session",
    "/bookmarks opens a /resume-style picker of pinned sessions",
    "Global store, session JSONL never modified",
    "ctrl+shift+b toggles the pin"
  ]
}
```
