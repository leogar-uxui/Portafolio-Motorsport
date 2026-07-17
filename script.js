/* ============================================================
   DATOS DE GALERÍAS
   ------------------------------------------------------------
   Edita este arreglo para agregar tus eventos reales.
   - cover: portada de la tarjeta en la sección "Galerías"
   - photos: todas las fotos de esa galería (masonry + lightbox)
   Pon tus archivos reales en una carpeta "img/" junto a este
   archivo y solo cambia las rutas de abajo. Si una ruta no
   existe todavía, se muestra automáticamente un placeholder.
   Duplica un objeto completo del arreglo para agregar un evento
   nuevo.
   ============================================================ */
const EVENTS = [
  {
    id: 'time-attack-julio-2025',
    tag: 'Time Attack',
    title: 'Time Attack — Julio 2025',
    date: 'Julio 2025',
    location: 'Autódromo · CDMX',
    cover: 'img/time-attack/cover.jpg',
    photos: [
      'img/time-attack/01.jpg','img/time-attack/02.jpg','img/time-attack/03.jpg',
      'img/time-attack/04.jpg','img/time-attack/05.jpg','img/time-attack/06.jpg',
    ]
  },
  {
    id: 'copa-turismo-marzo-2025',
    tag: 'Turismos',
    title: 'Copa Turismo — Marzo 2025',
    date: 'Marzo 2025',
    location: 'Autódromo · CDMX',
    cover: 'img/copa-turismo/cover.jpg',
    photos: [
      'img/copa-turismo/01.jpg','img/copa-turismo/02.jpg','img/copa-turismo/03.jpg',
      'img/copa-turismo/04.jpg','img/copa-turismo/05.jpg',
    ]
  },
  {
    id: 'karting-nacional-enero-2025',
    tag: 'Karting',
    title: 'Karting Nacional — Enero 2025',
    date: 'Enero 2025',
    location: 'Kartódromo · CDMX',
    cover: 'img/karting/cover.jpg',
    photos: [
      'img/karting/01.jpg','img/karting/02.jpg','img/karting/03.jpg',
      'img/karting/04.jpg',
    ]
  },
];

/* ============================================================
   PLACEHOLDER HELPER
   ============================================================ */
function placeholderIconSVG(){
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="1.8"/><path d="M3 16l5-4 4 3 4-5 5 6"/></svg>';
}

function makeSmartImg(src, alt, ratio){
  // Devuelve un contenedor: intenta cargar la imagen real,
  // si falla (placeholder / archivo no existe aún) muestra
  // un bloque con el ícono y el nombre de archivo esperado.
  const wrap = document.createElement('div');
  wrap.style.position = 'relative';
  if(ratio) wrap.style.aspectRatio = ratio;

  const img = document.createElement('img');
  img.src = src;
  img.alt = alt || '';
  img.loading = 'lazy';
  img.style.width = '100%';
  img.style.height = ratio ? '100%' : 'auto';
  if(ratio) img.style.objectFit = 'cover';

  const ph = document.createElement('div');
  ph.className = 'ph-label';
  ph.innerHTML = placeholderIconSVG() + '<div>' + src.split('/').pop() + '</div>';

  img.addEventListener('error', () => {
    img.style.display = 'none';
    wrap.appendChild(ph);
  });

  wrap.appendChild(img);
  return wrap;
}

/* ============================================================
   RENDER — TARJETAS DE GALERÍA
   ============================================================ */
const galleryGrid = document.getElementById('galleryGrid');

EVENTS.forEach(ev => {
  const card = document.createElement('button');
  card.className = 'event-card';
  card.setAttribute('data-id', ev.id);

  const coverWrap = document.createElement('div');
  coverWrap.className = 'event-cover';
  coverWrap.appendChild(makeSmartImg(ev.cover, ev.title, '4/3'));

  const tagEl = document.createElement('span');
  tagEl.className = 'event-tag';
  tagEl.textContent = ev.tag;
  coverWrap.appendChild(tagEl);

  const countEl = document.createElement('span');
  countEl.className = 'event-count';
  countEl.textContent = ev.photos.length + ' fotos';
  coverWrap.appendChild(countEl);

  const body = document.createElement('div');
  body.className = 'event-body';
  body.innerHTML = `
    <div class="event-date">${ev.date}</div>
    <div class="event-title">${ev.title.split('—')[0].trim()}</div>
    <div class="event-loc">${ev.location}</div>
    <div class="event-open">Ver galería
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
    </div>
  `;

  card.appendChild(coverWrap);
  card.appendChild(body);
  card.addEventListener('click', () => openGallery(ev.id));
  galleryGrid.appendChild(card);
});

/* ============================================================
   NAVEGACIÓN SPA — VISTA DE GALERÍA
   ============================================================ */
const detailView   = document.getElementById('detailView');
const masonryGrid   = document.getElementById('masonryGrid');
const detailTag     = document.getElementById('detailTag');
const detailTagTop  = document.getElementById('detailTagTop');
const detailTitle   = document.getElementById('detailTitle');
const detailDate    = document.getElementById('detailDate');
const detailLoc     = document.getElementById('detailLoc');
const detailCount   = document.getElementById('detailCount');
const backBtn       = document.getElementById('backBtn');

let currentEvent = null;
let currentPhotoIndex = 0;

function openGallery(id, pushHistory = true){
  const ev = EVENTS.find(e => e.id === id);
  if(!ev) return;
  currentEvent = ev;

  detailTag.textContent = ev.tag;
  detailTagTop.textContent = ev.tag;
  detailTitle.textContent = ev.title;
  detailDate.textContent = ev.date;
  detailLoc.textContent = ev.location;
  detailCount.textContent = ev.photos.length + ' fotos';

  masonryGrid.innerHTML = '';
  ev.photos.forEach((src, i) => {
    const item = document.createElement('div');
    item.className = 'm-item';
    item.appendChild(makeSmartImg(src, ev.title + ' ' + (i+1)));
    item.addEventListener('click', () => openLightbox(i));
    masonryGrid.appendChild(item);
  });

  detailView.classList.add('open');
  document.body.classList.add('lock');
  window.scrollTo({top:0});
  masonryGrid.scrollTop = 0;
  detailView.scrollTop = 0;

  if(pushHistory) history.pushState({gallery: id}, '', '#/galeria/' + id);
}

function closeGallery(pushHistory = true){
  detailView.classList.remove('open');
  document.body.classList.remove('lock');
  currentEvent = null;
  if(pushHistory) history.pushState({}, '', window.location.pathname + window.location.search);
}

backBtn.addEventListener('click', () => closeGallery());

window.addEventListener('popstate', (e) => {
  const hash = window.location.hash;
  const match = hash.match(/^#\/galeria\/(.+)$/);
  if(match){
    openGallery(match[1], false);
  } else {
    closeGallery(false);
  }
});

// Abrir directo si la URL ya trae un hash de galería al cargar
(function initFromHash(){
  const match = window.location.hash.match(/^#\/galeria\/(.+)$/);
  if(match) openGallery(match[1], false);
})();

/* ============================================================
   LIGHTBOX
   ============================================================ */
const lightbox = document.getElementById('lightbox');
const lbImg    = document.getElementById('lbImg');
const lbClose  = document.getElementById('lbClose');
const lbPrev   = document.getElementById('lbPrev');
const lbNext   = document.getElementById('lbNext');

function openLightbox(index){
  if(!currentEvent) return;
  currentPhotoIndex = index;
  lbImg.src = currentEvent.photos[index];
  lbImg.alt = currentEvent.title + ' ' + (index+1);
  lightbox.classList.add('open');
}
function closeLightbox(){ lightbox.classList.remove('open'); }
function stepLightbox(dir){
  if(!currentEvent) return;
  const n = currentEvent.photos.length;
  currentPhotoIndex = (currentPhotoIndex + dir + n) % n;
  lbImg.src = currentEvent.photos[currentPhotoIndex];
}

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', () => stepLightbox(-1));
lbNext.addEventListener('click', () => stepLightbox(1));
lightbox.addEventListener('click', (e) => { if(e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', (e) => {
  if(lightbox.classList.contains('open')){
    if(e.key === 'Escape') closeLightbox();
    if(e.key === 'ArrowLeft') stepLightbox(-1);
    if(e.key === 'ArrowRight') stepLightbox(1);
  } else if(detailView.classList.contains('open')){
    if(e.key === 'Escape') closeGallery();
  }
});

/* ============================================================
   NAV — estado al hacer scroll + menú móvil
   ============================================================ */
const nav = document.getElementById('nav');
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

burger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ============================================================
   PARALLAX SUAVE EN EL HERO
   ============================================================ */
const parallaxEls = document.querySelectorAll('[data-parallax]');
let lastY = 0;
function updateParallax(){
  const y = window.scrollY;
  if(y < window.innerHeight * 1.2){
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.getAttribute('data-parallax'));
      el.style.transform = `translateY(${y * speed}px)`;
    });
  }
}
window.addEventListener('scroll', () => { updateParallax(); }, { passive: true });

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => io.observe(el));

document.getElementById('year').textContent = new Date().getFullYear();
