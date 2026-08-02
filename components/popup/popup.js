/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   Popup 组件 — 可复用弹窗
   基于 vibecodingZPJ.pen「new-可视化弹窗」
   用法：
     Popup.open({ title: '数据可视化', content: htmlStringOrNode })
     Popup.close()
   关闭方式：X 按钮 / 点击遮罩 / Esc
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
(function () {
  const CLOSE_ICON = '<svg viewBox="0 0 14.728 14.728" aria-hidden="true" fill-rule="evenodd"><path d="M13.02126 14.43503c0.39052 0.39052 1.02369 0.39052 1.41421 0 0.39052-0.39053 0.39052-1.02369 0-1.41422l-5.657-5.657 5.65656-5.65655c0.39052-0.39052 0.39052-1.02369 0-1.41422-0.39052-0.39052-1.02369-0.39052-1.41421 0l-5.65656 5.65656-5.65671-5.65671c-0.39052-0.39052-1.02369-0.39052-1.41422 0-0.39052 0.39052-0.39052 1.02369 0 1.41422l5.65671 5.6567-5.65715 5.65716c-0.39052 0.39052-0.39052 1.02369 0 1.41421 0.39052 0.39053 1.02369 0.39052 1.41422 0l5.65715-5.65715 5.657 5.657z"/></svg>';

  let overlay, card, titleEl, contentEl, closeBtn;
  let lastFocused = null;
  let isOpen = false;

  // 懒构建 DOM，首次 open 时注入
  function ensure() {
    if (overlay) return;

    overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-hidden', 'true');

    card = document.createElement('div');
    card.className = 'popup-card';

    const titlebar = document.createElement('div');
    titlebar.className = 'popup-titlebar';

    titleEl = document.createElement('h2');
    titleEl.className = 'popup-title';

    closeBtn = document.createElement('button');
    closeBtn.className = 'popup-close';
    closeBtn.type = 'button';
    closeBtn.setAttribute('aria-label', '关闭');
    closeBtn.innerHTML = CLOSE_ICON;

    titlebar.appendChild(titleEl);
    titlebar.appendChild(closeBtn);

    contentEl = document.createElement('div');
    contentEl.className = 'popup-content';

    card.appendChild(titlebar);
    card.appendChild(contentEl);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    // 点击遮罩（卡片之外）关闭
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) Popup.close();
    });
    closeBtn.addEventListener('click', Popup.close);
    // Esc 关闭
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) Popup.close();
    });
  }

  function open(opts) {
    ensure();
    const { title = '', content } = opts || {};

    titleEl.textContent = title;
    titleEl.style.display = title ? '' : 'none';

    contentEl.innerHTML = '';
    if (typeof content === 'string') contentEl.innerHTML = content;
    else if (content instanceof Node) contentEl.appendChild(content);

    lastFocused = document.activeElement;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('popup-lock');
    isOpen = true;

    requestAnimationFrame(() => closeBtn.focus());
  }

  function close() {
    if (!overlay || !isOpen) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('popup-lock');
    isOpen = false;
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  window.Popup = {
    open,
    close,
    get isOpen() { return isOpen; },
    get body() { ensure(); return contentEl; },
  };
})();
