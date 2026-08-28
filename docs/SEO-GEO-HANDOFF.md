# pi-bookmark SEO/GEO Handoff

> 文档状态: v1.1 — 2026-08-28 (P0 落地后)
> 适用对象: 接手 SEO/GEO 优化的下一任 agent（或 human）
> 项目根: `/Users/brandon/workspace/pi/pi-bookmark`
> 本文件不进入 npm 包（见 `.npmignore` 计划），不提交到 GitHub 的公开内容，除非明确决策

---

## 0. 接手人先看这一页

### 0.1 这是什么

`pi-bookmark` 是一个 [Pi coding agent](https://pi.dev) 的 pi-package（npm 扩展），
功能是"钉住重要 Pi 会话，跨工作区一键恢复"。命令 `/pin` `/unpin` `/bookmarks`，
快捷键 `ctrl+shift+b`。

SEO/GEO 的"产品"是：**当人类或 agent 在搜索 "pi bookmark session" 这类词时，
pi-bookmark 被找到、被理解、被安装。**

### 0.2 当前上线状态

| 项目 | 当前值 |
|---|---|
| GitHub | `vaultboy001/pi-bookmark` (public, main@0.1.4, homepage=gallery) |
| npm | `pi-bookmark@0.1.4` (latest, published 2026-08-28T04:20Z) |
| pi.dev 画廊 | `https://pi.dev/packages/pi-bookmark`（详情页 OK；**catalog 搜 bookmark 曾 miss**，因 npm description 无单词 bookmark，0.1.4 已改） |
| 本地安装 | `~/.pi/agent/settings.json` → `../../workspace/pi/pi-bookmark`（local path） |
| 主题色 | brass `#c9a227` / carbon `#17140f` / cream `#f4e7c3` |

### 0.3 一句话现状判断

**完成度约 75%**：P0 README FAQ / badges / 画廊验证 / description 含 bookmark 已做。
仍缺（1）外部引用和社区发帖（草稿在 `docs/community-drafts.md`，未发）（2）GitHub social preview 需人手上传 cover.png
（3）pi.dev catalog 搜 `bookmark` 是否收录 0.1.4 — 发布后复查（4）schema.org 独立 HTML 页。

---

## 1. 已完成的工作（不要重做）

### 1.1 包元数据（`package.json`）

- `keywords`（13 个）：原 12 + `picker`。**不要加 `plugin`**（混淆度高；README FAQ 已覆盖 "pi plugin bookmark"）
- `description`（90 chars，必须含单词 `bookmark`）：
  `Pin and bookmark important Pi sessions. Resume from any workspace. /pin /unpin /bookmarks.`
- `pi.manifest`：`extensions`, `image`(cover.png), `video`(demo.mp4)
  画廊详情页有 VIDEO+IMAGE；Playwright hover **未**触发 autoplay（click 开 modal + controls）。Keywords 不在画廊 UI 显示。
- 原则：description 是**给 npm/pi.dev 卡片的文案**，keywords 是给**搜索索引的词库**，
  两者都已对齐"pin/bookmark + Pi session"这个目标查询群

### 1.2 README（已在 `README.md`）

结构（按 top 包 pi-mcp-adapter / pi-web-access 模式）：
1. banner 图 → h1 → 一句话定位
2. demo.mp4 视频
3. "Why this exists"（问题叙事）
4. Install（唯一命令 `pi install npm:pi-bookmark`）
5. Quick start（可复制示例）
6. Commands 表 / Picker 键位表
7. Storage 路径
8. 对比表（vs pisesh / pi-session-librarian / pi example bookmark.ts）
9. "For coding agents and web search" + `llms.txt` 链接 + JSON 事实块
10. 搜索词声明行（"Search phrases this package matches: ..."）
11. License

### 1.3 `llms.txt`

`/Users/brandon/workspace/pi/pi-bookmark/llms.txt` — 机器可读摘要：
安装命令、命令清单、存储路径、工具、防混淆说明（不是 message-label bookmark.ts、
不与 pi-session-bookmarks 冲突）、Facts for retrieval 块。

### 1.4 视觉资产（`assets/`）

- `cover.png` 1600x900（brass pin × ticket 视觉）
- `demo.gif` 960×569 32帧 + `demo.mp4`（x264, faststart）
- 源文件在 `assets/src/*.html`（可编辑，用 Chrome headless + file:// 重新截图，
  命令见 §5.1）
- **硬规则：UI 内禁用 emoji**（已用 `◢` 三角形替代 star；后续所有视觉沿用）

### 1.5 辅助

- `.gitignore`（含 `assets/_frames/`）
- LICENSE MIT
- GitHub topics 7 个：`bookmark, cli, extension, pi-coding-agent, pi-package,
  session, terminal, tui`

---

## 2. 目标查询群（SEO 关键词策略）

### 2.1 已覆盖（README/llms 已含）

- "pi bookmark session" / "bookmark pi session"
- "pin pi session" / "pin session pi"
- "pi coding agent bookmark extension"
- "pi-package session bookmarks"
- "resume important pi session"
- "/pin extension for pi"

### 2.2 缺口（下一步补）

| # | 目标查询 | 待落地动作 |
|---|---|---|
| 1 | "pi session manager" | README "How this compares" 表中加一段明确说 pi-bookmark 是轻量 session-manager 替代；llms.txt Facts 加别名 |
| 2 | "pi favorites sessions" / "favorite session pi" | keywords 已有 favorite；README 里加一行 alt-term 声明 |
| 3 | "pi bookmark star session" | 与 pisesh 的差异点重写成对比句（star = full TUI vs pin = list） |
| 4 | "pi coding agent resume picker" | 说明"复用 /resume 同款 SelectList 交互"（已提到，加粗+超链到 Pi docs） |
| 5 | "pi plugin bookmark" | npm keywords 增加 `plugin`（会加大竞品混淆度，需权衡） |
| 6 | "how to bookmark pi session" | 新增 FAQ 段（README 或独立 FAQ.md），问题-回答式，利于回答型搜索 |

### 2.3 长尾（低优先级）

"pi bookmark ctrl shift b" / "pi pin session jsonl" / "pi bookmark storage path" —
这些在 README 里已有事实，不必单独成词。

---

## 3. 结构性动作清单（按优先级排序）

### P0 — 本周内收益最高

- [x] **P0-1 README 加 FAQ 段**（问题式标题，直接回答搜索者）
- [x] **P0-2 README 顶部加 shields.io 徽章行**
- [x] **P0-3 验证 pi.dev 画廊实际渲染**（详情页 OK，无 submit/claim；catalog 搜 bookmark 曾 miss — 见 §0.3）
- [x] **P0-4 发布节律**：0.1.4 为本轮内容版。注意：gallery "Recently published" 只列**新包首次出现**，bump 版本不会回到该栏。

### P1 — 提升权威与外部引用

- [x] **P1-1 GitHub 仓库主页优化**：About 已填；homepage → gallery；topics +`resume` +`favorites`；`CHANGELOG.md` 已加
- [ ] **P1-2 社区发帖/回答**（GEO 核心：外部权威引用）— 草稿 `docs/community-drafts.md`，**未发**
  - Discord: https://discord.com/invite/3cU7Bz4UPx
  - 新开 earendil-works/pi discussion（不要劫持 pisesh 的 #5244）
  - Show HN 标题见草稿
- [x] **P1-3 npm 描述对齐画廊卡片**：90 chars，卖点在前且含 `bookmark`（catalog 搜索关键）
- [ ] **P1-4 GitHub "Social preview"**：仓库设置里把 social preview 设为 cover.png
  （仓库 meta → opt-in 于 about 页）
- [ ] **P1-5 发一枚 Release tag**（`git tag v0.1.3 && gh release create`），
  GitHub 的 release 会被 agent 搜索引擎索引

### P2 — 结构化数据与摘要优化

- [ ] **P2-1 README 加 JSON-LD 区块**（hidden script in README raw HTML 无效 —— 实际做法：
  在 GitHub 仓库 ABOUT + `llms.txt` 已覆盖；如需 schema.org，可在独立 `docs/` 页面
  放 `<script type="application/ld+json">`，链接进 README）
- [x] **P2-2 独立 `docs/overview.md`**：GitHub 绝对链接（不进 npm tarball）
- [ ] **P2-3 web_search 自查**（见 §5.2；发布后跑）

### P3 — 长线

- [ ] **P3-1 多平台副本同步**：npm README 与 GitHub README 一致性（npm 读取包内 README，
  已由 `files` 包含，改后必须 `npm publish` 才生效 —— **关键陷阱**）
- [ ] **P3-2 名称保护**：监控是否有 `@scope/pi-bookmark` 或相似命名出现
- [ ] **P3-3 双语（中/EN）**：README 加 EN 为主、中文详见 `docs/README.zh.md`，
  覆盖中文 agent 搜索（"pi 会话 书签"）

---

## 4. 已知陷阱与红线

1. **npm README ≠ GitHub README 自动同步**。README 改完必须 `npm publish`
   （需要在 package 的 `files` 里有 README.md —— 已有）。只 push 不 publish，
   npm 卡片不会更新。
2. **publish 需要 npm 2FA**：本机已设 automation 模式，但每 session 的 token 可能过期；
   `npm whoami` 会告诉你。OTP 失效就 `cd pi-bookmark && npm publish` 交互输入。
3. **发布后 pi.dev 索引延迟**：不是即时的，可能要几小时～一天。
4. **禁止在 UI/README 用 emoji**（硬规则）。视觉用几何符号（`◢`）。
5. **不要与 pi-session-bookmarks / pi-session-librarian 的 `/bookmark` 混淆**：
   README/llms 的"防混淆"段落是 GEO 差异化卖点，不要删。
6. **版本号语义**：`0.1.x` patch 就是"每小改一版"；`0.2.0` 留给功能级变更。
7. `.npmignore`：`docs/`、`assets/src/`、`assets/_frames/` 不进 tarball。`files` 白名单已含 CHANGELOG。
8. **pi.dev catalog 搜索 ≠ 详情页存在**。详情页 URL 直接可开，但 `?name=bookmark` 只命中 description/name 里出现该词干的包。`/bookmarks` 不够，必须有独立单词 `bookmark`。Downloads "not available" 的新包也可能被搜不出来，发布后要复查。
9. **不要给 npm keywords 加 `plugin`**。FAQ 覆盖即可。

---

## 5. 操作备忘

### 5.1 重新生成视觉资产（Chrome headless，无需本地 server）

```bash
# cover
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --window-size=1600,900 --hide-scrollbars \
  --screenshot=/Users/brandon/workspace/pi/pi-bookmark/assets/cover.png \
  "file:///Users/brandon/workspace/pi/pi-bookmark/assets/src/cover.html"

# demo frames (demo.html?frame=N 会渲染第 N 帧)
for i in 0 1 2 3 4 5 6 7; do
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless --disable-gpu --window-size=1080,640 --hide-scrollbars \
    --virtual-time-budget=1500 \
    --screenshot=".../assets/_frames/frame-$(printf '%02d' $i).png" \
    "file:///.../assets/src/demo.html?frame=$i"
done

# GIF/MP4（在 _frames 里，用 seq-*.png 拼接后 ffmpeg palette 生成）
```

### 5.2 GEO 自查流程（每次改完 README 后跑）

```bash
# 1) 事实一致性
grep -c "pi install npm:pi-bookmark" README.md llms.txt   # 应 ≥1 各文件

# 2) 命令清单一致性（README 表格 vs extensions/index.ts registerCommand）
rg 'registerCommand\("' extensions/index.ts
rg -n '/pin|/unpin|/bookmarks' README.md

# 3) npm 视角
npm view pi-bookmark description keywords --json

# 4) 外部可见性（需能联网）
curl -s https://pi.dev/packages/pi-bookmark | grep -o 'pi-bookmark' | head -1

# 5) 模拟 agent 提取（用 web_search 问自己这些问题）：
#  - "How do I bookmark a session in pi coding agent?"
#  - "pi bookmark session npm package"
#  - "pi /pin /unpin /bookmarks"
# 记录是否命中；命中则 README 该段保留，未命中则调整段落句首用词。
```

### 5.3 发布三步曲

```bash
cd /Users/brandon/workspace/pi/pi-bookmark
python3 -c "import json;p=json.load(open('package.json'));p['version']='0.1.4';json.dump(p,open('package.json','w'),indent=2);open('package.json','a').write('\\n')"
git add -A && git commit -m "0.1.4: ..." && git push
npm publish    # OTP 就交互输入
```

---

## 6. 关键链接

- 仓库: https://github.com/vaultboy001/pi-bookmark
- npm: https://www.npmjs.com/package/pi-bookmark
- 画廊: https://pi.dev/packages/pi-bookmark
- Pi packages 文档: https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/packages.md
- 竞品/对比对象: pisesh (0.3.0) / pi-session-bookmarks (0.1.1) / pi-session-librarian (0.2.4)
- 参考对照（top 下载）: pi-mcp-adapter 628K/mo, pi-web-access 384K/mo, pi-subagents 341K/mo

## 7. 完成后回报格式（给下下任 agent）

```
- 本阶段做了什么（P0/P1/P2 编号）
- npm latest 版本号 + pi.dev 是否已显示新内容
- web_search 自查的结果（5 个查询命中情况）
- 未完成项（留给下一任）
- 对本 handoff 的修订建议（若有）
```

### Round 2026-08-28 (v1.1)

- 做了：P0-1 FAQ，P0-2 badges，P0-3 画廊验证，P0-4 bump 0.1.4，P1-1 CHANGELOG + GitHub homepage/topics，P1-3 description 含 bookmark，P1-5 `v0.1.4` release，P2-2 `docs/overview.md`
- GitHub `main@0.1.4` + https://github.com/vaultboy001/pi-bookmark/releases/tag/v0.1.4
- **npm 仍是 0.1.3**：`npm publish` 因 token 过期返回 404/401。下一任先 `npm whoami`，再 `cd pi-bookmark && npm publish`
- pi.dev 详情页已挂 image+video+0.1.3 description；catalog `?name=bookmark` 只出 pisesh / pi-session-librarian（npm description 无 bookmark 是主因；publish 0.1.4 后复查）
- web_search 5 问 **全部未命中 pi-bookmark**（命中 pi-session-bookmarks / pisesh / librarian / 官方 bookmark.ts）。外部引用（P1-2）是下一任最高杠杆。草稿在 `docs/community-drafts.md`，未发。
- 未完成：npm publish 0.1.4，P1-2 发帖，P1-4 GitHub social preview（需人手上传 `assets/cover.png`），P2-1 JSON-LD HTML，P2-3 发布后再搜一次，P3 双语
- 修订：§4 增加 catalog 搜索陷阱；不要劫持 pisesh discussion #5244
