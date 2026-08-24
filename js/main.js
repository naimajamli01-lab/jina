/* ═══════════════════════════════════════════════════════════
   JINA — interactions
   ═══════════════════════════════════════════════════════════ */
(() => {
'use strict';

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp  = (a, b, t) => a + (b - a) * t;
const prix  = n => n.toLocaleString('fr-FR') + ' TND';
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE    = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ═══════ 1. PRELOADER ═══════ */
(function loader(){
  const el = $('#loader'), bar = $('#loaderBar');
  $$('#loader .loader__word span').forEach((s, i) => s.style.animationDelay = (.35 + i * .035) + 's');
  let p = 0;
  const tick = setInterval(() => {
    p = Math.min(100, p + Math.random() * 16 + 6);
    bar.style.width = p + '%';
    if (p >= 100) {
      clearInterval(tick);
      setTimeout(() => {
        el.classList.add('is-done');
        document.body.style.overflow = '';
        setTimeout(() => el.remove(), 1400);
      }, 420);
    }
  }, REDUCED ? 40 : 160);
  document.body.style.overflow = 'hidden';
})();

/* ═══════ 2. CURSEUR ═══════ */
(function cursor(){
  if (!FINE) return;
  const c = $('.cursor'), flower = $('.cursor__flower'), label = $('.cursor__label');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
  addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    if (!c.classList.contains('is-live')) { rx = mx; ry = my; c.classList.add('is-live'); }
  }, { passive: true });
  (function raf(){
    rx = lerp(rx, mx, .16); ry = lerp(ry, my, .16);
    flower.style.transform = `translate(${rx}px,${ry}px)`;
    requestAnimationFrame(raf);
  })();
  document.addEventListener('pointerover', e => {
    const t = e.target.closest('[data-cursor],a,button');
    if (!t) { c.classList.remove('is-hot'); label.textContent = ''; return; }
    c.classList.add('is-hot');
    label.textContent = t.dataset.cursor || '';
  });
})();

/* ═══════ 3. AIMANTS ═══════ */
(function magnetic(){
  if (!FINE || REDUCED) return;
  $$('[data-magnetic]').forEach(el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .28}px,${(e.clientY - r.top - r.height / 2) * .34}px)`;
    });
    el.addEventListener('pointerleave', () => el.style.transform = '');
  });
})();

/* ═══════ 4. NAV · THÈME · MENU ═══════ */
(function chrome(){
  const nav = $('#nav'), burger = $('#burger'), menu = $('#mobileMenu');
  addEventListener('scroll', () => nav.classList.toggle('is-stuck', scrollY > 30), { passive: true });

  burger.addEventListener('click', () => {
    burger.classList.toggle('is-open');
    menu.classList.toggle('is-open');
  });
  $$('#mobileMenu a').forEach(a => a.addEventListener('click', () => {
    burger.classList.remove('is-open'); menu.classList.remove('is-open');
  }));

  const btn = $('#themeToggle'), txt = btn.querySelector('.chip__txt');
  const saved = (() => { try { return localStorage.getItem('jina-theme'); } catch { return null; } })();
  const apply = t => {
    document.documentElement.dataset.theme = t;
    txt.textContent = t === 'night' ? 'Jour' : 'Nuit';
    btn.querySelector('.chip__dot').style.background = t === 'night' ? '#FFEDA8' : '';
  };
  apply(saved || 'day');
  btn.addEventListener('click', () => {
    const t = document.documentElement.dataset.theme === 'night' ? 'day' : 'night';
    apply(t);
    try { localStorage.setItem('jina-theme', t); } catch {}
  });
})();

/* ═══════ 5. PROGRESSION ═══════ */
(function progress(){
  const bar = $('.scroll-bar i');
  const upd = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? scrollY / max * 100 : 0) + '%';
  };
  addEventListener('scroll', upd, { passive: true });
  addEventListener('resize', upd);
  upd();
})();

/* ═══════ 6. APPARITIONS ═══════ */
const revealIO = new IntersectionObserver(es => {
  es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); revealIO.unobserve(e.target); } });
}, { threshold: .12, rootMargin: '0px 0px -8% 0px' });

function reveal(el, delay = 0){
  if (!el) return;
  el.setAttribute('data-reveal', '');
  el.style.transitionDelay = delay + 'ms';
  revealIO.observe(el);
}
$$('.sec-head, .atelier__text, .atelier__stack, .news__inner, .foot__top, .look__head, .ring3d__ui').forEach(el => reveal(el));

/* ═══════ 7. HERO 3D ═══════ */
(function hero3d(){
  if (REDUCED) return;
  const stage = $('#heroStage'), scene = $('#heroScene');
  const layers = $$('[data-depth]', scene);
  let tx = 0, ty = 0, cx = 0, cy = 0, active = false;

  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    tx = (e.clientX - r.left) / r.width - .5;
    ty = (e.clientY - r.top) / r.height - .5;
    active = true;
  });
  stage.addEventListener('pointerleave', () => { tx = 0; ty = 0; });

  (function raf(){
    cx = lerp(cx, tx, .07); cy = lerp(cy, ty, .07);
    if (active) {
      scene.style.transform = `rotateY(${cx * 7}deg) rotateX(${-cy * 5}deg)`;
      layers.forEach(l => {
        const d = +l.dataset.depth;
        l.style.transform = `translate3d(${-cx * d}px,${-cy * d * .6}px,${d}px)`;
      });
    }
    requestAnimationFrame(raf);
  })();

  /* parallaxe verticale douce sur les cartes */
  addEventListener('scroll', () => {
    const y = clamp(scrollY / innerHeight, 0, 1);
    scene.style.setProperty('opacity', String(1 - y * .55));
    stage.style.setProperty('filter', `blur(${y * 3}px)`);
  }, { passive: true });
})();

/* ═══════ 8. MARQUEES ═══════ */
(function marquees(){
  $$('[data-marquee]').forEach((track, i) => {
    track.innerHTML += track.innerHTML;                 // boucle sans couture
    let x = 0, speed = (i % 2 ? -1 : 1) * .55, vBoost = 0, half = 0;
    const measure = () => half = track.scrollWidth / 2;
    measure(); addEventListener('resize', measure);

    let last = scrollY;
    addEventListener('scroll', () => {
      vBoost += (scrollY - last) * .06; last = scrollY;
    }, { passive: true });

    (function raf(){
      vBoost = lerp(vBoost, 0, .06);
      x -= speed + vBoost * Math.sign(speed || 1);
      if (half) { if (x <= -half) x += half; if (x > 0) x -= half; }
      track.style.transform = `translate3d(${x}px,0,0)`;
      requestAnimationFrame(raf);
    })();
  });
})();

/* ═══════ 9. CYLINDRE 3D — COLLECTIONS ═══════ */
(function ring(){
  const cyl = $('#ringCyl'), stage = $('.ring3d__stage'), sec = $('#collections');
  const N = COLLECTIONS.length, STEP = 360 / N;

  COLLECTIONS.forEach((c, i) => {
    const el = document.createElement('article');
    el.className = 'ring-panel';
    el.innerHTML = visualHTML(c) + `<h4>${c.name}</h4><small>${c.tagline}</small>`;
    cyl.appendChild(el);
  });
  const panels = $$('.ring-panel', cyl);

  let radius = 300;
  const layout = () => {
    const w = cyl.offsetWidth;
    radius = Math.round((w / 2) / Math.tan(Math.PI / N)) + 26;
    panels.forEach((p, i) => p.style.transform = `rotateY(${i * STEP}deg) translateZ(${radius}px)`);
  };
  layout(); addEventListener('resize', layout);

  let rot = 0, target = 0, drag = null, scrollRot = 0, idle = 0;

  const setMeta = () => {
    const i = ((Math.round(-target / STEP) % N) + N) % N;
    const c = COLLECTIONS[i];
    if ($('#ringName').textContent !== c.name) {
      $('#ringName').textContent = c.name;
      $('#ringDesc').textContent = c.desc;
    }
    panels.forEach((p, k) => {
      /* angle signé du panneau par rapport à la caméra, ramené dans [-180,180] */
      const f = (((k * STEP + rot + 180) % 360) + 360) % 360 - 180;
      p.classList.toggle('is-back', Math.abs(f) > 88);
    });
  };

  stage.addEventListener('pointerdown', e => {
    drag = { x: e.clientX, start: target }; idle = 0;
    stage.setPointerCapture(e.pointerId);
  });
  stage.addEventListener('pointermove', e => {
    if (!drag) return;
    target = drag.start + (e.clientX - drag.x) * .32;
  });
  const release = () => {
    if (!drag) return;
    drag = null;
    target = Math.round(target / STEP) * STEP;         // aimantation
  };
  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);

  $$('[data-ring]').forEach(b => b.addEventListener('click', () => {
    target = Math.round(target / STEP) * STEP - (+b.dataset.ring) * STEP; idle = 0;
  }));

  /* rotation liée au défilement */
  addEventListener('scroll', () => {
    const r = sec.getBoundingClientRect();
    const p = clamp(1 - (r.top + r.height / 2) / innerHeight, -1, 1);
    scrollRot = p * 90;
  }, { passive: true });

  (function raf(){
    if (!drag) { idle++; if (idle > 260 && !REDUCED) target -= .06; }   // rotation d'attente
    rot = lerp(rot, target + scrollRot, .085);
    cyl.style.transform = `translateZ(${-radius}px) rotateY(${rot}deg)`;
    setMeta();
    requestAnimationFrame(raf);
  })();
})();

/* ═══════ 10. BOUTIQUE ═══════ */
const state = { filter: 'Tout', shown: 8, favs: new Set(), cart: [] };
try {
  const raw = JSON.parse(localStorage.getItem('jina-cart') || '[]');
  /* on ne garde que des lignes valides : le catalogue a pu changer depuis */
  state.cart = Array.isArray(raw)
    ? raw.filter(l => l && PRODUCTS.some(p => p.id === l.id) && l.qty > 0)
    : [];
} catch { state.cart = []; }

(function shop(){
  const grid = $('#grid'), filters = $('#filters'), more = $('#loadMore');
  const cats = ['Tout', ...new Set(PRODUCTS.map(p => p.cat))];

  cats.forEach(c => {
    const b = document.createElement('button');
    b.textContent = c; b.dataset.cursor = c;
    b.classList.toggle('is-on', c === state.filter);
    b.addEventListener('click', () => {
      state.filter = c; state.shown = 8;
      $$('button', filters).forEach(x => x.classList.toggle('is-on', x === b));
      render();
    });
    filters.appendChild(b);
  });

  function list(){ return state.filter === 'Tout' ? PRODUCTS : PRODUCTS.filter(p => p.cat === state.filter); }

  function render(){
    const items = list().slice(0, state.shown);
    grid.innerHTML = '';
    items.forEach((p, i) => {
      const el = document.createElement('article');
      el.className = 'card';
      el.style.animationDelay = (i % 8) * 55 + 'ms';
      el.innerHTML = `
        <div class="card__vis">
          ${p.badge ? `<span class="card__badge">${p.badge}</span>` : ''}
          <button class="card__fav${state.favs.has(p.id) ? ' is-on' : ''}" aria-label="Ajouter aux favoris">♥</button>
          ${visualHTML(p)}
          <button class="card__quick" data-quick>Aperçu rapide</button>
        </div>
        <div class="card__body">
          <div><h3 class="card__name">${p.name}</h3><span class="card__cat">${p.cat}</span></div>
          <span class="card__price">${prix(p.price)}</span>
        </div>
        <div class="card__dots">${p.dots.map(c => `<i style="background:${c}"></i>`).join('')}</div>`;

      el.querySelector('.card__fav').addEventListener('click', e => {
        e.stopPropagation();
        const on = state.favs.has(p.id);
        on ? state.favs.delete(p.id) : state.favs.add(p.id);
        e.currentTarget.classList.toggle('is-on', !on);
        toast(on ? 'Retiré des favoris' : '♥ Ajouté aux favoris');
      });
      el.querySelector('[data-quick]').addEventListener('click', e => { e.stopPropagation(); openModal(p); });
      el.addEventListener('click', () => openModal(p));
      tilt(el);
      grid.appendChild(el);
    });
    more.parentElement.classList.toggle('is-empty', state.shown >= list().length);
  }

  more.addEventListener('click', () => { state.shown += 8; render(); });
  render();
})();

/* inclinaison 3D au survol */
function tilt(el){
  if (!FINE || REDUCED) return;
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    el.style.transform = `perspective(900px) rotateY(${x * 11}deg) rotateX(${-y * 11}deg) translateY(-6px) scale(1.015)`;
  });
  el.addEventListener('pointerleave', () => el.style.transform = '');
}

/* ═══════ 11. LOOKBOOK ═══════ */
(function lookbook(){
  const rail = $('#lookRail'), bar = $('#lookBar');
  LOOKS.forEach(l => {
    const f = document.createElement('figure');
    f.className = 'look-item';
    f.innerHTML = visualHTML(l, { ratio: '3/4' }) + `<figcaption><h4>${l.name}</h4><small>${l.tag}</small></figcaption>`;
    rail.appendChild(f);
  });

  const upd = () => {
    const max = rail.scrollWidth - rail.clientWidth;
    bar.style.width = clamp(max > 0 ? rail.scrollLeft / max * 100 : 100, 8, 100) + '%';
  };
  rail.addEventListener('scroll', upd, { passive: true });
  addEventListener('resize', upd); upd();

  /* glisser à la souris */
  let d = null;
  rail.addEventListener('pointerdown', e => {
    if (!FINE) return;
    d = { x: e.clientX, l: rail.scrollLeft }; rail.classList.add('is-drag');
  });
  addEventListener('pointermove', e => { if (d) rail.scrollLeft = d.l - (e.clientX - d.x) * 1.4; });
  addEventListener('pointerup', () => { d = null; rail.classList.remove('is-drag'); });

  /* molette verticale → défilement horizontal */
  rail.addEventListener('wheel', e => {
    if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
    const max = rail.scrollWidth - rail.clientWidth;
    if ((rail.scrollLeft <= 0 && e.deltaY < 0) || (rail.scrollLeft >= max - 1 && e.deltaY > 0)) return;
    e.preventDefault(); rail.scrollLeft += e.deltaY;
  }, { passive: false });
})();

/* ═══════ 12. MUR D'AVIS ═══════ */
(function wall(){
  const g = $('#wallGrid');
  NOTES.forEach((n, i) => {
    const el = document.createElement('blockquote');
    el.className = 'note';
    el.innerHTML = `<p>« ${n.t} »</p><b>${n.a} — <span>${'★'.repeat(n.s)}</span></b>`;
    g.appendChild(el);
    reveal(el, i * 70);
  });
})();

/* ═══════ 13. APERÇU RAPIDE ═══════ */
let modalPick = { size: 'M', color: 0, product: null };

function openModal(p){
  modalPick = { size: 'M', color: 0, product: p };
  $('#modalVisual').innerHTML = visualHTML(p);
  $('#modalCat').textContent   = p.cat;
  $('#modalName').textContent  = p.name;
  $('#modalPrice').textContent = prix(p.price);
  $('#modalDesc').textContent  = p.desc;

  const sw = $('#modalSwatches'); sw.innerHTML = '';
  p.dots.forEach((c, i) => {
    const b = document.createElement('i');
    b.style.background = c; b.className = i === 0 ? 'is-on' : '';
    b.setAttribute('role', 'button'); b.setAttribute('aria-label', 'Coloris ' + (i + 1));
    b.addEventListener('click', () => {
      modalPick.color = i;
      $$('i', sw).forEach(x => x.classList.toggle('is-on', x === b));
    });
    sw.appendChild(b);
  });

  const sz = $('#modalSizes'); sz.innerHTML = '';
  SIZES.forEach(s => {
    const b = document.createElement('button');
    b.textContent = s; b.classList.toggle('is-on', s === 'M');
    b.addEventListener('click', () => {
      modalPick.size = s;
      $$('button', sz).forEach(x => x.classList.toggle('is-on', x === b));
    });
    sz.appendChild(b);
  });

  $('#modal').classList.add('is-open');
  document.body.style.overflow = 'hidden';
}
function closeModal(){ $('#modal').classList.remove('is-open'); document.body.style.overflow = ''; }
$$('#modal [data-close]').forEach(b => b.addEventListener('click', closeModal));
$('#modalAdd').addEventListener('click', () => {
  addToCart(modalPick.product, modalPick.size, modalPick.color);
  closeModal();
});
addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  closeModal(); closeCart();
});

/* ═══════ 14. PANIER ═══════ */
function saveCart(){ try { localStorage.setItem('jina-cart', JSON.stringify(state.cart)); } catch {} }

function addToCart(p, size, color){
  const key = p.id + '|' + size + '|' + color;
  const hit = state.cart.find(l => l.key === key);
  hit ? hit.qty++ : state.cart.push({ key, id: p.id, size, color, qty: 1 });
  saveCart(); renderCart();
  toast(`${p.name} · taille ${size} ajoutée`);
}

function renderCart(){
  const box = $('#cartItems');
  const total = state.cart.reduce((s, l) => s + PRODUCTS.find(p => p.id === l.id).price * l.qty, 0);
  const count = state.cart.reduce((s, l) => s + l.qty, 0);
  $('#cartCount').textContent = count;
  $('#cartTotal').textContent = prix(total);

  if (!state.cart.length) {
    box.innerHTML = `<p class="drawer__empty">Votre panier est vide.<br>Il n'attend que de la couleur.</p>`;
    return;
  }
  box.innerHTML = '';
  state.cart.forEach(l => {
    const p = PRODUCTS.find(x => x.id === l.id);
    const el = document.createElement('div');
    el.className = 'line-item';
    el.innerHTML = `
      <div class="li-vis">${visualHTML(p)}</div>
      <div>
        <h6>${p.name}</h6>
        <small>Taille ${l.size} · coloris ${l.color + 1}</small>
        <div class="qty"><button data-m="-1" aria-label="Moins">−</button><span>${l.qty}</span><button data-m="1" aria-label="Plus">+</button></div>
      </div>
      <span class="li-price">${prix(p.price * l.qty)}</span>`;
    $$('button', el).forEach(b => b.addEventListener('click', () => {
      l.qty += +b.dataset.m;
      if (l.qty < 1) state.cart = state.cart.filter(x => x !== l);
      saveCart(); renderCart();
    }));
    box.appendChild(el);
  });
}
function openCart(){ $('#drawer').classList.add('is-open'); document.body.style.overflow = 'hidden'; }
function closeCart(){ $('#drawer').classList.remove('is-open'); document.body.style.overflow = ''; }
$('#cartBtn').addEventListener('click', openCart);
$$('[data-close-cart]').forEach(b => b.addEventListener('click', closeCart));
$('#checkout').addEventListener('click', () => {
  if (!state.cart.length) return toast('Ajoutez d\'abord une pièce ✦');
  toast('Démo — le paiement n\'est pas branché');
});
renderCart();

/* ═══════ 15. NEWSLETTER ═══════ */
$('#newsForm').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('#newsEmail').value.trim(), msg = $('#newsMsg');
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  msg.textContent = ok ? '✦ Bienvenue. Vérifiez votre boîte mail.' : 'Vérifiez le format de votre adresse.';
  if (ok) { $('#newsEmail').value = ''; toast('Inscription confirmée ✦'); }
});

/* ═══════ 16. TOAST ═══════ */
let toastT;
function toast(msg){
  const t = $('#toast');
  t.textContent = msg; t.classList.add('is-on');
  clearTimeout(toastT);
  toastT = setTimeout(() => t.classList.remove('is-on'), 2600);
}

/* ═══════ 17. ANCRES ═══════ */
$$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const t = $(a.getAttribute('href'));
  if (!t) return;
  e.preventDefault();
  const y = t.getBoundingClientRect().top + scrollY - 72;
  scrollTo({ top: y, behavior: REDUCED ? 'auto' : 'smooth' });
}));

})();
