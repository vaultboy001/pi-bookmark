import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { getAgentDir } from "@earendil-works/pi-coding-agent";

export interface Bookmark {
	id: string;
	path: string;
	cwd: string;
	name?: string;
	note: string;
	preview: string;
	createdAt: string;
	updatedAt: string;
}

interface BookmarkFile {
	version: 1;
	bookmarks: Bookmark[];
}

function isBookmark(value: unknown): value is Bookmark {
	if (!value || typeof value !== "object") return false;
	const row = value as Record<string, unknown>;
	return (
		typeof row.id === "string" &&
		typeof row.path === "string" &&
		typeof row.cwd === "string" &&
		typeof row.note === "string" &&
		typeof row.preview === "string" &&
		typeof row.createdAt === "string" &&
		typeof row.updatedAt === "string" &&
		(row.name === undefined || typeof row.name === "string")
	);
}

export class BookmarkStore {
	readonly filePath: string;

	constructor(filePath: string) {
		this.filePath = filePath;
	}

	static default(): BookmarkStore {
		return new BookmarkStore(join(getAgentDir(), "pi-bookmark", "bookmarks.json"));
	}

	load(): Bookmark[] {
		try {
			const parsed = JSON.parse(readFileSync(this.filePath, "utf8")) as BookmarkFile;
			if (!parsed || !Array.isArray(parsed.bookmarks)) return [];
			return parsed.bookmarks.filter(isBookmark);
		} catch (error) {
			if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
			throw error;
		}
	}

	save(bookmarks: Bookmark[]): void {
		mkdirSync(dirname(this.filePath), { recursive: true });
		const tmp = `${this.filePath}.${process.pid}.tmp`;
		const payload: BookmarkFile = { version: 1, bookmarks };
		writeFileSync(tmp, `${JSON.stringify(payload, null, 2)}\n`);
		renameSync(tmp, this.filePath);
	}

	find(id: string): Bookmark | undefined {
		return this.load().find((bookmark) => bookmark.id === id);
	}

	upsert(bookmark: Bookmark, options?: { touch?: boolean }): Bookmark {
		const touch = options?.touch ?? true;
		const all = this.load();
		const index = all.findIndex((row) => row.id === bookmark.id);
		const now = new Date().toISOString();
		let next: Bookmark;
		if (index >= 0) {
			const previous = all[index]!;
			next = {
				...previous,
				...bookmark,
				createdAt: previous.createdAt,
				updatedAt: touch ? now : previous.updatedAt,
			};
			if (touch) {
				all.splice(index, 1);
				all.unshift(next);
			} else {
				all[index] = next;
			}
		} else {
			next = { ...bookmark, createdAt: bookmark.createdAt || now, updatedAt: now };
			all.unshift(next);
		}
		this.save(all);
		return next;
	}

	remove(id: string): boolean {
		const all = this.load();
		const next = all.filter((bookmark) => bookmark.id !== id);
		if (next.length === all.length) return false;
		this.save(next);
		return true;
	}

	pruneMissing(): number {
		const all = this.load();
		const next = all.filter((bookmark) => existsSync(bookmark.path));
		const removed = all.length - next.length;
		if (removed > 0) this.save(next);
		return removed;
	}
}
