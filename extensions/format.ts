import { homedir } from "node:os";
import { resolve } from "node:path";
import type { ExtensionContext } from "@earendil-works/pi-coding-agent";
import type { Bookmark } from "./store.js";

export function firstUserPreview(ctx: ExtensionContext): string {
	for (const entry of ctx.sessionManager.getEntries()) {
		if (entry.type !== "message") continue;
		const message = entry.message;
		if (!("role" in message) || message.role !== "user") continue;
		const text = messageText(message.content);
		if (text) return collapse(text);
	}
	return "";
}

export function messageText(content: unknown): string {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content
		.filter((part): part is { type: "text"; text: string } => {
			return Boolean(part && typeof part === "object" && (part as { type?: string }).type === "text");
		})
		.map((part) => part.text)
		.join(" ");
}

export function collapse(text: string, max = 160): string {
	const compact = text.replace(/\s+/g, " ").trim();
	if (compact.length <= max) return compact;
	return `${compact.slice(0, Math.max(0, max - 1)).trimEnd()}…`;
}

export function bookmarkTitle(bookmark: Bookmark): string {
	return bookmark.note.trim() || bookmark.name?.trim() || bookmark.preview.trim() || bookmark.id.slice(0, 8);
}

export function shortPath(path: string): string {
	const home = homedir();
	if (path === home) return "~";
	if (path.startsWith(`${home}/`) || path.startsWith(`${home}\\`)) {
		return `~${path.slice(home.length)}`;
	}
	return path;
}

export function sameCwd(a: string, b: string): boolean {
	if (!a || !b) return false;
	try {
		return resolve(a) === resolve(b);
	} catch {
		return a === b;
	}
}

export function relativeTime(iso: string, now = Date.now()): string {
	const then = new Date(iso).getTime();
	if (Number.isNaN(then)) return "";
	const seconds = Math.max(0, Math.round((now - then) / 1000));
	if (seconds < 60) return `${seconds}s`;
	const minutes = Math.round(seconds / 60);
	if (minutes < 60) return `${minutes}m`;
	const hours = Math.round(minutes / 60);
	if (hours < 48) return `${hours}h`;
	const days = Math.round(hours / 24);
	if (days < 14) return `${days}d`;
	const weeks = Math.round(days / 7);
	if (weeks < 8) return `${weeks}w`;
	return `${Math.round(days / 30)}mo`;
}

export function matchesQuery(bookmark: Bookmark, query: string): boolean {
	const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
	if (terms.length === 0) return true;
	const haystack = [bookmark.note, bookmark.name ?? "", bookmark.preview, bookmark.cwd, bookmark.id, bookmark.path]
		.join(" ")
		.toLowerCase();
	return terms.every((term) => haystack.includes(term));
}
