/* ============================================================
   disk.js · 演示区驱动（钉住，三步）
   格子图是主角，固定在屏幕中央，五类占用连成整块、外侧引线标注常驻。

   第 1 步 看：五类轮流正向高亮——整类逐格行波点亮 + 一道扫光，
               说明文字同步换解释。
   第 2 步 清：蓝格逐个闪 → 缩小 → 留下“已腾出”虚框，飘 +1 GB，
               右侧累计读数跳动，下方占用条实时缩短。
   第 3 步 搬：白格沿看得见的虚线弧飞进 D 盘方框，原位留链接标记。
   尾声：已腾出局同闪一次，出现“清理前/清理后”对比开关和结论。
   任意滚动位置说明文字都在，往回滚原样还原。
   ============================================================ */

const TOTAL = 198.2, USED = 189.9;                // GB，docs/home.png 上那台机器
const CLEAN_GB = 18.2, MOVE_GB = 2.89;

/* 第 1 步：七类依次“被识别”——未识别的格是统一暗块，
   滚动推进时逐类点亮并保留，直到整张图读得懂。 */
const ORDER = ['sys', 'stat', 'clean', 'confirm', 'busy', 'move', 'free'];

const HEAD_CAP = ['扫描完成，开始识别', '整盘占用画成一张图，逐类认出来给你看。'];

/* 每类被识别时的说明（一句话） */
const CAP0 = {
  sys:     ['灰块：系统和没认出来的', 'Windows 本体加上未被归类的部分，共 114.8 GB。这块不动。'],
  stat:    ['细描边格：仅统计', '照片、文档、软件本体。标明占用，不做删除。'],
  clean:   ['蓝格：可清理缓存', '删除后软件会自动重建，这 18.2 GB 可放心清出。'],
  confirm: ['粗描边格：待你确认', '旧游戏存档、旧安装包等。疑似可删，确认后才执行。'],
  busy:    ['圆点格：正在使用', '程序运行中不可操作，关闭程序后可再处理。'],
  move:    ['白块：建议迁移', '各家 AI 应用的模型、聊天记录等不宜删除。迁入 D 盘后原位保留链接，使用不受影响。'],
  free:    ['虚线格：可用空间', '现在只剩 8.32 GB。演示结束时看它能变成多少。'],
};
const STEP_CAP = [
  null,
  ['按住，开始清理', '向下滚动即按住。蓝格逐个清出，可用空间实时增加。'],
  ['迁移到 D 盘', '文件沿虚线轨迹移入 D 盘，原位保留链接标记。占用同样释放。'],
];

const clamp = v => v < 0 ? 0 : v > 1 ? 1 : v;
const reduced = matchMedia('(prefers-reduced-motion: reduce)');

export function initDisk(section, cells) {
  const wrap   = section.querySelector('#gmapwrap');
  const gmap   = section.querySelector('#gmap');
  const sheen  = section.querySelector('#sheen');
  const flysvg = section.querySelector('#flypath');
  const elInd  = section.querySelector('#demoInd');
  const elT    = section.querySelector('#demo-t');
  const elD    = section.querySelector('#demoD');
  const elN    = section.querySelector('#freedN');
  const elPct  = section.querySelector('#occPct');
  const elFill = section.querySelector('#occFill');
  const dbox   = section.querySelector('#dbox');
  const dslots = [...dbox.querySelectorAll('.dbox__cells i')];
  const tail   = section.querySelector('#demoTail');
  const labels = [...section.querySelectorAll('.glabel')];
  const chips  = [...section.querySelectorAll('.demo__chips [data-g]')];
  const auto   = section.querySelector('#autoBtn');
  const cmpBtn = section.querySelector('#cmpBtn');

  const clean = cells.filter(c => c.dataset.s === 'clean');
  const move  = cells.filter(c => c.dataset.s === 'move');

  /* 每类的格子成员（行主序），聚焦时按这个顺序打行波 */
  const byCls = {};
  cells.forEach((c, i) => (byCls[c.dataset.s] ??= []).push([c, i]));

  /* —— “+1 GB” 飘字：每个蓝格一个，挂在格图容器里 —— */
  const tags = clean.map(() => {
    const t = document.createElement('span');
    t.className = 'tag mono';
    t.textContent = '+1 GB';
    wrap.appendChild(t);
    return t;
  });

  let geom = null;
  const measure = () => {
    const dr = dbox.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
    const dbx = dr.left + dr.width / 2 - wr.left, dby = dr.top + dr.height / 2 - wr.top;
    geom = {
      tag: clean.map(c => [c.offsetLeft + c.offsetWidth / 2, c.offsetTop]),
      fly: move.map(c => {
        const cx = c.offsetLeft + c.offsetWidth / 2, cy = c.offsetTop + c.offsetHeight / 2;
        return { dx: dbx - cx, dy: dby - cy, cx, cy };
      }),
      w: wr.width, h: wr.height, dbx, dby,
    };
    tags.forEach((t, i) => {
      t.style.left = geom.tag[i][0] + 'px';
      t.style.top = geom.tag[i][1] + 'px';
    });
    /* 飞格轨迹虚线：先画出来，第 3 步才显形，让弧线看得见 */
    flysvg.setAttribute('viewBox', `0 0 ${wr.width} ${wr.height}`);
    flysvg.innerHTML = geom.fly.map(f =>
      `<path d="M ${f.cx} ${f.cy} Q ${f.cx + f.dx * .42} ${f.cy + f.dy * .5 - 90} ${geom.dbx} ${geom.dby}"/>`
    ).join('') + `<circle r="4" class="flydot" cx="${geom.dbx}" cy="${geom.dby}"/>`;
  };
  new ResizeObserver(() => { geom = null; }).observe(wrap);

  /* —— 悬停：整类高亮 + 标注加粗（data-hov 覆盖 data-f） —— */
  const hov = e => {
    const t = e.target.closest('.cell, .glabel, .demo__chips [data-g]');
    const v = t ? (t.dataset.s || t.dataset.g) : '';
    if (wrap.dataset.hov !== v) wrap.dataset.hov = v;   // 同值不写，省一次 198 格的样式失效
  };
  wrap.addEventListener('pointerover', hov);
  wrap.addEventListener('pointerleave', () => { wrap.dataset.hov = ''; });
  section.querySelector('.demo__chips').addEventListener('pointerover', hov);
  section.querySelector('.demo__chips').addEventListener('pointerleave', () => { wrap.dataset.hov = ''; });

  /* —— 清理前 / 清理后 对比开关 —— */
  cmpBtn.addEventListener('click', () => {
    section.dataset.cmp = section.dataset.cmp === 'before' ? '' : 'before';
  });

  /* —— 自动演示：8 秒播完三步，再点暂停 —— */
  const player = { on: false, p: 0, raf: 0, t: 0 };
  const tick = now => {
    if (!player.on) return;
    player.p = Math.min(1, player.p + (now - player.t) / 8000);
    player.t = now;
    render(player.p);
    if (player.p < 1) player.raf = requestAnimationFrame(tick);
    else setAuto(false);
  };
  const setAuto = on => {
    player.on = on;
    auto.classList.toggle('on', on);
    auto.textContent = on ? '❚❚ 暂停' : '▶ 自动演示';
    if (on) {
      if (player.p >= 1) player.p = 0;
      player.t = performance.now();
      player.raf = requestAnimationFrame(tick);
    } else cancelAnimationFrame(player.raf);
  };
  auto.addEventListener('click', () => setAuto(!player.on));

  /* 换聚焦类：行波逐格点亮 + 一道扫光。从格子上起算，越靠后延迟越大 */
  function punchFocus(cls) {
    const list = byCls[cls] || [];
    list.forEach(([c]) => c.classList.remove('hit'));
    void gmap.offsetWidth;
    list.forEach(([c], k) => {
      c.style.setProperty('--hd', (k * 26) + 'ms');
      c.classList.add('hit');
    });
    sheen.classList.remove('go');
    void sheen.offsetWidth;
    sheen.classList.add('go');
    if (!reduced.matches) {
      elT.animate(
        [{ opacity: 0, translate: '0 7px' }, { opacity: 1, translate: '0 0' }],
        { duration: 240, easing: 'ease-out' });
      elD.animate(
        [{ opacity: 0, translate: '0 7px' }, { opacity: 1, translate: '0 0' }],
        { duration: 240, delay: 45, easing: 'ease-out' });
    }
  }

  let lastP = 0, capKey = '', lastStep = -1, pct = -1, lastGi = -1, lastDisc = -1, entered = false;

  function render(p) {
    /* 钉住第一帧才放格子波浪入场：先看见格子拼出来 */
    if (!entered) {
      if (p > .004) { entered = true; gmap.classList.add('run'); }
      else if (p <= 0) return;
    }
    if (!geom) measure();
    lastP = p;
    const s = p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2;
    wrap.dataset.step = s;
    const tc = clamp((p - 1 / 3) * 3);
    const tm = clamp((p - 2 / 3) * 3);

    /* —— 第 1 步识别进度：disc = 已被识别的类数（0..7），之后步全程保持已识别 —— */
    const disc = s === 0 ? Math.min(ORDER.length, Math.floor(p * 21)) : ORDER.length;
    if (disc !== lastDisc) {
      lastDisc = disc;
      ORDER.forEach((cls, k) => {
        const rev = k < disc;
        (byCls[cls] || []).forEach(([c]) => c.classList.toggle('is-un', !rev));
      });
      labels.forEach(l => l.classList.toggle('is-un', ORDER.indexOf(l.dataset.g) >= disc));
      chips.forEach(c => c.classList.toggle('is-un', ORDER.indexOf(c.dataset.g) >= disc));
    }

    /* —— 焦点类 + 说明文字（任何位置都有字） —— */
    let focus, cap;
    if (s === 0) {
      focus = disc ? ORDER[disc - 1] : '';
      cap = disc ? CAP0[focus] : HEAD_CAP;
    } else {
      focus = s === 1 ? 'clean' : 'move';
      cap = STEP_CAP[s];
      if (s === 2 && tm > .96) focus = '';   // 尾声撤掉调光，全格回到全亮做对比
    }
    wrap.dataset.f = s === 0 ? '' : focus;   // 第 1 步不调光，识别本身即强调
    const key = s + ':' + focus;
    if (key !== capKey) {
      capKey = key;
      elT.textContent = cap[0];
      elD.textContent = cap[1];
      labels.forEach(l => l.classList.toggle('on', l.dataset.g === focus));
      chips.forEach(c => c.classList.toggle('on', c.dataset.g === focus));
      punchFocus(focus);
    }
    if (s !== lastStep) { lastStep = s; elInd.textContent = (s + 1) + ' / 3'; }

    /* —— 清理进度：闪 → 腾出 —— */
    const nc = tc * clean.length;
    clean.forEach((c, i) => {
      const freed = i < nc - 1.4 || (tc >= .999 && i < nc);
      c.classList.toggle('is-freed', freed);
      c.classList.toggle('is-flash', !freed && i < nc);
      tags[i].classList.toggle('go', freed && i >= nc - 2);
    });

    /* —— 迁移进度：白格沿虚线弧飞进 D 盘 —— */
    move.forEach((c, i) => {
      const m = clamp((tm - i * .24) / .45);
      const done = m >= .98;
      if (done) {
        c.style.removeProperty('--fx');
        c.style.removeProperty('--fy');
        c.style.removeProperty('--fs');
      } else {
        const f = geom.fly[i];
        /* 与 SVG 虚线同一条二次贝塞尔 */
        const qx = f.cx + f.dx * .42, qy = f.cy + f.dy * .5 - 90;
        const x = (1 - m) * (1 - m) * f.cx + 2 * (1 - m) * m * qx + m * m * geom.dbx;
        const y = (1 - m) * (1 - m) * f.cy + 2 * (1 - m) * m * qy + m * m * geom.dby;
        c.style.setProperty('--fx', (x - f.cx).toFixed(1) + 'px');
        c.style.setProperty('--fy', (y - f.cy).toFixed(1) + 'px');
        c.style.setProperty('--fs', (1 - m * .35).toFixed(3));
      }
      c.classList.toggle('is-moved', done);
    });
    const nmoved = move.filter(c => c.classList.contains('is-moved')).length;
    dslots.forEach((d, i) => d.classList.toggle('on', i < nmoved));

    /* —— 读数 + 占用条：整数位变化时数字蹦一下 —— */
    const freedGB = tc * CLEAN_GB + tm * MOVE_GB;
    elN.textContent = freedGB.toFixed(1);
    const gi = Math.floor(freedGB);
    if (gi !== lastGi) {
      lastGi = gi;
      if (!reduced.matches && freedGB > 0)
        elN.animate(
          [{ transform: 'scale(1.16)' }, { transform: 'scale(1)' }],
          { duration: 240, easing: 'cubic-bezier(.2,.9,.3,1.3)' });
    }
    const v = Math.round((USED - freedGB) / TOTAL * 100);
    if (v !== pct) {
      pct = v;
      elPct.textContent = v;
      elFill.style.width = v + '%';
    }

    /* —— 尾声：同闪 + 对比开关 + 结论 —— */
    gmap.classList.toggle('flashall', s === 2 && tm > .96);
    tail.classList.toggle('is-on', p > .9);
  }

  /* 演示区离屏：停掉无限扫光（CSS 里 animation-play-state 吃 .live） */
  new IntersectionObserver(([e]) =>
    section.classList.toggle('live', e.isIntersecting)).observe(section);

  /* 滚动驱动：自动演示播放中忽略滚动 */
  return p => { if (!player.on) render(p); };
}
