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

  /* ── tab 切换 + hash 同步 ── */
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

  TABS.forEach(function (b) {
    b.addEventListener('click', function () { setActiveTab(b.dataset.tab, true); });
  });

  /* ── 初始化：从 hash 选 tab ── */
  (function initFromHash() {
    var h = location.hash.slice(1);
    var fallback = VALID[0] || '';
    setActiveTab(VALID.indexOf(h) > -1 ? h : fallback, false);
  })();

  /* ── 吸顶条 + 回到顶部：滚动显现 ── */
  function showAt() {
    if (header && header.dataset.showAt) {
      return parseFloat(header.dataset.showAt);
    }
    return window.innerWidth * (260 / 1600);
  }

  function onScroll() {
    var y = window.scrollY;
    if (header) header.classList.toggle('is-visible', y > showAt());
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
