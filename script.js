// Basit slider + lightbox
const slidesWrap = document.querySelector('.hero-gallery .slides');
const slideEls = Array.from(document.querySelectorAll('.hero-gallery .slide'));
const prevBtn = document.querySelector('.hero-gallery .prev');
const nextBtn = document.querySelector('.hero-gallery .next');
const dotsWrap = document.querySelector('.hero-gallery .dots');

let idx = 0;

// Dots oluştur
slideEls.forEach((_, i) => {
  const b = document.createElement('button');
  if(i===0) b.classList.add('active');
  b.addEventListener('click', ()=>go(i));
  dotsWrap.appendChild(b);
});
const dotBtns = Array.from(dotsWrap.querySelectorAll('button'));

function go(i){
  idx = (i + slideEls.length) % slideEls.length;
  slidesWrap.style.transform = `translateX(-${idx*100}%)`;
  dotBtns.forEach((d,j)=>d.classList.toggle('active', j===idx));
}
prevBtn.addEventListener('click', ()=>go(idx-1));
nextBtn.addEventListener('click', ()=>go(idx+1));

// Otomatik geçiş istersen (yorum satırını aç)
// setInterval(()=>go(idx+1), 6000);

// LIGHTBOX
const lb = document.querySelector('.lightbox');
const lbImg = document.querySelector('.lb-img');
const lbClose = document.querySelector('.lb-close');
const lbPrev = document.querySelector('.lb-prev');
const lbNext = document.querySelector('.lb-next');

function openLB(i){
  go(i); // lightbox okları ile senkron olsun
  lbImg.src = slideEls[i].querySelector('img').src;
  lbImg.alt = slideEls[i].querySelector('img').alt || '';
  lb.classList.add('open');
  lb.setAttribute('aria-hidden','false');
}
function closeLB(){
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden','true');
}
function lbGo(delta){
  idx = (idx + delta + slideEls.length) % slideEls.length;
  lbImg.src = slideEls[idx].querySelector('img').src;
  lbImg.alt = slideEls[idx].querySelector('img').alt || '';
  go(idx);
}
slideEls.forEach((el,i)=>el.addEventListener('click', ()=>openLB(i)));
lbClose.addEventListener('click', closeLB);
lbPrev.addEventListener('click', ()=>lbGo(-1));
lbNext.addEventListener('click', ()=>lbGo(1));
// Dışarı tıklayınca kapat
lb.addEventListener('click', (e)=>{ if(e.target===lb) closeLB(); });
// ESC ile kapat
window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeLB(); if(!lb.classList.contains('open')) return;
  if(e.key==='ArrowLeft') lbGo(-1);
  if(e.key==='ArrowRight') lbGo(1);
});

// Swipe (mobil)
let startX=null;
slidesWrap.addEventListener('touchstart', e=>startX=e.touches[0].clientX);
slidesWrap.addEventListener('touchend', e=>{
  if(startX===null) return;
  const dx = e.changedTouches[0].clientX - startX;
  if(Math.abs(dx)>40) go(idx + (dx<0?1:-1));
  startX=null;
});
