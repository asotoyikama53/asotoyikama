/* ============ Ayarlar ============ */
const GH_OWNER   = "asotoyikama53";
const GH_REPO    = "asotoyikama";
const GH_BRANCH  = "main";
const IMAGES_DIR = "images";

/* ---- Sayfalama ---- */
const PAGE_SIZE = 12;      // İstediğin kadar: 6, 12, 18...
let currentPage = 0;
let totalPages  = 1;

/* ===== Lightbox ===== */
const lb       = document.querySelector('.lightbox');
const lbImg    = document.querySelector('.lb-img');
const btnClose = document.querySelector('.lb-close');
const btnPrev  = document.querySelector('.lb-prev');
const btnNext  = document.querySelector('.lb-next');
let GALLERY = [];
let idx = 0;

function openLB(i){
  idx = i;
  lbImg.src = GALLERY[idx].src;
  lbImg.alt = GALLERY[idx].alt || "";
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
}
function closeLB(){
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
}
function step(d){
  if(!GALLERY.length) return;
  idx = (idx + d + GALLERY.length) % GALLERY.length;
  lbImg.src = GALLERY[idx].src;
  lbImg.alt = GALLERY[idx].alt || "";
}
btnClose.addEventListener('click', closeLB);
btnPrev .addEventListener('click', ()=>step(-1));
btnNext .addEventListener('click', ()=>step(1));
lb.addEventListener('click', e=>{ if(e.target===lb) closeLB(); });
window.addEventListener('keydown', e=>{
  if(e.key==='Escape') closeLB();
  if(!lb.classList.contains('open')) return;
  if(e.key==='ArrowLeft')  step(-1);
  if(e.key==='ArrowRight') step(1);
});

/* ---- Grid'e bir sayfanın içeriğini bas ---- */
function renderPage(page){
  const grid   = document.getElementById('gallery-grid');
  const pgPrev = document.getElementById('pg-prev');
  const pgNext = document.getElementById('pg-next');
  const pgInfo = document.getElementById('pg-info');

  currentPage = Math.max(0, Math.min(page, totalPages - 1));

  const start = currentPage * PAGE_SIZE;
  const end   = Math.min(start + PAGE_SIZE, GALLERY.length);
  const slice = GALLERY.slice(start, end);

  grid.innerHTML = "";
  slice.forEach((img, i) => {
    const el = document.createElement('img');
    el.className   = 'thumb';
    el.loading     = 'lazy';
    el.decoding    = 'async';
    el.src         = img.src;
    el.alt         = img.alt;
    el.addEventListener('click', ()=>openLB(start + i));
    grid.appendChild(el);
  });

  pgInfo.textContent = `${currentPage + 1} / ${totalPages}`;
  pgPrev.disabled = currentPage === 0;
  pgNext.disabled = currentPage >= totalPages - 1;
}

/* ---- Galeriyi API'den çek ve sayfalamayı hazırla ---- */
async function buildGallery(){
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '<div class="muted">Fotoğraflar yükleniyor…</div>';

  const api = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${IMAGES_DIR}?ref=${GH_BRANCH}`;

  try{
    const r = await fetch(api, { headers: { 'Accept':'application/vnd.github+json' }});
    if(!r.ok) throw new Error(`GitHub API ${r.status}`);
    const files = await r.json();

    const exts = ['.jpg','.jpeg','.png','.webp','.gif','.JPG','.JPEG','.PNG','.WEBP','.GIF'];
    const imgs = files.filter(f => f.type === 'file' && exts.some(ext => f.name.endsWith(ext)));

    imgs.sort((a,b)=>{
      const A=a.name.toLowerCase(), B=b.name.toLowerCase();
      if (A==='shop.jpg') return -1;
      if (B==='shop.jpg') return 1;
      return A.localeCompare(B,'tr');
    });

    const toUrl = name => `https://cdn.jsdelivr.net/gh/${GH_OWNER}/${GH_REPO}@${GH_BRANCH}/${IMAGES_DIR}/${encodeURIComponent(name)}`;
    GALLERY = imgs.map(f => ({
      src: toUrl(f.name),
      alt: f.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ')
    }));

    totalPages = Math.max(1, Math.ceil(GALLERY.length / PAGE_SIZE));

    const pgPrev = document.getElementById('pg-prev');
    const pgNext = document.getElementById('pg-next');
    pgPrev.onclick = ()=> renderPage(currentPage - 1);
    pgNext.onclick = ()=> renderPage(currentPage + 1);

    renderPage(0);
  }catch(err){
    console.error(err);
    GALLERY = [{ src:`${IMAGES_DIR}/shop.jpg`, alt:'Dükkan'}];
    totalPages = 1;
    renderPage(0);
  }
}

document.addEventListener('DOMContentLoaded', buildGallery);
