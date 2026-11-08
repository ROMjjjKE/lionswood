/* Lionswood: прокрутка, витрина, конструктор */
(function () {
  'use strict';
  var WA = 'https://wa.me/375291666132';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var vh = window.innerHeight;

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initDrawer();
    initReveal();
    initRail();
    initParallax();
    initPlan();
    initForm();
    var y = document.getElementById('year'); if (y) y.textContent = new Date().getFullYear();
  });

  function initHeader() {
    var hd = document.getElementById('hd');
    if (!hd) return;
    function upd() { hd.classList.toggle('is-stuck', window.scrollY > 40); }
    upd(); window.addEventListener('scroll', upd, { passive: true });
  }

  function initDrawer() {
    var b = document.getElementById('burger'), d = document.getElementById('drawer');
    if (!b || !d) return;
    var last = null;
    function open() {
      last = document.activeElement; d.hidden = false;
      b.setAttribute('aria-expanded', 'true'); document.body.classList.add('is-locked');
      var x = document.getElementById('drawer-x'); if (x) x.focus({ preventScroll: true });
    }
    function close() {
      d.hidden = true; b.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('is-locked');
      if (last) last.focus({ preventScroll: true });
    }
    b.addEventListener('click', function () { d.hidden ? open() : close(); });
    var x = document.getElementById('drawer-x'); if (x) x.addEventListener('click', close);
    d.addEventListener('click', function (e) {
      if (e.target.closest('a')) { close(); return; }
      if (!e.target.closest('.drawer__in')) close();
    });
    document.addEventListener('keydown', function (e) {
      if (d.hidden) return;
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var it = d.querySelectorAll('a, button'); if (!it.length) return;
      var f = it[0], l = it[it.length - 1];
      if (e.shiftKey && document.activeElement === f) { e.preventDefault(); l.focus(); }
      else if (!e.shiftKey && document.activeElement === l) { e.preventDefault(); f.focus(); }
    });
    window.addEventListener('resize', function () { if (window.innerWidth > 1020 && !d.hidden) close(); });
  }

  function initReveal() {
    var els = document.querySelectorAll('.rv');
    if (!els.length) return;
    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('is-in'); }); return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting || (en.boundingClientRect && en.boundingClientRect.top < 0)) {
          en.target.classList.add('is-in'); io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }

  /* прилипающая горизонтальная витрина */
  function initRail() {
    var rail = document.getElementById('katalog');
    var track = document.getElementById('railTrack');
    var bar = document.getElementById('railBar');
    if (!rail || !track) return;
    var dist = 0, top = 0, ticking = false;

    function measure() {
      if (window.innerWidth <= 900) {
        rail.style.height = 'auto'; track.style.transform = ''; dist = 0; return;
      }
      dist = Math.max(0, track.scrollWidth - window.innerWidth + 24);
      rail.style.height = (window.innerHeight + dist) + 'px';
      top = rail.getBoundingClientRect().top + window.scrollY;
      apply();
    }
    function apply() {
      if (window.innerWidth <= 900 || !dist) return;
      var p = Math.min(1, Math.max(0, (window.scrollY - top) / dist));
      track.style.transform = 'translate3d(' + (-p * dist).toFixed(2) + 'px,0,0)';
      if (bar) bar.style.width = (p * 100).toFixed(1) + '%';
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { ticking = false; apply(); });
    }
    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(measure, 150); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
  }

  /* мягкий параллакс */
  function initParallax() {
    var els = [].slice.call(document.querySelectorAll('[data-parallax]'));
    if (!els.length || reduced) return;
    var raf = false;
    function upd() {
      raf = false;
      vh = window.innerHeight;
      els.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.08;
        var mid = r.top + r.height / 2 - vh / 2;
        el.style.transform = 'translate3d(0,' + (-mid * speed).toFixed(2) + 'px,0)';
      });
    }
    function onScroll() { if (!raf) { raf = true; requestAnimationFrame(upd); } }
    upd();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  }

  /* конструктор беседки */
  function initPlan() {
    var svg = document.getElementById('plan');
    if (!svg) return;
    var SIZES = { '3x3': [3, 3], '3x4': [3, 4], '4x4': [4, 4], '4x5': [4, 5], '5x5': [5, 5] };
    var LBL = {};
    ['shape', 'size', 'roof', 'walls'].forEach(function (k) {
      LBL[k] = {};
      svg.parentElement.parentElement.querySelectorAll('[data-k="' + k + '"]').forEach(function (b) {
        LBL[k][b.getAttribute('data-v')] = b.textContent.trim();
      });
    });
    var st = { shape: 'rect', size: '3x3', roof: 'gable', walls: 'open' };
    var floor = document.getElementById('floorShape');
    var roofS = document.getElementById('roofShape');
    var wallG = document.getElementById('wallLines');
    var postG = document.getElementById('posts');
    var ridge = document.getElementById('ridgeLine');
    var dimW = document.getElementById('dimW'), dimWt = document.getElementById('dimWt');
    var dimD = document.getElementById('dimD'), dimDt = document.getElementById('dimDt');
    var cap = document.getElementById('planCap'), sum = document.getElementById('sumText');
    var send = document.getElementById('waSend');
    var CX = 230, CY = 200, BOX = 288;

    function poly(n, R, rot) {
      var pts = [];
      for (var i = 0; i < n; i++) {
        var a = rot + i * 2 * Math.PI / n;
        pts.push([CX + R * Math.cos(a), CY + R * Math.sin(a)]);
      }
      return pts;
    }
    function ptsStr(p) { return p.map(function (x) { return x[0].toFixed(1) + ',' + x[1].toFixed(1); }).join(' '); }
    function offsetPoly(p, d) {
      var cx = 0, cy = 0;
      p.forEach(function (q) { cx += q[0]; cy += q[1]; });
      cx /= p.length; cy /= p.length;
      return p.map(function (q) {
        var dx = q[0] - cx, dy = q[1] - cy, len = Math.hypot(dx, dy) || 1;
        return [q[0] + dx / len * d, q[1] + dy / len * d];
      });
    }
    function svgEl(tag, attrs) {
      var e = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (var k in attrs) e.setAttribute(k, attrs[k]);
      return e;
    }

    function render() {
      var wh = SIZES[st.size], w = wh[0], h = wh[1];
      var isRect = st.shape === 'rect';
      var maxD = Math.max(w, h);
      var scale = BOX / (isRect ? maxD : w);
      var P, posts, n;
      if (isRect) {
        var W = w * scale, H = h * scale;
        P = [[CX - W / 2, CY - H / 2], [CX + W / 2, CY - H / 2], [CX + W / 2, CY + H / 2], [CX - W / 2, CY + H / 2]];
        posts = P; n = 4;
      } else {
        n = st.shape === 'hex' ? 6 : 8;
        var R = (w * scale) / 2;
        var rot = st.shape === 'hex' ? -Math.PI / 2 : -Math.PI / 2 + Math.PI / 8;
        P = poly(n, R, rot);
        posts = P;
      }
      floor.setAttribute('points', ptsStr(P));

      /* кровля */
      var out = offsetPoly(P, 16);
      roofS.setAttribute('points', ptsStr(out));
      roofS.setAttribute('stroke-dasharray', st.roof === 'soft' ? '0' : '6 5');
      roofS.setAttribute('fill', st.roof === 'soft' ? 'rgba(162,96,58,.10)' : 'none');

      /* конёк */
      ridge.innerHTML = '';
      if (st.roof === 'gable') {
        var along = w >= h;
        var a, b;
        if (st.shape === 'rect') {
          if (along) { a = [CX - w * scale / 2, CY]; b = [CX + w * scale / 2, CY]; }
          else { a = [CX, CY - h * scale / 2]; b = [CX, CY + h * scale / 2]; }
        } else {
          a = P[0]; b = P[Math.floor(n / 2)];
        }
        ridge.appendChild(svgEl('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: '#131009', 'stroke-width': 2 }));
        ridge.appendChild(svgEl('line', { x1: a[0], y1: a[1], x2: a[0], y2: a[1], stroke: 'none' }));
      } else if (st.roof === 'hip') {
        P.forEach(function (q) {
          ridge.appendChild(svgEl('line', { x1: CX, y1: CY, x2: q[0], y2: q[1], stroke: 'rgba(19,16,9,.28)', 'stroke-width': 1 }));
        });
      }

      /* стены */
      wallG.innerHTML = '';
      if (st.walls !== 'open') {
        for (var i = 0; i < P.length; i++) {
          var q1 = P[i], q2 = P[(i + 1) % P.length];
          if (st.walls === 'half') {
            wallG.appendChild(svgEl('line', { x1: q1[0], y1: q1[1], x2: q2[0], y2: q2[1], stroke: '#A2603A', 'stroke-width': 6, 'stroke-linecap': 'butt' }));
          } else {
            wallG.appendChild(svgEl('line', { x1: q1[0], y1: q1[1], x2: q2[0], y2: q2[1], stroke: '#A2603A', 'stroke-width': 1.5 }));
            var mx = (q1[0] + q2[0]) / 2, my = (q1[1] + q2[1]) / 2;
            var dx = q2[0] - q1[0], dy = q2[1] - q1[1], len = Math.hypot(dx, dy) || 1;
            var nx = -dy / len * 5, ny = dx / len * 5;
            wallG.appendChild(svgEl('line', { x1: q1[0] + nx, y1: q1[1] + ny, x2: q2[0] + nx, y2: q2[1] + ny, stroke: '#A2603A', 'stroke-width': 1 }));
          }
        }
      }

      /* стойки */
      postG.innerHTML = '';
      posts.forEach(function (q) {
        postG.appendChild(svgEl('rect', { x: q[0] - 6, y: q[1] - 6, width: 12, height: 12, fill: '#131009' }));
      });

      /* размеры */
      var xs = P.map(function (q) { return q[0]; }), ys = P.map(function (q) { return q[1]; });
      var minX = Math.min.apply(null, xs), maxX = Math.max.apply(null, xs);
      var minY = Math.min.apply(null, ys), maxY = Math.max.apply(null, ys);
      var yLine = maxY + 46;
      dimW.setAttribute('d', 'M' + minX + ' ' + yLine + ' H' + maxX);
      dimWt.setAttribute('x', (minX + maxX) / 2); dimWt.setAttribute('y', yLine + 20);
      var sizeLabel = isRect
        ? (w.toFixed(1).replace('.', ',') + ' × ' + h.toFixed(1).replace('.', ',') + ' м')
        : ('Ø ' + w.toFixed(1).replace('.', ',') + ' м');
      dimWt.textContent = isRect ? (w.toFixed(1).replace('.', ',') + ' м') : sizeLabel;
      var xLine = maxX + 44;
      dimD.setAttribute('d', 'M' + xLine + ' ' + minY + ' V' + maxY);
      dimDt.setAttribute('x', xLine + 8); dimDt.setAttribute('y', (minY + maxY) / 2 + 4);
      dimDt.textContent = h.toFixed(1).replace('.', ',') + ' м';
      dimD.style.display = isRect ? '' : 'none';
      dimDt.style.display = isRect ? '' : 'none';

      var postsWord = n === 4 ? '4 стойки' : (n + ' стоек');
      var txt = LBL.shape[st.shape] + ' беседка ' + sizeLabel + ', ' +
        LBL.roof[st.roof].toLowerCase() + ' кровля, ' + LBL.walls[st.walls].toLowerCase() + ', ' + postsWord + '.';
      sum.textContent = txt;
      cap.textContent = LBL.shape[st.shape] + ' · ' + sizeLabel + ' · ' + LBL.roof[st.roof].toLowerCase() + ' · ' + LBL.walls[st.walls].toLowerCase();
      if (send) send.href = WA + '?text=' + encodeURIComponent('Здравствуйте! Хочу беседку по схеме с сайта Lionswood: ' + txt + ' Подскажите срок и стоимость.');
    }

    svg.ownerDocument.querySelectorAll('[data-k]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var k = btn.getAttribute('data-k'), v = btn.getAttribute('data-v');
        st[k] = v;
        btn.parentElement.querySelectorAll('[data-k]').forEach(function (o) {
          var on = o === btn;
          o.classList.toggle('is-on', on); o.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        render();
      });
    });
    render();
  }

  function initForm() {
    var f = document.getElementById('lead-form');
    if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = document.getElementById('f-name'), p = document.getElementById('f-phone'), bad = false;
      [n, p].forEach(function (el) {
        if (!el.value.trim()) { el.style.borderColor = '#A2603A'; bad = true; } else { el.style.borderColor = ''; }
      });
      if (bad) { var o = document.getElementById('form-ok'); o.classList.add('is-on'); o.textContent = 'Заполните имя и телефон, иначе мы не сможем ответить.'; return; }
      var text = ['Заявка с сайта Lionswood', 'Имя: ' + n.value.trim(), 'Телефон: ' + p.value.trim(),
        'Что нужно: ' + document.getElementById('f-what').value,
        'Детали: ' + (document.getElementById('f-note').value.trim() || 'не указано')].join('\n');
      var ok = document.getElementById('form-ok');
      ok.classList.add('is-on');
      ok.textContent = 'Заявка собрана. Открываем WhatsApp — останется нажать «Отправить».';
      window.open(WA + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      f.reset();
    });
  }
})();
