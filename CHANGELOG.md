# Changelog

All notable changes to pi-bookmark are documented here.

## [0.1.4] - 2026-08-28

### Docs

- README FAQ for "how to bookmark a Pi session", `/pin` vs `/bookmark`, storage, JSONL immutability, cross-repo resume
- npm description now includes the word "bookmark" (pi.dev catalog search)
- Shields.io badges, search-phrase coverage for session manager / favorites / resume picker
- `llms.txt` aliases and gallery link
- Longer product page at `docs/overview.md`

## [0.1.3] - 2026-08-28

### Changed

- `/pin` always pins — no surprise picker when the session is already pinned
- Already-pinned `/pin` with no note reports the existing pin; a note updates it

## [0.1.2] - 2026-08-27

### Changed

- Replace star glyph with solid right triangle (`◢`), right-aligned under the model name

## [0.1.1] - 2026-08-27

### Added

- Gallery video (`pi.video`) and cover image (`pi.image`)
- Banner README, tighter keywords and description

## [0.1.0] - 2026-08-27

### Added

- `/pin`, `/unpin`, `/bookmarks` plus `ctrl+shift+b`
- Global bookmark store at `~/.pi/agent/pi-bookmark/bookmarks.json`
- `/resume`-style SelectList picker
- `pin_session` tool (`add` / `remove` / `list`)
