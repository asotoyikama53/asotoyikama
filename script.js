/* ==== Ayarlar: kendi repo bilgilerin ==== */
const GH_OWNER  = "asotoyikama53";
const GH_REPO   = "asotoyikama";
const GH_BRANCH = "main";           // farklıysa değiştir
const IMAGES_DIR = "images";        // klasör adı

/* ==== Lightbox ==== */
const lb = document.querySelector('.lightbox');
const lbImg = document.querySelector('.lb-img');
const btnClose = document.querySelector('.lb-close');
const btnPrev  = document.querySelector('.lb-prev');
const btnNext  = document.querySelector('.lb-next');
let GALLERY = [];   // {src, alt}
let idx = 0;

function openLB(i){
  idx = i;
  lbImg.src = GALLERY[idx].src;
  lbImg.alt = GALLERY[idx].alt || "";
  lb.classList.add('open');
  lb.setAttribute('aria-hidden','false');
}
function closeLB(){
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden','true');
}
function step(d){
  if (GALLERY.length === 0) return;
  idx = (idx + d + GALLERY.length) % GALLERY.length;
  lbImg.src = GALLERY[idx].src;
  lbImg.alt = GALLERY[idx].alt || "";
}

btnClose.addEventListener('click', closeLB);
btnPrev .addEventListener('click', ()=>step(-1));
btnNext .addEventListener('click', ()=>step(1));
lb.addEventListener('click', (e)=>{ if(e.target===lb) closeLB(); });
window.addEventListener('keydown', (e)=>{
  if(e.key==='Escape') closeLB();
  if(!lb.classList.contains('open')) return;
  if(e.key==='ArrowLeft')  step(-1);
  if(e.key==='ArrowRight') step(1);
});

/* ==== Galeriyi GitHub API’den kur ==== */
async function buildGallery() {
  const grid = document.getElementById('gallery-grid');
  grid.innerHTML = '<div style="opacity:.6;padding:.5rem">Fotoğraflar yükleniyor…</div>';

  // GitHub Contents API: repo içeriğini listeler
  const apiUrl = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${IMAGES_DIR}?ref=${GH_BRANCH}`;

  try {
    const res = await fetch(apiUrl, { headers: { 'Accept': 'application/vnd.github+json' }});
    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const files = await res.json();

    // Yalnızca görsel uzantıları
    const exts = ['.jpg','.jpeg','.png','.webp','.gif','.JPG','.JPEG','.PNG','.WEBP','.GIF'];
    const images = files.filter(f => f.type === 'file' && exts.some(ext => f.name.endsWith(ext)));

    // Ham içerik URL’si (cdn de kullanılabilir: https://cdn.jsdelivr.net/gh/OWNER/REPO@BRANCH/path)
const toRaw = name =>
  `https://cdn.jsdelivr.net/gh/${GH_OWNER}/${GH_REPO}@${GH_BRANCH}/${IMAGES_DIR}/${encodeURIComponent(name)}`;

    // shop.jpg’i ilk sıraya almak istersen:
    images.sort((a,b)=>{
      if (a.name.toLowerCase()==='shop.jpg') return -1;
      if (b.name.toLowerCase()==='shop.jpg') return 1;
      return a.name.localeCompare(b.name,'tr');
    });

    GALLERY = images.map(f => ({ src: toRaw(f.name), alt: f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g,' ') }));

    // Grid’i bas
    grid.innerHTML = '';
    GALLERY.forEach((img, i) => {
      const el = document.createElement('img');
      el.className = 'thumb';
      el.loading = 'lazy';
      el.decoding = 'async';
      el.src = img.src;
      el.alt = img.alt;
      el.addEventListener('click', () => openLB(i));
      grid.appendChild(el);
    });

    if (GALLERY.length === 0) {
      grid.innerHTML = '<div style="opacity:.6;padding:.5rem">images/ klasöründe görsel bulunamadı.</div>';
    }
  } catch (err) {
    console.error(err);
    // Hata durumunda basit bir yedek (shop.jpg varsa)
    const fallback = `${IMAGES_DIR}/shop.jpg`;
    GALLERY = [{ src: fallback, alt: 'Dükkan' }];
    grid.innerHTML = '';
    const el = document.createElement('img');
    el.className = 'thumb';
    el.src = fallback;
    el.alt = 'Dükkan';
    el.addEventListener('click', () => openLB(0));
    grid.appendChild(el);

    // İsteğe bağlı: kullanıcıya küçük bir uyarı
    const warn = document.createElement('div');
    warn.style.cssText = 'opacity:.6;padding:.5rem';
    warn.textContent = 'Not: GitHub API sınırı nedeniyle tüm fotoğraflar listelenemedi.';
    grid.appendChild(warn);
  }
}

document.addEventListener('DOMContentLoaded', buildGallery);
