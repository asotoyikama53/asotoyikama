/* ============ Repo bilgilerini KENDİ repona göre ayarla ============ */
const GH_OWNER  = "asotoyikama53";
const GH_REPO   = "asotoyikama";
const GH_BRANCH = "main";
const IMAGES_DIR = "images";

/* ===== Lightbox ===== */
const lb = document.querySelector('.lightbox');
const lbImg = document.querySelector('.lb-img');
const btnClose = document.querySelector('.lb-close');
const btnPrev  = document.querySelector('.lb-prev');
const btnNext  = document.querySelector('.lb-next');
let GALLERY = [];
let idx = 0;

function openLB(i){ idx=i; lbImg.src=GALLERY[idx].src; lbImg.alt=GALLERY[idx].alt||""; lb.classList.add('open'); lb.setAttribute('aria-hidden','false'); }
function closeLB(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); }
function step(d){ if(!GALLERY.length) return; idx=(idx+d+GALLERY.length)%GALLERY.length; lbImg.src=GALLERY[idx].src; lbImg.alt=GALLERY[idx].alt||""; }

btnClose.addEventListener('click', closeLB);
btnPrev.addEventListener('click', ()=>step(-1));
btnNext.addEventListener('click', ()=>step(1));
lb.addEventListener('click', e=>{ if(e.target===lb) closeLB(); });
window.addEventListener('keydown', e=>{
  if(e.key==='Escape') closeLB();
  if(!lb.classList.contains('open')) return;
  if(e.key==='ArrowLeft') step(-1);
  if(e.key==='ArrowRight') step(1);
});

/* ============ Galeriyi GitHub Contents API ile otomatik oluştur ============ */
async function buildGallery(){
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '<div class="muted">Fotoğraflar yükleniyor…</div>';

  const api = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${IMAGES_DIR}?ref=${GH_BRANCH}`;

  try{
    const r = await fetch(api, { headers: { 'Accept':'application/vnd.github+json' }});
    if(!r.ok) throw new Error(`GitHub API ${r.status}`);
    const files = await r.json();

    const exts = ['.jpg','.jpeg','.png','.webp','.gif','.JPG','.JPEG','.PNG','.WEBP','.GIF'];
    const imgs = files.filter(f => f.type==='file' && exts.some(ext => f.name.endsWith(ext)));

    // shop.jpg'i ilk sıraya al; diğerlerini ada göre sırala
    imgs.sort((a,b)=>{
      const A=a.name.toLowerCase(), B=b.name.toLowerCase();
      if(A==='shop.jpg') return -1;
      if(B==='shop.jpg') return 1;
      return A.localeCompare(B,'tr');
    });

    // Görsel URL (CDN önerilir)
    const toUrl = name => `https://cdn.jsdelivr.net/gh/${GH_OWNER}/${GH_REPO}@${GH_BRANCH}/${IMAGES_DIR}/${encodeURIComponent(name)}`;

    GALLERY = imgs.map(f => ({ src: toUrl(f.name), alt: f.name.replace(/\.[^.]+$/,'').replace(/[-_]/g,' ') }));

    grid.innerHTML = '';
    GALLERY.forEach((img, i) => {
      const el = document.createElement('img');
      el.className = 'thumb';
      el.loading = 'lazy';
      el.decoding = 'async';
      el.src = img.src;
      el.alt = img.alt;
      el.addEventListener('click', ()=>openLB(i));
      grid.appendChild(el);
    });

    if(!GALLERY.length){
      grid.innerHTML = '<div class="muted">images/ klasöründe görsel bulunamadı.</div>';
    }
  }catch(err){
    console.error(err);
    // Hata olursa en azından shop.jpg’i göster
    const fallback = `${IMAGES_DIR}/shop.jpg`;
    GALLERY = [{src:fallback, alt:'Dükkan'}];
    grid.innerHTML = '';
    const el = document.createElement('img');
    el.className = 'thumb';
    el.src = fallback;
    el.alt = 'Dükkan';
    el.addEventListener('click', ()=>openLB(0));
    grid.appendChild(el);

    const warn = document.createElement('div');
    warn.className = 'muted';
    warn.textContent = 'Not: GitHub API sınırı nedeniyle tüm fotoğraflar listelenemedi.';
    grid.appendChild(warn);
  }
}

document.addEventListener('DOMContentLoaded', buildGallery);
