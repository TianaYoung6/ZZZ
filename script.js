/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   首页交互
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ─── 环形轨道标签 ───
   x, y 为标签在 855×855 方盒(=外圈环)内的左上角坐标(相对环左上角)。
   盒内百分比位置：left = x/855*100, top = y/855*100。
   坐标来自 new-首页 设计：Group 855 内环左上 (81,0)，标签组偏移 (0,68)。 */
const ORBIT_TAGS = [
  { text: '多款 Ai产品',         x: -79, y: 287 },
  { text: 'CRM、BI、OA',         x: -63, y: 507 },
  { text: '游戏产品 3D编辑器',    x: -4,  y: 612 },
  { text: '教辅 教研 2D编辑器',   x: 92,  y: 717 },
  { text: '电商 / 会员',          x: -81, y: 397 },
  { text: '学习机 Pad',           x: -15, y: 177 },
  { text: '硬件',                 x: 190, y: 232, inverted: true },
  { text: 'B端',                  x: 146, y: 423, inverted: true },
  { text: 'C端',                  x: 279, y: 137, inverted: true },
  { text: '中台',                 x: 275, y: 614, inverted: true },
  { text: '学习/工具类 APP',       x: 65,  y: 68 },
  { text: 'K12',                  x: 194, y: 518, inverted: true },
  { text: 'OS',                   x: 151, y: 328, inverted: true },
];

function renderOrbit() {
  const root = document.getElementById('orbit-tags');
  if (!root) return;
  const frag = document.createDocumentFragment();
  ORBIT_TAGS.forEach((t, i) => {
    const el = document.createElement('span');
    el.className = 'tag' + (t.inverted ? ' inverted' : '');
    el.textContent = t.text;
    el.style.left = (t.x / 855 * 100) + '%';
    el.style.top = (t.y / 855 * 100) + '%';
    el.style.setProperty('--i', i); // 错峰入场
    frag.appendChild(el);
  });
  root.appendChild(frag);
}

/* 轨道进入视口时触发一次性入场动画 */
function setupOrbitObserver() {
  const sec = document.querySelector('.sec-orbit');
  if (!sec) return;
  if (!('IntersectionObserver' in window)) { sec.classList.add('is-visible'); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        sec.classList.add('is-visible');
        io.unobserve(e.target); // 一次性，不重复
      }
    });
  }, { threshold: 0.25 });
  io.observe(sec);
}

/* ─── 滚动条图片 ───
   按顺序展示 assets/首页/滚动/ 下的图片，1.png → 11.png。
   进入视口后从右向左无缝循环滚动。
   若增删图片，同步修改此数组即可。 */
const MARQUEE_IMAGES = [
  'assets/首页/滚动/1.png',
  'assets/首页/滚动/2.png',
  'assets/首页/滚动/3.png',
  'assets/首页/滚动/4.png',
  'assets/首页/滚动/5.png',
  'assets/首页/滚动/6.png',
  'assets/首页/滚动/7.png',
  'assets/首页/滚动/8.png',
  'assets/首页/滚动/9.png',
  'assets/首页/滚动/10.png',
  'assets/首页/滚动/11.png',
];

function renderMarquee() {
  const track = document.getElementById('marquee-track');
  if (!track) return;
  const frag = document.createDocumentFragment();
  // 渲染两份，配合 translateX(-50%) 实现从右向左无缝循环
  for (let dup = 0; dup < 2; dup++) {
    MARQUEE_IMAGES.forEach((src) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = '';
      img.draggable = false;
      frag.appendChild(img);
    });
  }
  track.appendChild(frag);
  const marquee = track.closest('.marquee');
  if (marquee) {
    marquee.style.setProperty('--marquee-count', MARQUEE_IMAGES.length);
    marquee.style.setProperty('--marquee-duration', (MARQUEE_IMAGES.length * 5) + 's');
  }
}

/* 跑马灯进入视口时开始从右向左循环滚动 */
function setupMarqueeObserver() {
  const marquee = document.querySelector('.marquee');
  if (!marquee) return;
  if (!('IntersectionObserver' in window)) { marquee.classList.add('is-playing'); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        marquee.classList.add('is-playing');
        io.unobserve(e.target); // 一次性
      }
    });
  }, { threshold: 0.3 });
  io.observe(marquee);
}

renderOrbit();
renderMarquee();
setupOrbitObserver();
setupMarqueeObserver();
