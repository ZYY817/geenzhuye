/* ============================================================
   grid.js · 格子
   首屏 198 格（数量和分类占比照 docs/home.png 那台机器）。
   格子按“故事顺序”排成一维：系统占用 → 仅统计 → 可清理 → 建议迁移
   → 待确认 → 大文件 → 正在使用 → 残留/扫描 → 可用。
   横屏竖屏怎么折行交给 CSS（.cells 的 grid-auto-flow）。
   另负责：波浪入场延迟、指针邻近度、tooltip、图例联动。
   ============================================================ */

/* DOM 顺序 = 行主序：index = 行×列数 + 列。
   横屏 18 列，竖屏 11 列；波浪延迟只跟相对位置走，取近似即可。 */
const COLS = 18;

/* 状态 → 悬停文案 */
const TIP = {
  sys:     ['系统占用', 'Windows 与未识别 · 1 GB'],
  clean:   ['可清理', ['NVIDIA DXCache · 10.5 GB', 'DirectX 着色器缓存 · 4.05 GB',
                       'Playwright · 718 MB', 'Go 编译缓存 · 358 MB',
                       'Gradle caches · 321 MB', 'VS Code 缓存 · 88 MB',
                       'NuGet 缓存 · 275 MB', '浏览器缓存 · 642 MB']],
  move:    ['建议迁移', ['HuggingFace 模型 · 1.9 GB', '微信聊天记录 · 620 MB', '项目依赖 · 370 MB']],
  confirm: ['待确认', ['旧游戏存档 · 2.1 GB', '过期下载 · 1.36 GB', 'WorkBuddy AI · 1.48 GB',
                       '旧版安装包 · 980 MB', '导出视频 · 2.4 GB']],
  busy:    ['正在使用', ['微信/QQ 运行中 · 6.58 GB', '已装应用 · 4.65 GB', 'Docker 镜像 · 2.2 GB']],
  stat:    ['仅统计', ['文档与桌面 · 2.2 GB', '已装应用 · 4.65 GB', '系统组件 · 8.1 GB', '照片 · 1.3 GB']],
  free:    ['可用', '可用空间 · 约 1 GB'],
  warn:    ['大文件', ['安装包缓存 · 1.36 GB', '视频工程文件 · 4.2 GB', '虚拟机镜像 · 7.8 GB']],
  res:     ['清理残留', '上次未删净 · 待重试'],
  scan:    ['扫描中', '正在识别…'],
};

/* 故事顺序：[状态, 格数]，合计 198。
   每类占用连成一整块（允许同一状态分两段出现，块仍然相连）：
   r0-5  sys×108        r6  sys×4 stat×14     r7  stat×18
   r8    stat×4 clean×14   r9  busy×7 clean×4 confirm×7
   r10   free×11 confirm×4 move×3                                */
const STORY = [
  ['sys', 112], ['stat', 36], ['clean', 14], ['busy', 7], ['clean', 4],
  ['confirm', 7], ['free', 11], ['confirm', 4], ['move', 3],
];

const CLS = { s:'sys', c:'clean', m:'move', f:'confirm', b:'busy',
              t:'stat', '.':'free', w:'warn', r:'res', '~':'scan',
              C:'freed', M:'moved' };

let pick_i = 0;
function tipFor(state) {
  const t = TIP[state];
  const detail = Array.isArray(t[1]) ? t[1][pick_i++ % t[1].length] : t[1];
  return { name: t[0], detail };
}

export function buildGrid(el) {
  const frag = document.createDocumentFragment();
  const cells = [];
  let i = 0;
  for (const [state, n] of STORY) {
    for (let k = 0; k < n; k++, i++) {
      const d = document.createElement('i');
      d.className = 'cell cell--' + state;
      d.dataset.s = state;
      const tip = tipFor(state);
      d.dataset.tip = tip.detail;
      d.dataset.cat = tip.name;
      // 斜向波浪：按行主序算延迟（列*26 + 行*16）
      d.style.setProperty('--d', ((i % COLS) * 26 + Math.floor(i / COLS) * 16) + 'ms');
      frag.appendChild(d);
      cells.push(d);
    }
  }
  el.appendChild(frag);
  return cells;
}

/* 全空的盘（下载区背景） */
export function buildEmpty(el, n = 198) {
  const frag = document.createDocumentFragment();
  for (let i = 0; i < n; i++) {
    const d = document.createElement('i');
    d.className = 'cell';
    d.style.setProperty('--d', ((i % COLS) * 22 + Math.floor(i / COLS) * 14) + 'ms');
    frag.appendChild(d);
  }
  el.appendChild(frag);
  return [...el.children];
}

/* ---------- 指针邻近度 + tooltip ----------
   指针周围的格子写 --k（1 = 正下方，0 = 圈外），CSS 让它们往里缩。 */
export function initLens(gmap, tip) {
  const cells = [...gmap.children];
  let centers = [], radius = 200, raf = 0, px = 0, py = 0, inside = false;
  let lit = new Set();

  const measure = () => {
    centers = cells.map(el => [el.offsetLeft + el.offsetWidth / 2,
                               el.offsetTop + el.offsetHeight / 2]);
    radius = (cells[0]?.offsetWidth || 90) * 2.3;
  };
  measure();
  new ResizeObserver(measure).observe(gmap);

  const paint = () => {
    raf = 0;
    const next = new Set();
    if (inside) {
      for (let i = 0; i < cells.length; i++) {
        const d = Math.hypot(centers[i][0] - px, centers[i][1] - py);
        if (d >= radius) continue;
        cells[i].style.setProperty('--k', (1 - d / radius).toFixed(3));
        next.add(cells[i]);
      }
    }
    for (const c of lit) if (!next.has(c)) c.style.removeProperty('--k');
    lit = next;
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(paint); };

  gmap.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch') return;
    const r = gmap.getBoundingClientRect();
    px = e.clientX - r.left; py = e.clientY - r.top;
    inside = true;
    queue();
  });
  gmap.addEventListener('pointerleave', () => {
    inside = false;
    queue();
    tip.classList.remove('on');
  });

  gmap.addEventListener('pointerover', e => {
    const c = e.target.closest('.cell');
    if (!c || e.pointerType === 'touch') { tip.classList.remove('on'); return; }
    tip.textContent = c.classList.contains('is-freed') ? '已腾出 · 约 1 GB'
      : c.classList.contains('is-moved') ? '已搬走 · 原地留了链接'
      : `${c.dataset.tip} · ${c.dataset.cat}`;
    const x = c.offsetLeft + c.offsetWidth / 2;
    tip.style.left = Math.min(Math.max(x, 110), gmap.clientWidth - 110) + 'px';
    // 顶上两排在导航底下，往上弹会被挡住，翻到格子下面
    const below = c.offsetTop < 120;
    tip.classList.toggle('below', below);
    tip.style.top = (c.offsetTop + (below ? c.offsetHeight : 0)) + 'px';
    tip.classList.add('on');
  });
}

/* ---------- 卡片里的小图：给一段状态字符画，生成小号格子阵 ---------- */
export function buildMini(el, rows, cols, states) {
  const frag = document.createDocumentFragment();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const state = states[Math.min(r, states.length - 1)][c] || '.';
      const d = document.createElement('i');
      d.className = 'cell cell--' + (CLS[state] || 'free');
      d.style.setProperty('--d', (c * 14 + r * 34) + 'ms');
      frag.appendChild(d);
    }
  }
  el.appendChild(frag);
}
