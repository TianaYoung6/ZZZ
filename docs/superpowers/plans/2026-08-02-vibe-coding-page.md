# Vibe Coding 独立页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build standalone `Vibe Coding.html` (extracted from old Ai赋能篇.html's Vibe Coding tab), wire `index.html`'s 6-1.png to open it in a new tab, and add two scroll-reveal interactions per the `new-Ai-Vibecoding` Pencil artboard.

**Architecture:** Single self-contained HTML file (`Vibe Coding.html`, inline `<style>`/`<script>`, matching the old Ai赋能篇.html pattern). Full-width VibeCoding1-7 PNGs as the base scroll; new overlay elements (handwriting, 难点讨论 card, flow row) positioned absolutely with %-based responsive coords computed from the artboard. Interactions use IntersectionObserver + CSS clip-path/transition, once-only via `unobserve`, `prefers-reduced-motion` fallback. index.html gets one additive anchor and nothing else.

**Tech Stack:** Vanilla HTML/CSS/JS (no build, no deps). Pencil MCP `export_nodes` for overlay image assets. Static server (`python3 -m http.server`) for browser verification.

**Spec:** `docs/superpowers/specs/2026-08-02-vibe-coding-page-design.md`

**Verification note:** This static site has no test framework. Each task's "verify" step starts a static server and checks behavior in the browser. That IS the test — do not skip it.

**Artboard coords (computed from `new-Ai-Vibecoding` / `snrqz`, 1600-wide canvas):**
- VibeCoding1 `kccIN`: y=0 h=800
- VibeCoding2 `tI0De`: y=904 h=880
- H5 iframe `L09ITB`: x=1100 y=1076 w=517 h=720 → within VC2: top=172/880, left=1100/160, w=517/1600, h=720/880
- Dark blur band `ILaWu`: y=1784 h=400 (standalone, between VC2 and VC3)
- VibeCoding3 `khASq`: y=1958 h=1182
- 字迹 `m9jYH`: x=828 y=2494 w=340.5 h=70.5 → within VC3: top=536/1182, left=828/1600, w=340.5/1600, h=70.5/1182
- 手写笔 `q71U1t`: x=1077 y=2288 w=732 h=680 → within VC3: top=330/1182, left=1077/1600, w=732/1600, h=680/1182
- VibeCoding4 `lRhAA`: y=3200 h=1374
- 难点讨论卡 `T45exx`: x=903 y=3825 w=600 h=749 → within VC4: top=625/1374, left=903/1600, w=600/1600, h=749/1374
  - list rows `GHu5h`: 5 rows 480×82 (zsr5R,Y1yW1,yOW93,m486a,gGMeK), gap 40, padding 30; divider `Z6Ciu` after row 2
- zV5Jg: x=422 y=4612 w=876.5 h=230.5 (standalone, after VC4)
- flow row `Jyeju`: x=52 y=4938, 6 imgs (~200×102) + 5 arrow paths, gap 24 (standalone, before VC5)
- VibeCoding5 `fzB3Q`: y=4991 h=743
- VibeCoding6 `BR4sP`: y=5799 h=672
- VibeCoding7 `w01v7c`: y=6477 h=1834

---

### Task 1: Asset preparation (font + overlay image exports)

**Files:**
- Create: `FZHZGBJW.TTF` (root, copied from `旧版本/FZHZGBJW.TTF`)
- Create: `assets/Ai技能/Vibe Coding/字迹.png`
- Create: `assets/Ai技能/Vibe Coding/手写笔.png` (already exists — verify)
- Create: `assets/Ai技能/Vibe Coding/难点讨论-底图.png`
- Create: `assets/Ai技能/Vibe Coding/难点-1.png` … `难点-5.png`
- Create: `assets/Ai技能/Vibe Coding/zV5Jg.png`
- Create: `assets/Ai技能/Vibe Coding/流程-1.png` … `流程-6.png`

- [ ] **Step 1: Copy the FZ font to root**

Run:
```bash
cp "旧版本/FZHZGBJW.TTF" "FZHZGBJW.TTF" && ls -la FZHZGBJW.TTF
```
Expected: file listed, ~372KB.

- [ ] **Step 2: Re-verify overlay node IDs still exist in the .pen doc**

The Pencil doc can shift. Confirm before exporting via `mcp__pencil__batch_get` with `nodeIds`: `["m9jYH","q71U1t","T45exx","zsr5R","Y1yW1","yOW93","m486a","gGMeK","zV5Jg","jI0HX","GF9ys","BoWOD","k9B9x","m3kPD","w8TFS"]`, `readDepth: 1`. If any ID is missing, re-read its parent (`snrqz`) to find the current ID and use that below.

- [ ] **Step 3: Export the 字迹 image (m9jYH)**

Use `mcp__pencil__export_nodes` with `filePath: "/Users/tal/Desktop/AAA/ZZZ/vibecodingZPJ.pen"`, `outputDir: "/Users/tal/Desktop/AAA/ZZZ/assets/Ai技能/Vibe Coding"`, `nodeIds: ["m9jYH"]`, `format: "png"`. Then rename:
```bash
mv "assets/Ai技能/Vibe Coding/m9jYH.png" "assets/Ai技能/Vibe Coding/字迹.png"
```
(If export keeps the node name as filename, adjust the `mv` source accordingly — the tool returns actual paths.)

- [ ] **Step 4: Export the 5 难点 list rows + rename**

`export_nodes` with `nodeIds: ["zsr5R","Y1yW1","yOW93","m486a","gGMeK"]`, same outputDir. Then rename each to `难点-1.png`…`难点-5.png` (zsr5R→1, Y1yW1→2, yOW93→3, m486a→4, gGMeK→5).

- [ ] **Step 5: Export the 难点讨论 card background (T45exx) WITHOUT its title/list children**

The card's bg is an image fill; the title (`pYfz8`) and list (`GHu5h`) are children on top. To export a clean底图, temporarily disable them, export, re-enable. Three `mcp__pencil__batch_design` calls:

Call 1 (disable children):
```js
Update("T45exx/pYfz8",{enabled:false})
Update("T45exx/GHu5h",{enabled:false})
```
Call 2 (`export_nodes` with `nodeIds: ["T45exx"]`, outputDir as above) → rename result to `难点讨论-底图.png`.
Call 3 (re-enable children):
```js
Update("T45exx/pYfz8",{enabled:true})
Update("T45exx/GHu5h",{enabled:true})
```

- [ ] **Step 6: Export zV5Jg and the 6 flow images + rename**

`export_nodes` with `nodeIds: ["zV5Jg"]` → `zV5Jg.png`.
`export_nodes` with `nodeIds: ["jI0HX","GF9ys","BoWOD","k9B9x","m3kPD","w8TFS"]` → rename to `流程-1.png`…`流程-6.png` (jI0HX→1, GF9ys→2, BoWOD→3, k9B9x→4, m3kPD→5, w8TFS→6).

- [ ] **Step 7: Verify all assets present**

Run:
```bash
ls -1 "assets/Ai技能/Vibe Coding/" | grep -E "字迹|手写笔|难点|zV5Jg|流程|VibeCoding[1-7]|Antigravity|ClaudeCode|Codex"
```
Expected: VibeCoding1-7, 3 logos, 手写笔.png, 字迹.png, 难点讨论-底图.png, 难点-1..5.png, zV5Jg.png, 流程-1..6.png all listed.

- [ ] **Step 8: Commit**

```bash
git add FZHZGBJW.TTF "assets/Ai技能/Vibe Coding/"
git commit -m "Add Vibe Coding overlay assets (font, handwriting, 难点讨论, flow row)"
```

---

### Task 2: Scaffold `Vibe Coding.html` base (chrome + full-width sections + h5 iframe + dark blur band)

**Files:**
- Create: `Vibe Coding.html` (root)

- [ ] **Step 1: Create `Vibe Coding.html` with head + base styles**

Write `Vibe Coding.html`. The reusable chrome styles (sticky header, nav-title, tabs, back-top, h5-container, section-gap) come from `旧版本/Ai赋能篇.html` lines 8-571 — copy those `<style>` blocks verbatim, then apply the edits in Step 2. Start the file:

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Vibe Coding</title>
  <style>
    @font-face {
      font-family: 'FZHanZhenGuangBiaoS-GB';
      src: url('FZHZGBJW.TTF') format('truetype');
      font-weight: normal; font-style: normal; font-display: swap;
    }
    *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
    html, body { background:#01020d; color:#fff; font-family:'PingFang SC',-apple-system,'Helvetica Neue',Arial,sans-serif; overflow-x:hidden; }

    /* sticky header, nav-title, tabs-row, tab-btn, section-hero, nav-overlay,
       logos-overlay, section-gap, section-2, h5-container, section-img,
       back-top — copied verbatim from 旧版本/Ai赋能篇.html lines 39-571 */

    /* NEW: dark blur band (replaces old 100px .section2-fade) */
    .section-blur-band {
      height: calc(400 / 1600 * 100vw);
      background: rgba(0,0,0,0.8);
      backdrop-filter: blur(17.5px);
      -webkit-backdrop-filter: blur(17.5px);
    }

    /* NEW: overlay wrappers (added in Task 3; placeholder rules here) */
    .vc-wrap { position: relative; width: 100%; }
    .vc-wrap .bg { width: 100%; display: block; }
  </style>
</head>
```

- [ ] **Step 2: Apply path/style edits to the copied chrome**

In the copied styles, make these exact changes:
1. `.section2-fade` rule (旧版本 line ~284) — delete it (replaced by `.section-blur-band`).
2. Keep `.h5-container` `top: calc(168 / 880 * 100%)` (close enough to artboard's 172; leave as-is to match old).

- [ ] **Step 3: Write the body — chrome + full-width sections**

Append to the body (after `<body>`):

```html
  <!-- STICKY HEADER (Frame 94) -->
  <header id="sticky-header">
    <div class="nav-title">
      <span>01</span>
      <span class="nav-title-name">Ai赋能篇</span>
    </div>
    <nav class="tabs-row" aria-label="主导航">
      <button class="tab-btn active" data-tab="0">Vibe Coding</button>
      <button class="tab-btn" data-tab="1">Ai内容生产</button>
      <button class="tab-btn" data-tab="2">Ai赛事自驱</button>
    </nav>
  </header>

  <!-- BACK TO TOP -->
  <button id="back-top" title="回到顶部" aria-label="回到顶部">
    <svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15" />
    </svg>
  </button>

  <!-- SECTION 1: VibeCoding1 hero -->
  <section class="section-hero">
    <img class="bg" src="assets/Ai技能/Vibe Coding/VibeCoding1.png" alt="Vibe Coding Hero" draggable="false">
    <div class="nav-overlay" id="nav-overlay">
      <div class="nav-title">
        <span>01</span>
        <span class="nav-title-name">Ai赋能篇</span>
      </div>
      <nav class="tabs-row" aria-label="内容分类">
        <button class="tab-btn active" data-tab="0">Vibe Coding</button>
        <button class="tab-btn" data-tab="1">Ai内容生产</button>
        <button class="tab-btn" data-tab="2">Ai赛事自驱</button>
      </nav>
    </div>
    <div class="logos-overlay" aria-hidden="true">
      <img src="assets/Ai技能/Vibe Coding/Antigravity.png" alt="Antigravity">
      <img src="assets/Ai技能/Vibe Coding/ClaudeCode.png" alt="Claude Code">
      <img src="assets/Ai技能/Vibe Coding/Codex.png" alt="Codex">
    </div>
  </section>

  <div class="section-gap"></div>

  <!-- SECTION 2: VibeCoding2 + H5 iframe -->
  <section class="section-2" id="section-2">
    <img class="bg" src="assets/Ai技能/Vibe Coding/VibeCoding2.png" alt="" draggable="false">
    <div class="h5-container" id="h5-container">
      <iframe id="h5-iframe" src="assets/Ai技能/Vibe Coding/h5/index.html" title="内嵌 H5 展示" allowfullscreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
        sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups"></iframe>
    </div>
  </section>

  <!-- NEW: dark blur band (ILaWu, 400px) -->
  <div class="section-blur-band"></div>

  <!-- VC3 + VC4 overlays added in Task 3 -->

  <!-- VibeCoding3 -->
  <div class="vc-wrap" id="vc3">
    <img class="bg" src="assets/Ai技能/Vibe Coding/VibeCoding3.png" alt="" draggable="false">
  </div>

  <!-- VibeCoding4 -->
  <div class="vc-wrap" id="vc4">
    <img class="bg" src="assets/Ai技能/Vibe Coding/VibeCoding4.png" alt="" draggable="false">
  </div>

  <!-- zV5Jg + flow row added in Task 3 -->

  <!-- VibeCoding5/6/7 -->
  <img class="section-img" src="assets/Ai技能/Vibe Coding/VibeCoding5.png" alt="" draggable="false">
  <img class="section-img" src="assets/Ai技能/Vibe Coding/VibeCoding6.png" alt="" draggable="false">
  <img class="section-img" src="assets/Ai技能/Vibe Coding/VibeCoding7.png" alt="" draggable="false">
```

- [ ] **Step 4: Write the base `<script>` (sticky header, back-top, h5 scale — no interactions yet)**

Append before `</body>`:

```html
  <script>
    /* STICKY HEADER + BACK-TOP (copied from 旧版本/Ai赋能篇.html lines 841-860) */
    const stickyHeader = document.getElementById('sticky-header');
    const backTop = document.getElementById('back-top');
    function navThreshold() { return window.innerWidth * (260 / 1600); }
    function onScroll() {
      const scrollY = window.scrollY;
      stickyHeader.classList.toggle('visible', scrollY > navThreshold());
      backTop.classList.toggle('visible', scrollY > window.innerHeight * 0.6);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    /* H5 IFRAME scale-to-fit (copied from 旧版本 lines 865-897) */
    const iframe = document.getElementById('h5-iframe');
    const h5Container = document.getElementById('h5-container');
    const H5_W = 375, H5_H = 812;
    function scaleH5() {
      if (!h5Container || !iframe) return;
      const cW = h5Container.clientWidth, cH = h5Container.clientHeight;
      if (cW === 0 || cH === 0) return;
      const scale = Math.min(cW / H5_W, cH / H5_H);
      const offX = (cW - H5_W * scale) / 2;
      iframe.style.width = H5_W + 'px';
      iframe.style.height = H5_H + 'px';
      iframe.style.transform = `translateX(${offX}px) scale(${scale})`;
      iframe.style.transformOrigin = 'top left';
    }
    if (window.ResizeObserver) { new ResizeObserver(scaleH5).observe(h5Container); }
    window.addEventListener('resize', scaleH5, { passive: true });
    window.addEventListener('load', scaleH5);
    /* NOTE: Tab switching intentionally NOT wired — standalone page, tabs are visual placeholders. */
  </script>
</body>
</html>
```

- [ ] **Step 5: Verify in browser**

```bash
python3 -m http.server 8765 &  # from project root
```
Open `http://localhost:8765/Vibe%20Coding.html`. Confirm: VibeCoding1-7 stack, hero nav + 3 logos show, H5 iframe scales into the rounded container, dark blur band (400px) sits between VC2 and VC3, sticky header appears on scroll, back-top works. Images load (no 404). Fix any broken path.

- [ ] **Step 6: Commit**

```bash
git add "Vibe Coding.html"
git commit -m "Scaffold standalone Vibe Coding.html (chrome, sections, h5, blur band)"
```

---

### Task 3: Add overlay elements (static, positioned)

**Files:**
- Modify: `Vibe Coding.html` (CSS + HTML inside #vc3, #vc4, and between them)

- [ ] **Step 1: Add overlay CSS**

In the `<style>` block, before the closing `</style>`, add:

```css
    /* ── VC3 overlays: handwriting + pen ── */
    .handwriting {
      position: absolute;
      top: calc(536 / 1182 * 100%);
      left: calc(828 / 1600 * 100%);
      width: calc(340.5 / 1600 * 100%);
      height: calc(70.5 / 1182 * 100%);
      object-fit: contain;
      clip-path: inset(0 100% 0 0);   /* hidden until revealed (Task 4) */
    }
    .hand-pen {
      position: absolute;
      top: calc(330 / 1182 * 100%);
      left: calc(1077 / 1600 * 100%);
      width: calc(732 / 1600 * 100%);
      height: calc(680 / 1182 * 100%);
      object-fit: contain;
      transform: translateX(-30%);    /* start offset (Task 4 drives it) */
    }

    /* ── VC4 overlay: 难点讨论 card ── */
    .discuss-card {
      position: absolute;
      top: calc(625 / 1374 * 100%);
      left: calc(903 / 1600 * 100%);
      width: calc(600 / 1600 * 100%);
      height: calc(749 / 1374 * 100%);
    }
    .discuss-card .discuss-bg {
      position: absolute; inset: 0; width: 100%; height: 100%; object-fit: fill;
    }
    .discuss-card .discuss-title {
      position: absolute; top: 4%; left: 8%;
      font-family: 'FZHanZhenGuangBiaoS-GB', serif;
      font-size: clamp(14px, 1.875vw, 30px);
      letter-spacing: 3px; color: #fff; z-index: 2;
    }
    .discuss-list {
      position: absolute; top: 16%; left: 8%; right: 8%; bottom: 6%;
      display: flex; flex-direction: column; justify-content: flex-start;
      gap: calc(40 / 749 * 100%); z-index: 2;
    }
    .discuss-row { width: 100%; height: auto; display: block; opacity: 0; transform: translateY(20px); }
    .discuss-row.revealed { opacity: 1; transform: none; transition: opacity .5s ease, transform .5s ease; }
    .discuss-divider {
      width: 100%; height: 1px; margin: calc(40 / 749 * 100%) 0;
      background: linear-gradient(90deg, #000, #fff 50%, #000);
      opacity: 0; transform: scaleX(0); transform-origin: left;
    }
    .discuss-divider.revealed { opacity: 1; transform: none; transition: opacity .5s ease, transform .5s ease; }

    /* ── standalone zV5Jg + flow row ── */
    .standalone-img { width: 100%; display: block; }
    .flow-row {
      display: flex; align-items: center; justify-content: center;
      gap: calc(24 / 1600 * 100vw);
      padding: calc(40 / 1600 * 100vw) calc(52 / 160 * 100%);
      background: #01020d;
    }
    .flow-item {
      width: calc(200 / 1600 * 100%);
      height: auto; display: block;
      opacity: 0; transform: translateX(20px);
    }
    .flow-item.revealed { opacity: 1; transform: none; transition: opacity .5s ease, transform .5s ease; }
    .flow-arrow {
      flex: 0 0 auto; width: calc(20 / 1600 * 100%); height: 2px;
      background: #ddeaff; position: relative;
      opacity: 0; transition: opacity .4s ease;
    }
    .flow-arrow.revealed { opacity: 1; }
    .flow-arrow::after {
      content: ''; position: absolute; right: -1px; top: 50%;
      width: 8px; height: 8px; border-top: 2px solid #ddeaff; border-right: 2px solid #ddeaff;
      transform: translateY(-50%) rotate(45deg);
    }
```

- [ ] **Step 2: Insert VC3 overlay HTML inside `#vc3`**

Replace the `#vc3` block with:

```html
  <div class="vc-wrap" id="vc3">
    <img class="bg" src="assets/Ai技能/Vibe Coding/VibeCoding3.png" alt="" draggable="false">
    <img class="handwriting" id="handwriting" src="assets/Ai技能/Vibe Coding/字迹.png" alt="" draggable="false">
    <img class="hand-pen" id="handPen" src="assets/Ai技能/Vibe Coding/手写笔.png" alt="" draggable="false">
  </div>
```

- [ ] **Step 3: Insert VC4 overlay HTML inside `#vc4`**

Replace the `#vc4` block with:

```html
  <div class="vc-wrap" id="vc4">
    <img class="bg" src="assets/Ai技能/Vibe Coding/VibeCoding4.png" alt="" draggable="false">
    <div class="discuss-card" id="discussCard">
      <img class="discuss-bg" src="assets/Ai技能/Vibe Coding/难点讨论-底图.png" alt="" draggable="false">
      <div class="discuss-title">难点讨论</div>
      <div class="discuss-list" id="discussList">
        <img class="discuss-row" src="assets/Ai技能/Vibe Coding/难点-1.png" alt="" draggable="false">
        <img class="discuss-row" src="assets/Ai技能/Vibe Coding/难点-2.png" alt="" draggable="false">
        <div class="discuss-divider"></div>
        <img class="discuss-row" src="assets/Ai技能/Vibe Coding/难点-3.png" alt="" draggable="false">
        <img class="discuss-row" src="assets/Ai技能/Vibe Coding/难点-4.png" alt="" draggable="false">
        <img class="discuss-row" src="assets/Ai技能/Vibe Coding/难点-5.png" alt="" draggable="false">
      </div>
    </div>
  </div>
```

- [ ] **Step 4: Insert zV5Jg + flow row HTML between `#vc4` and VibeCoding5**

Replace the `<!-- zV5Jg + flow row added in Task 3 -->` comment with:

```html
  <!-- zV5Jg (centered) -->
  <img class="standalone-img" id="zv5jg"
       src="assets/Ai技能/Vibe Coding/zV5Jg.png" alt="" draggable="false"
       style="width:calc(876.5/1600*100%); margin: auto;">

  <!-- flow row (Jyeju): 6 imgs + 5 arrows -->
  <div class="flow-row" id="flowRow">
    <img class="flow-item" src="assets/Ai技能/Vibe Coding/流程-1.png" alt="" draggable="false">
    <span class="flow-arrow"></span>
    <img class="flow-item" src="assets/Ai技能/Vibe Coding/流程-2.png" alt="" draggable="false">
    <span class="flow-arrow"></span>
    <img class="flow-item" src="assets/Ai技能/Vibe Coding/流程-3.png" alt="" draggable="false">
    <span class="flow-arrow"></span>
    <img class="flow-item" src="assets/Ai技能/Vibe Coding/流程-4.png" alt="" draggable="false">
    <span class="flow-arrow"></span>
    <img class="flow-item" src="assets/Ai技能/Vibe Coding/流程-5.png" alt="" draggable="false">
    <span class="flow-arrow"></span>
    <img class="flow-item" src="assets/Ai技能/Vibe Coding/流程-6.png" alt="" draggable="false">
  </div>
```

- [ ] **Step 5: Verify static layout in browser**

Reload `http://localhost:8765/Vibe%20Coding.html`. Confirm: 字迹 + 手写笔 sit over VC3 at the right spots (字迹 currently hidden by clip-path — that's OK), 难点讨论 card sits over VC4 with底图 + title + 5 rows + divider, zV5Jg centered below VC4, flow row of 6 imgs + 5 arrows below that. Resize the window — overlays stay positioned (%-based). Fix any overflow/position drift.

- [ ] **Step 6: Commit**

```bash
git add "Vibe Coding.html"
git commit -m "Add Vibe Coding overlays: handwriting, 难点讨论 card, zV5Jg, flow row (static)"
```

---

### Task 4: Interaction A — handwriting reveal

**Files:**
- Modify: `Vibe Coding.html` (CSS + JS)

- [ ] **Step 1: Add handwriting animation CSS**

In `<style>`, add:

```css
    @keyframes writeReveal {
      0%   { clip-path: inset(0 100% 0 0); }
      100% { clip-path: inset(0 0 0 0); }
    }
    @keyframes penMove {
      0%   { transform: translateX(-30%); }
      100% { transform: translateX(0%); }
    }
    .handwriting.writing { animation: writeReveal 2.4s cubic-bezier(0.45, 0, 0.55, 1) forwards; }
    .hand-pen.writing    { animation: penMove 2.4s cubic-bezier(0.45, 0, 0.55, 1) forwards; }
    @media (prefers-reduced-motion: reduce) {
      .handwriting { clip-path: inset(0 0 0 0); animation: none; }
      .hand-pen { transform: translateX(0); animation: none; }
    }
```

- [ ] **Step 2: Add JS to trigger once on scroll-in**

In the `<script>` block (before `</script>`), add:

```js
    /* INTERACTION A — handwriting reveal (once) */
    (function () {
      const hw = document.getElementById('handwriting');
      const pen = document.getElementById('handPen');
      const vc3 = document.getElementById('vc3');
      if (!hw || !pen || !vc3) return;
      if (!('IntersectionObserver' in window) ||
          matchMedia('(prefers-reduced-motion: reduce)').matches) {
        hw.classList.add('writing'); pen.classList.add('writing'); return;
      }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            hw.classList.add('writing');
            pen.classList.add('writing');
            io.unobserve(e.target);   // once-only, no loop, replays on refresh
          }
        });
      }, { threshold: 0.35 });
      io.observe(vc3);
    })();
```

- [ ] **Step 3: Verify in browser**

Reload. Scroll to VC3. Confirm: 字迹 reveals left→right while 手写笔 translates left→right in sync (2.4s). Scroll away and back — it does NOT replay (stays revealed). Hard-refresh (Cmd+R) — it replays. In DevTools, emulate `prefers-reduced-motion: reduce` — 字迹 shows fully with no animation.

- [ ] **Step 4: Commit**

```bash
git add "Vibe Coding.html"
git commit -m "Add handwriting scroll-reveal interaction (once-only)"
```

---

### Task 5: Interaction B — 难点讨论 list + zV5Jg + flow row scroll-reveal

**Files:**
- Modify: `Vibe Coding.html` (JS)

- [ ] **Step 1: Add the scroll-reveal JS for the 难点讨论 block**

In the `<script>` block, add:

```js
    /* INTERACTION B — 难点讨论 list (top→bottom), zV5Jg, flow row (left→right).
       Each item reveals as it scrolls into view; once-only. */
    (function () {
      const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const reveal = (el) => el.classList.add('revealed');

      const rows = Array.from(document.querySelectorAll('#discussList .discuss-row, #discussList .discuss-divider'));
      const flowItems = Array.from(document.querySelectorAll('#flowRow .flow-item, #flowRow .flow-arrow'));
      const zv5 = document.getElementById('zv5jg');

      // Reduced motion: show everything immediately.
      if (reduce) {
        rows.forEach(reveal);
        flowItems.forEach(reveal);
        if (zv5) zv5.style.opacity = '1';
        return;
      }

      // One observer per item: reveals top→bottom / left→right as the user scrolls.
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          reveal(e.target);
          io.unobserve(e.target);   // once-only, no loop, replays on refresh
        });
      }, { threshold: 0.5 });

      rows.forEach((r) => io.observe(r));
      flowItems.forEach((f) => io.observe(f));

      if (zv5) {
        zv5.style.opacity = '0';
        zv5.style.transition = 'opacity .5s ease';
        const zio = new IntersectionObserver((entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            zv5.style.opacity = '1';
            zio.unobserve(e.target);
          });
        }, { threshold: 0.4 });
        zio.observe(zv5);
      }
    })();
```

Note: zV5Jg starts at opacity 0 (set by JS) and reveals when scrolled into view. If reduced motion, it shows immediately.

- [ ] **Step 2: Verify in browser**

Reload. Scroll to VC4 / 难点讨论 card. Confirm: 5 rows + divider reveal top→bottom (staggered ~180ms each), then zV5Jg fades in, then flow row 6 imgs + 5 arrows reveal left→right (~160ms each). Scroll away/back — no replay. Hard-refresh — replays. `prefers-reduced-motion` — all visible immediately, no animation.

- [ ] **Step 3: Commit**

```bash
git add "Vibe Coding.html"
git commit -m "Add 难点讨论 + zV5Jg + flow row scroll-reveal (once-only)"
```

---

### Task 6: Wire index.html 5-1 → open Vibe Coding.html in new tab

**Files:**
- Modify: `index.html` (the `6-1.png` `.img-frame`, lines ~96)

- [ ] **Step 1: Wrap 6-1.png's img-frame in an anchor**

In `index.html`, find (around line 96):

```html
          <div class="img-frame"><img class="zoomable" src="assets/首页/6-1.png" alt="" draggable="false"></div>
```

Replace with:

```html
          <a class="img-frame" href="Vibe Coding.html" target="_blank" rel="noopener" aria-label="Vibe Coding">
            <img class="zoomable" src="assets/首页/6-1.png" alt="Vibe Coding" draggable="false">
          </a>
```

(Changing the wrapping `div` to `a` keeps the existing `.img-frame` styling and the `zoomable` hover. 6-2/6-3 are untouched.)

- [ ] **Step 2: Verify `.img-frame` renders identically as an `<a>`**

Reload `http://localhost:8765/` (homepage). Confirm: 6-1 still looks the same as 6-2/6-3 (same size, hover scales 1.05). Hover shows pointer cursor (link). The orbit + marquee still work (script.js untouched).

- [ ] **Step 3: Verify the click opens Vibe Coding.html in a new tab**

Click 6-1. Confirm: a new browser tab opens to `Vibe Coding.html`, landing on the Vibe Coding page (hero + tabs + logos). Click 6-2/6-3 — they do NOT open a new tab (still just hover-zoom, unchanged).

- [ ] **Step 4: Commit**

```bash
git add index.html
git commit -m "Wire homepage 5-1 (6-1.png) to open Vibe Coding.html in a new tab"
```

---

## Self-Review (run after writing — done)

**Spec coverage:** Vibe Coding.html standalone (Task 2-3) ✓; asset path rewiring (Task 2) ✓; FZ font (Task 1) ✓; 5-1 wiring + new tab (Task 6) ✓; handwriting interaction (Task 4) ✓; 难点讨论 + zV5Jg + flow row scroll-reveal (Task 5) ✓; once-only + reduced-motion (Tasks 4-5) ✓; dark blur band static (Task 2) ✓; index.html no other changes (Task 6 only touches 6-1) ✓.
**Placeholders:** none — all steps have concrete code/commands.
**Type/name consistency:** IDs used in JS (`handwriting`, `handPen`, `vc3`, `discussList`, `zv5jg`, `flowRow`) match the HTML `id`s set in Task 3. ✓

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-02-vibe-coding-page.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
