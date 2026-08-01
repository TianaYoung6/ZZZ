'use strict';

// ── Tab 切换（驱动多页面显示）─────────────────────
const page   = document.querySelector('.page');
const tabs   = document.querySelectorAll('.tab-item');
const views  = document.querySelectorAll('.page-view');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.page;

    // 更新 tab 激活状态
    tabs.forEach(t => t.classList.remove('tab-item--active'));
    tab.classList.add('tab-item--active');

    // 切换页面：先全部隐藏，再显示目标页
    views.forEach(v => (v.style.display = 'none'));
    const targetView = document.getElementById('page-' + target);
    if (targetView) targetView.style.display = 'block';

    // 切换背景主题（数据属性驱动 CSS）
    page.dataset.active = target;
  });
});

// ── 换一换 ────────────────────────────────────────
const suggestions = [
  ['😄 告诉小思你的名字吧', '🤔 如果 AI 模仿你的风格写作文'],
  ['📚 今天有什么不懂的题？', '🎯 帮我制定学习计划'],
  ['✏️ 帮我批改这篇作文', '🔢 来一套口算练习'],
  ['🌍 翻译一段英文给我', '📖 推荐一本适合我的书'],
];
let idx = 0;
document.getElementById('refreshBtn').addEventListener('click', () => {
  idx = (idx + 1) % suggestions.length;
  const items = document.querySelectorAll('#suggList .list-text');
  items.forEach((el, i) => { if (suggestions[idx][i]) el.textContent = suggestions[idx][i]; });
});

// ── 输入框占位符 ──────────────────────────────────
const field = document.getElementById('inputField');
const ph    = document.getElementById('inputPh');

field.addEventListener('focus', () => { ph.style.display = 'none'; });
field.addEventListener('blur',  () => {
  if (!field.textContent.trim()) ph.style.display = '';
});
field.addEventListener('input', () => {
  ph.style.display = field.textContent.trim() ? 'none' : '';
});

// ── 公共：填入输入框并移动光标到末尾 ────────────────
function fillInput(text) {
  field.textContent = text;
  ph.style.display = 'none';
  field.focus();
  const range = document.createRange();
  const sel   = window.getSelection();
  range.selectNodeContents(field);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
}

// ── Banner 点击（与列表项交互一致）───────────────────
document.querySelector('.banner-card').addEventListener('click', () => {
  const text = document.querySelector('.banner-title').textContent.trim();
  fillInput(text);
});

// ── 标签 → 填入输入框 ─────────────────────────────
document.querySelectorAll('.tag-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    fillInput(btn.querySelector('span:not(.hot-badge)').textContent.trim());
  });
});

// ── 建议列表点击 ──────────────────────────────────
document.querySelectorAll('.list-item').forEach(item => {
  item.addEventListener('click', () => {
    fillInput(item.querySelector('.list-text').textContent.trim());
  });
});

// ── 练习页：学科标签切换 (prac-tab) ────────────────
document.querySelectorAll('.prac-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.prac-tab').forEach(t => t.classList.remove('prac-tab-active'));
    tab.classList.add('prac-tab-active');
  });
});

// ── 练习页：试卷筛选标签 (prac-tag) ─────────────────
document.querySelectorAll('.prac-tag').forEach(tag => {
  tag.addEventListener('click', () => {
    tag.closest('.prac-exam-tags').querySelectorAll('.prac-tag').forEach(t => t.classList.remove('prac-tag-active'));
    tag.classList.add('prac-tag-active');
  });
});
