/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   首页交互
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

/* ─── 环形轨道标签 ───
   x, y 为 ZRGZy 坐标系内的标签左上角（y 已含 a7YNpW 组的 +101 偏移）。
   orbit-system 代表 950×950 方盒，其在 ZRGZy 中的左上角 = (95, 0)。
   故标签在盒内的百分比位置：left = (x-95)/950*100, top = y/950*100。
   标签随 orbit-system 自旋公转，自身反向自旋保持正立。 */
const ORBIT_TAGS = [
  { text: '多款 Ai产品',         x: 3,   y: 345 },
  { text: 'CRM、BI、OA',         x: 21,  y: 589 },
  { text: '游戏产品 3D编辑器',    x: 86,  y: 706 },
  { text: '教辅 教研 2D编辑器',   x: 215, y: 823 },
  { text: '电商 / 会员',          x: 0,   y: 467 },
  { text: '学习机 Pad',           x: 74,  y: 223 },
  { text: '硬件产品',             x: 290, y: 284, inverted: true },
  { text: 'B端产品',             x: 244, y: 496, inverted: true },
  { text: 'C端产品',             x: 400, y: 178, inverted: true },
  { text: '数据中台',             x: 396, y: 708, inverted: true },
  { text: '学习/工具类 APP',       x: 163, y: 101 },
  { text: 'K12教育',              x: 294, y: 602, inverted: true },
  { text: 'OS系统',               x: 247, y: 390, inverted: true },
];

function renderOrbit() {
  const root = document.getElementById('orbit-tags');
  if (!root) return;
  const frag = document.createDocumentFragment();
  ORBIT_TAGS.forEach((t, i) => {
    const el = document.createElement('span');
    el.className = 'tag' + (t.inverted ? ' inverted' : '');
    el.textContent = t.text;
    el.style.left = ((t.x - 95) / 950 * 100) + '%';
    el.style.top = (t.y / 950 * 100) + '%';
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
