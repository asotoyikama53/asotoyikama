/* ============ Ayarlar ============ */
const GH_OWNER   = "asotoyikama53";
const GH_REPO    = "asotoyikama";
const GH_BRANCH  = "main";
const IMAGES_DIR = "images";

/* ---- Sayfalama ---- */
const PAGE_SIZE = 12;      // yalnızca burayı değiştirmen yeterli (6, 12, 18...)
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
    el.decoding    = '
