import { existsSync } from "node:fs";
import { StringEnum } from "@earendil-works/pi-ai";
import type { ExtensionAPI, ExtensionCommandContext, ExtensionContext } from "@earendil-works/pi-coding-agent";
import { Type } from "typebox";
import { bookmarkTitle, collapse, firstUserPreview } from "./format.js";
import { BookmarkSelector, type BookmarkPickerResult } from "./overlay.js";
import { BookmarkStore, type Bookmark } from "./store.js";

const STATUS_ID = "pi-bookmark";

export default function (pi: ExtensionAPI) {
	const store = BookmarkStore.default();

	const snapshot = (ctx: ExtensionContext, note: string): Bookmark | undefined => {
		const path = ctx.sessionManager.getSessionFile();
		const id = ctx.sessionManager.getSessionId();
		if (!path || !id) return undefined;
		const name = pi.getSessionName() || ctx.sessionManager.getSessionName() || undefined;
		return {
			id,
			path,
			cwd: ctx.sessionManager.getCwd() || ctx.cwd,
			name,
			note,
			preview: firstUserPreview(ctx),
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};
	};

	const updateStatus = (ctx: ExtensionContext): void => {
		if (!ctx.hasUI) return;
		const id = ctx.sessionManager.getSessionId();
		const bookmark = id ? store.find(id) : undefined;
		if (!bookmark) {
			ctx.ui.setStatus(STATUS_ID, undefined);
			return;
		}
		const label = collapse(bookmarkTitle(bookmark), 32);
		ctx.ui.setStatus(STATUS_ID, `${ctx.ui.theme.fg("accent", "★")} ${ctx.ui.theme.fg("dim", label)}`);
	};

	const silentRefresh = (ctx: ExtensionContext): void => {
		const current = snapshot(ctx, "");
		if (!current) return;
		const existing = store.find(current.id);
		if (!existing) return;
		store.upsert(
			{
				...existing,
				path: current.path,
				cwd: current.cwd,
				name: current.name,
				preview: current.preview || existing.preview,
			},
			{ touch: false },
		);
	};

	const pin = (ctx: ExtensionContext, note: string): Bookmark | undefined => {
		const current = snapshot(ctx, note);
		if (!current) {
			ctx.ui.notify("Cannot pin an ephemeral session", "warning");
			return undefined;
		}
		const existing = store.find(current.id);
		const saved = store.upsert({
			...current,
			note: note || existing?.note || "",
			createdAt: existing?.createdAt || current.createdAt,
		});
		updateStatus(ctx);
		return saved;
	};

	const unpin = (ctx: ExtensionContext): boolean => {
		const id = ctx.sessionManager.getSessionId();
		if (!id) return false;
		const removed = store.remove(id);
		updateStatus(ctx);
		return removed;
	};

	const openPicker = async (ctx: ExtensionCommandContext, query?: string): Promise<void> => {
		if (ctx.mode !== "tui") {
			const rows = store.load().map((bookmark) => {
				const flag = existsSync(bookmark.path) ? " " : "!";
				return `${flag} ${bookmarkTitle(bookmark)}  ${bookmark.cwd}`;
			});
			const text = rows.length > 0 ? rows.join("\n") : "No bookmarks.";
			if (ctx.hasUI) ctx.ui.notify(text, "info");
			else console.log(text);
			return;
		}

		const bookmarks = store.load();
		if (bookmarks.length === 0) {
			ctx.ui.notify("No bookmarks yet. /pin to pin this session.", "info");
			return;
		}

		const result = await ctx.ui.custom<BookmarkPickerResult>((tui, theme, _kb, done) => {
			const selector = new BookmarkSelector({
				theme,
				bookmarks,
				currentId: ctx.sessionManager.getSessionId(),
				currentCwd: ctx.cwd,
				onChange: (next) => {
					store.save(next);
					updateStatus(ctx);
				},
				requestRender: () => tui.requestRender(),
				done,
			});
			const initial = query?.trim();
			if (initial) selector.setQuery(initial);
			return selector;
		});

		if (!result || result.action !== "resume") {
			updateStatus(ctx);
			return;
		}

		const path = result.path;
		if (!existsSync(path)) {
			ctx.ui.notify("Pinned session file is missing", "error");
			return;
		}
		if (path === ctx.sessionManager.getSessionFile()) {
			ctx.ui.notify("Already in this session", "info");
			return;
		}

		const switched = await ctx.switchSession(path, {
			withSession: async (next) => {
				const id = next.sessionManager.getSessionId();
				const opened = id ? store.find(id) : undefined;
				next.ui.notify(`Opened ${opened ? bookmarkTitle(opened) : "pin"}`, "info");
			},
		});
		if (switched.cancelled) ctx.ui.notify("Switch cancelled", "warning");
	};

	pi.on("session_start", async (_event, ctx) => {
		silentRefresh(ctx);
		updateStatus(ctx);
	});

	pi.on("session_info_changed", async (_event, ctx) => {
		silentRefresh(ctx);
		updateStatus(ctx);
	});

	pi.registerCommand("pin", {
		description: "Pin this session. /pin [note] · list · rm · prune",
		getArgumentCompletions: (prefix) => {
			const options = ["list", "rm", "prune", ...store.load().map((bookmark) => bookmark.note).filter(Boolean)];
			const items = [...new Set(options)]
				.filter((value) => value.toLowerCase().startsWith(prefix.toLowerCase()))
				.map((value) => ({ value, label: value }));
			return items.length > 0 ? items : null;
		},
		handler: async (args, ctx) => {
			const text = args.trim();
			if (text === "list" || text === "ls") {
				await openPicker(ctx);
				return;
			}
			if (text === "rm" || text === "remove") {
				ctx.ui.notify(unpin(ctx) ? "Unpinned" : "This session is not pinned", "info");
				return;
			}
			if (text === "prune") {
				const removed = store.pruneMissing();
				updateStatus(ctx);
				ctx.ui.notify(removed > 0 ? `Removed ${removed} missing pin${removed === 1 ? "" : "s"}` : "Nothing to prune", "info");
				return;
			}

			const id = ctx.sessionManager.getSessionId();
			const existing = id ? store.find(id) : undefined;
			if (!text && existing) {
				await openPicker(ctx);
				return;
			}

			const saved = pin(ctx, text);
			if (!saved) return;
			ctx.ui.notify(existing ? `Updated pin: ${bookmarkTitle(saved)}` : `Pinned: ${bookmarkTitle(saved)}`, "info");
		},
	});

	pi.registerCommand("bookmarks", {
		description: "Browse pinned sessions",
		handler: async (args, ctx) => {
			await openPicker(ctx, args);
		},
	});

	pi.registerCommand("unpin", {
		description: "Unpin this session",
		handler: async (_args, ctx) => {
			ctx.ui.notify(unpin(ctx) ? "Unpinned" : "This session is not pinned", "info");
		},
	});

	pi.registerShortcut("ctrl+shift+b", {
		description: "Pin or unpin this session",
		handler: async (ctx) => {
			const id = ctx.sessionManager.getSessionId();
			if (id && store.find(id)) {
				unpin(ctx);
				ctx.ui.notify("Unpinned", "info");
				return;
			}
			const saved = pin(ctx, "");
			if (saved) ctx.ui.notify(`Pinned: ${bookmarkTitle(saved)}`, "info");
		},
	});

	pi.registerTool({
		name: "pin_session",
		label: "Pin",
		description: "Pin, unpin, or list pinned Pi sessions so important threads can be resumed later.",
		promptSnippet: "Pin the current session or list pinned sessions",
		promptGuidelines: [
			"Use pin_session when the user asks to pin, unpin, or list important Pi sessions.",
			"Do not pin sessions unless the user asks.",
		],
		parameters: Type.Object({
			action: StringEnum(["add", "remove", "list"] as const),
			note: Type.Optional(Type.String({ description: "Optional note stored with the pin" })),
		}),
		async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
			if (params.action === "list") {
				const rows = store.load().map((bookmark) => ({
					id: bookmark.id,
					title: bookmarkTitle(bookmark),
					cwd: bookmark.cwd,
					note: bookmark.note,
					missing: !existsSync(bookmark.path),
				}));
				return {
					content: [{ type: "text", text: rows.length === 0 ? "No bookmarks." : JSON.stringify(rows, null, 2) }],
					details: { count: rows.length },
				};
			}
			if (params.action === "remove") {
				const removed = unpin(ctx);
				return {
					content: [{ type: "text", text: removed ? "Unpinned." : "This session is not pinned." }],
					details: { removed },
				};
			}
			const saved = pin(ctx, params.note?.trim() ?? "");
			if (!saved) {
				return {
					content: [{ type: "text", text: "Cannot pin an ephemeral session." }],
					details: { ok: false },
					isError: true,
				};
			}
			return {
				content: [{ type: "text", text: `Pinned: ${bookmarkTitle(saved)}` }],
				details: { id: saved.id, note: saved.note },
			};
		},
	});
}
