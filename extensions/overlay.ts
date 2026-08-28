import { existsSync } from "node:fs";
import { DynamicBorder, getSelectListTheme, type Theme } from "@earendil-works/pi-coding-agent";
import {
	Container,
	Input,
	SelectList,
	Spacer,
	Text,
	matchesKey,
	type SelectItem,
} from "@earendil-works/pi-tui";
import { bookmarkTitle, relativeTime, sameCwd, shortPath } from "./format.js";
import type { Bookmark } from "./store.js";

export type BookmarkPickerResult = { action: "resume"; path: string } | undefined;

export interface BookmarkSelectorOptions {
	theme: Theme;
	bookmarks: Bookmark[];
	currentId?: string;
	currentCwd: string;
	onChange: (bookmarks: Bookmark[]) => void;
	requestRender: () => void;
	done: (result: BookmarkPickerResult) => void;
}

export class BookmarkSelector extends Container {
	private theme: Theme;
	private items: Bookmark[];
	private currentId?: string;
	private currentCwd: string;
	private onChange: (bookmarks: Bookmark[]) => void;
	private requestRender: () => void;
	private done: (result: BookmarkPickerResult) => void;

	private scopeHere = false;
	private mode: "list" | "rename" = "list";
	private list: SelectList;
	private renameInput = new Input();
	private renameId: string | undefined;
	private filter = "";

	constructor(options: BookmarkSelectorOptions) {
		super();
		this.theme = options.theme;
		this.items = options.bookmarks.slice();
		this.currentId = options.currentId;
		this.currentCwd = options.currentCwd;
		this.onChange = options.onChange;
		this.requestRender = options.requestRender;
		this.done = options.done;

		this.renameInput.onSubmit = (value) => this.confirmRename(value);
		this.renameInput.onEscape = () => this.exitRename();
		this.list = this.createList();
		this.layout();
	}

	setQuery(query: string): void {
		this.filter = query;
		this.list.setFilter(query);
	}

	handleInput(data: string): void {
		if (this.mode === "rename") {
			this.renameInput.handleInput(data);
			this.requestRender();
			return;
		}
		if (matchesKey(data, "tab")) {
			this.scopeHere = !this.scopeHere;
			this.rebuild();
			this.requestRender();
			return;
		}
		if (matchesKey(data, "ctrl+d")) {
			this.dropSelected();
			this.requestRender();
			return;
		}
		if (matchesKey(data, "ctrl+r")) {
			this.enterRename();
			this.requestRender();
			return;
		}
		this.list.handleInput(data);
		this.requestRender();
	}

	private scoped(): Bookmark[] {
		return this.items.filter((bookmark) => {
			if (this.scopeHere && !sameCwd(bookmark.cwd, this.currentCwd)) return false;
			return true;
		});
	}

	private toSelectItems(): SelectItem[] {
		return this.scoped().map((bookmark) => {
			const missing = !existsSync(bookmark.path);
			const current = bookmark.id === this.currentId;
			const where = missing ? "missing" : shortPath(bookmark.cwd);
			const here = current ? "  · here" : "";
			return {
				value: bookmark.id,
				label: bookmarkTitle(bookmark),
				description: `${relativeTime(bookmark.updatedAt)}  ${where}${here}`,
			};
		});
	}

	private createList(): SelectList {
		const selectItems = this.toSelectItems();
		const list = new SelectList(selectItems, Math.min(Math.max(selectItems.length, 1), 12), getSelectListTheme());
		list.onSelect = (item) => {
			const bookmark = this.items.find((row) => row.id === item.value);
			if (!bookmark || !existsSync(bookmark.path)) return;
			this.done({ action: "resume", path: bookmark.path });
		};
		list.onCancel = () => this.done(undefined);
		const focusId = this.currentId;
		if (focusId) {
			const index = selectItems.findIndex((item) => item.value === focusId);
			if (index >= 0) list.setSelectedIndex(index);
		}
		if (this.filter) list.setFilter(this.filter);
		return list;
	}

	private rebuild(keepId?: string): void {
		const selected = keepId ?? this.list.getSelectedItem()?.value;
		this.list = this.createList();
		if (selected) {
			const index = this.toSelectItems().findIndex((item) => item.value === selected);
			if (index >= 0) this.list.setSelectedIndex(index);
		}
		this.layout();
	}

	private layout(): void {
		this.clear();
		const th = this.theme;
		this.addChild(new Spacer(1));
		this.addChild(new DynamicBorder((s) => th.fg("accent", s)));
		this.addChild(new Spacer(1));
		this.addChild(this.header());
		this.addChild(new Spacer(1));
		if (this.mode === "rename") {
			this.addChild(new Text(th.fg("dim", "Note"), 1, 0));
			this.addChild(this.renameInput);
		} else {
			this.addChild(this.list);
		}
		this.addChild(new Spacer(1));
		this.addChild(new Text(th.fg("dim", this.hint()), 1, 0));
		this.addChild(new Spacer(1));
		this.addChild(new DynamicBorder((s) => th.fg("accent", s)));
	}

	private header(): Text {
		const th = this.theme;
		const scope = this.scopeHere ? "Current Folder" : "All";
		const count = this.scoped().length;
		const title = th.bold(`Bookmarks (${scope})`);
		const switcher = this.scopeHere
			? `${th.fg("accent", "◉ Current Folder")}${th.fg("muted", " | ○ All")}`
			: `${th.fg("muted", "○ Current Folder | ")}${th.fg("accent", "◉ All")}`;
		return new Text(`${title}  ${th.fg("dim", String(count))}    ${switcher}`, 1, 0);
	}

	private hint(): string {
		if (this.mode === "rename") return "enter save · esc cancel";
		return "type to filter · tab scope · enter open · ctrl+d unpin · ctrl+r note · esc";
	}

	private dropSelected(): void {
		const selected = this.list.getSelectedItem();
		if (!selected) return;
		this.items = this.items.filter((bookmark) => bookmark.id !== selected.value);
		this.onChange(this.items);
		if (this.items.length === 0) {
			this.done(undefined);
			return;
		}
		this.rebuild();
	}

	private enterRename(): void {
		const selected = this.list.getSelectedItem();
		if (!selected) return;
		const bookmark = this.items.find((row) => row.id === selected.value);
		if (!bookmark) return;
		this.mode = "rename";
		this.renameId = bookmark.id;
		this.renameInput.setValue(bookmark.note);
		this.layout();
	}

	private confirmRename(value: string): void {
		const id = this.renameId;
		if (id) {
			const bookmark = this.items.find((row) => row.id === id);
			if (bookmark) {
				bookmark.note = value.trim();
				bookmark.updatedAt = new Date().toISOString();
				this.items = [bookmark, ...this.items.filter((row) => row.id !== id)];
				this.onChange(this.items);
			}
		}
		this.exitRename(id);
	}

	private exitRename(keepId?: string): void {
		this.mode = "list";
		this.renameId = undefined;
		this.rebuild(keepId);
	}
}
