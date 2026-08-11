/* ═══════════════════════════════════════════════════════════
   sticky-tabs.js
   Tab 导航 + 滑动吸顶 + 回到顶部 组件逻辑

   用法：在页面引入本 JS + sticky-tabs.css，并按 sticky-tabs.html
   模板放置 .st-header / .st-tab / .st-pane / .st-back-top 即可，
   无需手写配置——tab 列表自动从 DOM 读取。

   可选 data 属性：
     .st-header  data-show-at="<px>"  滚过多少 px 后吸顶条显现
                                       （缺省 = 视口宽 * 260/1600）
   ═══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var PANES = Array.prototype.slice.call(document.querySelectorAll('.st-pane[data-pane]'));
  var TABS = Array.prototype.slice.call(document.querySelectorAll('.st-tab[data-tab]'));
  var VALID = TABS.map(function (t) { return t.dataset.tab; })
    .filter(function (v, i, a) { return a.indexOf(v) === i; });

  var header = document.querySelector('.st-header');
  var backTop = document.querySelector('.st-back-top');
  var hasPaneMode = TABS.length > 0 && PANES.length > 0;
  var alwaysVisible = !!(header && header.hasAttribute('data-always'));

  /* ── pane 模式：tab 切换 + hash 同步（仅当页面含 .st-tab[data-tab] + .st-pane） ── */
  function setActiveTab(tab, scrollToTop) {
    PANES.forEach(function (p) { p.hidden = (p.dataset.pane !== tab); });
    TABS.forEach(function (b) {
      var on = b.dataset.tab === tab;
      b.classList.toggle('is-active', on);
      if (on) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    if (scrollToTop) window.scrollTo({ top: 0, behavior: 'auto' });
    if (location.hash !== '#' + tab) history.replaceState(null, '', '#' + tab);
    // 通知页面（如 iframe 自适应），与 Vibe Coding 行为一致
    window.dispatchEvent(new Event('resize'));
    window.dispatchEvent(new CustomEvent('st:tabchange', { detail: { tab: tab } }));
  }

  if (hasPaneMode) {
    TABS.forEach(function (b) {
      b.addEventListener('click', function () { setActiveTab(b.dataset.tab, true); });
    });

    /* ── 初始化：从 hash 选 tab ── */
    (function initFromHash() {
      var h = location.hash.slice(1);
      var fallback = VALID[0] || '';
      setActiveTab(VALID.indexOf(h) > -1 ? h : fallback, false);
    })();
  }

  /* ── 链接模式：当前页按钮自动高亮（按钮为 <a href> 跨页跳转时） ── */
  var here = decodeURIComponent(location.pathname.split('/').pop() || 'index.html').toLowerCase();
  Array.prototype.forEach.call(
    document.querySelectorAll('.st-tabs > a.st-tab[href]'),
    function (a) {
      var target = (a.getAttribute('href') || '').split('#')[0].toLowerCase();
      if (target && target === here) {
        a.classList.add('is-active');
        a.setAttribute('aria-current', 'page');
      }
    }
  );

  /* ── 吸顶条 + 回到顶部：滚动显现 ── */
  function showAt() {
    if (header && header.dataset.showAt) {
      return parseFloat(header.dataset.showAt);
    }
    return window.innerWidth * (260 / 1600);
  }

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-visible', alwaysVisible || y > showAt());
    if (backTop) backTop.classList.toggle('is-visible', y > window.innerHeight * 0.6);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 暴露给需要外部触发的页面
  window.stickyTabs = { setActiveTab: setActiveTab };
})();
