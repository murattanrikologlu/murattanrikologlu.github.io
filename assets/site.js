/* Murat Tanrikologlu — site script: app data, DOM rendering, scroll state for the 3D scene. */
(function () {
  'use strict';

  var APPS = [
    { slug: 'cinora', name: 'Cinora', full: 'AI Video Generator', cat: 'Photo & Video',
      tagline: 'Cinematic video from a text prompt or a single photo. No editing skills needed.',
      id: '6756228121', rating: 4.7, ratings: 18, color: '#6d5dff', live: true,
      socials: { Instagram: 'https://www.instagram.com/cinoraapp', TikTok: 'https://www.tiktok.com/@cinoraapp' } },
    { slug: 'groovr', name: 'Groovr', full: 'AI Song Generator', cat: 'Music',
      tagline: 'Describe a song and get a full track with beats, melody and vocals.',
      id: '6757434891', rating: 4.2, ratings: 17, color: '#8b5cf6', live: true },
    { slug: 'pixartia', name: 'Pixartia', full: 'AI Photo Editor', cat: 'Graphics & Design',
      tagline: 'Turn a selfie into a photoshoot with face swap, caricature, anime and Y2K looks.',
      id: '6754553236', rating: 4.5, ratings: 6, color: '#ff2d8f', live: true,
      socials: { Instagram: 'https://www.instagram.com/photorithmapp', TikTok: 'https://www.tiktok.com/@photorithmapp' } },
    { slug: 'vidox', name: 'Vidox', full: 'AI Product Video & Photo', cat: 'Graphics & Design',
      tagline: 'Studio grade product photos and ad videos from a single shot of your product.',
      id: '6772935863', rating: 0, ratings: 1, color: '#c8f542', live: true },
    { slug: 'wishara', name: 'Wishara', full: 'Manifest Anything', cat: 'Health & Fitness',
      tagline: 'Daily affirmations and personalized audio stories for the life you want.',
      id: '6770032133', rating: 0, ratings: 0, color: '#e8b85a', live: true },
    { slug: 'qrax', name: 'QRax', full: 'QR Code Generator', cat: 'Utilities',
      tagline: 'Design, scan and export print ready QR codes as SVG, PDF or PNG.',
      id: '6807021842', rating: 0, ratings: 0, color: '#2f7ef7', live: true },
    { slug: 'lorvo', name: 'Lorvo', full: 'Live Translator', cat: 'Productivity',
      tagline: 'Live conversation translation. It listens, translates and speaks for you.',
      id: '6809413066', rating: 0, ratings: 0, color: '#1f5eff', live: false }
  ];
  window.APPS = APPS;

  function storeUrl(a) { return 'https://apps.apple.com/app/id' + a.id; }
  function el(tag, attrs, children) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'text') n.textContent = attrs[k];
      else n.setAttribute(k, attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function stars(r) { var full = Math.round(r), s = ''; for (var i = 0; i < 5; i++) s += i < full ? '★' : '☆'; return s; }
  function ratingNode(a) {
    if (!a.live || a.ratings < 5) return null;
    return el('span', { class: 'rating' }, [
      el('span', { class: 'stars', text: stars(a.rating), 'aria-hidden': 'true' }),
      el('b', { text: a.rating.toFixed(1) }),
      el('span', { text: '(' + a.ratings + ' ratings)' })
    ]);
  }
  function badgeNode(a, h) {
    if (a.live) return el('a', { class: 'badge', href: storeUrl(a), target: '_blank', rel: 'noopener', 'aria-label': 'Download ' + a.name + ' on the App Store' },
      [el('img', { src: 'assets/appstore-badge.svg', alt: 'Download on the App Store', width: String(Math.round(h * 2.99)), height: String(h) })]);
    return el('span', { class: 'pill' }, [el('i'), 'In review on the App Store']);
  }

  /* ---- Hero icon row ---- */
  var iconRow = document.getElementById('icon-row');
  if (iconRow) APPS.forEach(function (a) {
    var node = el(a.live ? 'a' : 'span', { style: '--bc:' + a.color, title: a.name + (a.live ? '' : ' (in review)') },
      [el('img', { src: 'assets/icons/' + a.slug + '.png', alt: a.name, width: '92', height: '92' })]);
    if (a.live) { node.href = storeUrl(a); node.target = '_blank'; node.rel = 'noopener'; }
    iconRow.appendChild(node);
  });

  /* ---- App bands ---- */
  var bands = document.getElementById('apps');
  if (bands) APPS.forEach(function (a, i) {
    bands.appendChild(el('section', { class: 'band', 'data-color': a.color, style: '--bc:' + a.color, id: 'app-' + a.slug }, [
      el('div', { class: 'wrap band-inner' }, [
        el('div', { class: 'band-icon' }, [el('img', { src: 'assets/icons/' + a.slug + '.png', alt: '', width: '260', height: '260' })]),
        el('div', {}, [
          el('div', { class: 'band-num', text: String(i + 1).padStart(2, '0') + ' / ' + String(APPS.length).padStart(2, '0') }),
          el('h3', { text: a.name }),
          el('small', { text: a.full + ' · ' + a.cat }),
          el('p', { class: 'lead', text: a.tagline }),
          el('div', { class: 'band-meta' }, [badgeNode(a, 44), ratingNode(a)])
        ])
      ])
    ]));
  });

  /* ---- Lineup list ---- */
  var list = document.getElementById('list');
  if (list) APPS.forEach(function (a) {
    var row = el(a.live ? 'a' : 'div', { class: 'row' });
    if (a.live) { row.href = storeUrl(a); row.target = '_blank'; row.rel = 'noopener'; }
    row.appendChild(el('img', { src: 'assets/icons/' + a.slug + '.png', alt: '', loading: 'lazy', width: '56', height: '56' }));
    row.appendChild(el('div', {}, [el('h3', { text: a.name }), el('div', { class: 'cat', text: a.full + ' · ' + a.cat })]));
    row.appendChild(el('div', { class: 'cell-rating' }, [ratingNode(a) || el('span', { class: 'cat', text: a.live ? 'Free with optional subscription' : 'Coming soon' })]));
    row.appendChild(el('div', { class: 'cell-badge' }, [a.live
      ? el('span', { class: 'badge' }, [el('img', { src: 'assets/appstore-badge.svg', alt: 'Download on the App Store', width: '108', height: '36' })])
      : el('span', { class: 'pill' }, [el('i'), 'In review'])]));
    list.appendChild(row);
  });

  /* ---- Legal table, footer lists ---- */
  var legal = document.getElementById('legal');
  if (legal) APPS.forEach(function (a) {
    var prefix = a.slug === 'pixartia' ? 'aiphotoeditor' : a.slug;
    var right = el('td', {}, [el('a', { href: prefix + '-privacypolicy.index.html', text: 'Privacy' }), el('a', { href: prefix + '-termofuse.index.html', text: 'Terms' })]);
    if (a.live) right.insertBefore(el('a', { href: storeUrl(a), target: '_blank', rel: 'noopener', text: 'App Store' }), right.firstChild);
    legal.appendChild(el('tr', {}, [el('td', {}, [el('img', { src: 'assets/icons/' + a.slug + '.png', alt: '', loading: 'lazy' }), a.name]), right]));
  });
  var footApps = document.getElementById('foot-apps');
  if (footApps) APPS.forEach(function (a) {
    footApps.appendChild(el('li', {}, [a.live ? el('a', { href: storeUrl(a), target: '_blank', rel: 'noopener', text: a.name }) : el('span', { text: a.name + ' (in review)' })]));
  });
  var footSocial = document.getElementById('foot-social');
  if (footSocial) APPS.forEach(function (a) {
    if (!a.socials) return;
    Object.keys(a.socials).forEach(function (k) {
      footSocial.appendChild(el('li', {}, [el('a', { href: a.socials[k], target: '_blank', rel: 'noopener', text: a.name + ' on ' + k })]));
    });
  });

  /* ---- Nav ---- */
  var nav = document.getElementById('nav'), toggle = document.getElementById('nav-toggle'), links = document.getElementById('nav-links');
  function onScrollNav() { nav.classList.toggle('is-scrolled', window.scrollY > 40); }
  window.addEventListener('scroll', onScrollNav, { passive: true }); onScrollNav();
  if (toggle) toggle.addEventListener('click', function () {
    var open = links.classList.toggle('is-open'); toggle.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', open);
    nav.classList.toggle('is-open', open); document.body.classList.toggle('menu-open', open);
  });
  function closeMenu() { links.classList.remove('is-open'); nav.classList.remove('is-open'); document.body.classList.remove('menu-open'); if (toggle) { toggle.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); } }
  function scrollToY(y) { if (window.__lenis) window.__lenis.scrollTo(y); else window.scrollTo({ top: y, behavior: 'smooth' }); }
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var t = document.querySelector(a.getAttribute('href')); if (!t) return;
      e.preventDefault(); closeMenu();
      scrollToY(t.getBoundingClientRect().top + window.scrollY - 8);
    });
  });

  /* ---- Ambient colour follows the band in view ---- */
  var root = document.documentElement;
  var bandEls = bands ? Array.prototype.slice.call(bands.children) : [];
  var currentColor = APPS[0].color;
  function setColor(c) { if (c === currentColor) return; currentColor = c; root.style.setProperty('--c', c); }
  function updateColor() {
    var probe = window.innerHeight * 0.55, chosen = null;
    bandEls.forEach(function (b) { var r = b.getBoundingClientRect(); if (r.top <= probe && r.bottom > probe) chosen = b; });
    setColor(chosen ? chosen.getAttribute('data-color') : APPS[0].color);
  }
  window.addEventListener('scroll', updateColor, { passive: true }); updateColor();

  /* ---- Motion (GSAP optional) ---- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') { root.classList.add('reduced'); return; }
  gsap.registerPlugin(ScrollTrigger);
  if (typeof Lenis !== 'undefined' && window.matchMedia('(pointer: fine)').matches) {
    var lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    window.__lenis = lenis;
    lenis.on('scroll', function () { ScrollTrigger.update(); updateColor(); });
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }
  gsap.utils.toArray('[data-reveal]').forEach(function (n) {
    gsap.to(n, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: n, start: 'top 88%', once: true } });
  });
  gsap.from('#icon-row > *', { opacity: 0, y: 18, scale: 0.9, stagger: 0.06, duration: 0.8, ease: 'power3.out', delay: 0.2, clearProps: 'transform,opacity' });
  // each band: content slides in; the band underneath scales back as the next one covers it
  bandEls.forEach(function (b, i) {
    var inner = b.querySelector('.band-inner');
    gsap.fromTo(inner.children, { opacity: 0, y: 30 }, { opacity: 1, y: 0, stagger: 0.08, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: b, start: 'top 70%', toggleActions: 'play none none reverse' } });
    if (bandEls[i + 1]) {
      gsap.to(inner, { scale: 0.92, opacity: 0.25, ease: 'none',
        scrollTrigger: { trigger: bandEls[i + 1], start: 'top bottom', end: 'top top', scrub: true } });
    }
  });
  if (list) gsap.from('#list .row', { opacity: 0, y: 16, stagger: 0.05, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: list, start: 'top 82%', once: true } });
})();
