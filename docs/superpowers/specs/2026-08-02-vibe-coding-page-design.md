# Vibe Coding 独立页 设计方案

日期：2026-08-02
关联画板：`vibecodingZPJ.pen` → `new-Ai-Vibecoding` (id `snrqz`)，`new-首页` (id `x2e78k`)

## 目标

把旧版 `旧版本/Ai赋能篇.html` 中的 Vibe Coding Tab 抽取为独立单页 `Vibe Coding.html`，资源指向 `assets/Ai技能/Vibe Coding/`，并参考 `new-Ai-Vibecoding` 画板新增若干滚动揭示交互。同时在 `index.html` 把 "5-1" 图片（`assets/首页/6-1.png`）接成点击后在新标签打开 `Vibe Coding.html`。

## 背景

- 旧 `Ai赋能篇.html`（1006 行，单文件含 inline CSS/JS）有 3 个 Tab：Vibe Coding / Ai内容生产 / Ai赛事自驱。本方案只取 Vibe Coding Tab + 共用外壳（sticky header 标题「01 Ai赋能篇」、回到顶部按钮）。
- 新项目 `assets/Ai技能/Vibe Coding/` 已就位：VibeCoding1-7.png、Antigravity/ClaudeCode/Codex.png、`手写笔.png`、`h5/`（完整内嵌 H5）。
- 新项目根目录无 FZ 字体文件；`fonts.css` 只定义 SourceHanSansCN。旧页标题字 FZHanZhenGuangBiaoS-GB 需 `FZHZGBJW.TTF`（在 `旧版本/`）。
- `new-Ai-Vibecoding` 画板相对旧 Vibe Coding Tab 新增元素：400px 深色模糊条、手写笔+字迹图、难点讨论卡（600×749，5 行图+分割线）、zV5Jg 图、横向 6 图+箭头流程行。

## 交付物

### 1. `Vibe Coding.html`（项目根目录，独立单页）

**外壳**：sticky header（标题「01 Ai赋能篇」+ 3 个 Tab 按钮，Vibe Coding 高亮，其余两个作视觉占位、暂不跳转）+ 回到顶部按钮。保留旧版的 sticky-header 滚动出现、回到顶部、H5 iframe 等比缩放逻辑。

**页面区段**（自上而下，对应画板 y 坐标）：
1. Hero：VibeCoding1.png + nav overlay（标题+Tab 按钮）+ 3 个 logo（Antigravity/ClaudeCode/Codex）
2. VibeCoding2.png + H5 iframe 容器（右上圆角，517×720，对应画板 `L09ITB`）
3. **深色模糊条**（画板 `ILaWu`，1600×400，`#000000cc` + backdrop-blur 17.5）— 静态视觉，替换旧版 100px fade
4. VibeCoding3.png + **手写笔迹叠层**（画板 `q71U1t` 732×680 手+笔图 = `手写笔.png`；`m9jYH` 340×70 字迹图）
5. VibeCoding4.png + **难点讨论卡叠层**（画板 `T45exx` 600×749，含「难点讨论」标题 + 5 行 480×82 图 + 第 2 项后渐变分割线）
6. **zV5Jg 图**（876×230）
7. **横向 6 图+箭头流程行**（画板 `Jyeju`，6 张 ~200×102 图，箭头连接）
8. VibeCoding5 / 6 / 7.png 依次堆叠

**路径改写**（全局替换）：
- `01 Ai赋能篇/VibeCoding/` → `assets/Ai技能/Vibe Coding/`
- `01 Ai赋能篇/h5/` → `assets/Ai技能/Vibe Coding/h5/`
- 字体 `@font-face` 指向根目录 `FZHZGBJW.TTF`（从 `旧版本/` 拷贝过来）

### 2. `index.html` 5-1 接线

- "5-1" = `assets/首页/6-1.png`（`5.png` 标题下 `stack-3` 第一张）。
- 把该 `.img-frame` 包成 `<a href="Vibe Coding.html" target="_blank" rel="noopener">`。
- **保留** `zoomable` 的 hover 放大（`style.css:34-41`，hover scale 1.05），与新标签跳转共存。6-2/6-3 不变。

## 交互设计

通用规则：**滚动进入视口时逐步揭示；只播一次；不循环；刷新可重播；尊重 `prefers-reduced-motion`（降级为直接显示）**。
实现统一用 **IntersectionObserver + CSS transition / clip-path，无外部依赖**。每个元素揭示后 `unobserve` 锁定，不再回缩/重播。

### 交互 A — 手写笔迹（VibeCoding3 区）

- 手+笔图（`手写笔.png`）沿水平方向从左到右平移。
- 同步用 `clip-path: inset()` 从左到右揭示字迹图（`m9jYH`），模拟"笔尖写出字迹"。
- 进入视口触发一次，揭示完锁定。

### 交互 B — 难点讨论卡 + 后续左→右揭示（y≈3825 起）

- 卡片底图固定（不随揭示动）。
- 5 行图 + 第 2 项后分割线：随滚动从上至下逐条揭示（opacity + translateY，错峰）。
- 滚到下方：`zV5Jg` 图揭示。
- 再下方：横向 6 图+箭头流程行，从左到右逐张揭示。
- 整段按滚动进度推进，揭示后锁定不回缩。

## 资源获取

- 已在 `assets/Ai技能/Vibe Coding/` 的直接引用（VibeCoding1-7、3 logo、`手写笔.png`、`h5/`）。
- 画板中**新增叠层**的图片资源（字迹图 `m9jYH`、难点讨论卡底图 `T45exx`、5 行图 `zsr5R/Y1yW1/yOW93/m486a/gGMeK`、`zV5Jg`、流程行 6 图 `jI0HX/GF9ys/BoWOD/k9B9x/m3kPD/w8TFS`）若不存在于 assets，则用 Pencil `export_nodes` 从 `new-Ai-Vibecoding` 画板导出 PNG 到 `assets/Ai技能/Vibe Coding/` 后引用。
- `FZHZGBJW.TTF` 从 `旧版本/` 拷贝到项目根目录。

## 不在范围内

- 另外两个 Tab（Ai内容生产 / Ai赛事自驱）的独立页及其资源迁移。
- `index.html` 首页其余区段改造（仅改 5-1 接线）。
- 3D 卡片轮播、WeChat H5 等 Ai赛事自驱专属交互（属其他 Tab）。

## 假设 / 待实现时确认

- 独立页顶部 nav 的另两个 Tab 按钮：视觉占位，暂 `href="#"` 或不绑事件（待另两个独立页存在后再接）。
- 新增叠层的精确 `%` 定位（相对其所在 VibeCoding 区段）在实现计划阶段按画板坐标换算。
