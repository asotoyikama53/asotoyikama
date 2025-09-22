// Lightbox basit mantık (grid küçük resimlerden açılır)
const thumbs = Array.from(document.querySelectorAll('.thumb'));
const lb = document.querySelector('.lightbox');
const lbImg = document.querySelector('.lb-img');
const lbClose = document.querySelector('.lb-close');
const lbPrev = document.querySelector('.lb-prev');
const lbNext = document.querySelector('.lb-next');

let i = 0;
function openLB(index){
  i = index;
  lbImg.src = thumbs[i].dataset.full || thumbs[i].src;
  lbImg.alt = thumbs[i].alt || '';
  lb.classList.add('open');
  lb.setAttribute('aria-hidden','false');
}
function closeLB(){ lb.classList.remove('open'); lb.setAttribute('aria-hidden','true'); }
function step(d){
  i = (i + d + thumbs.length) % thumbs.length;
  lbImg.src = thumbs[i].dataset.full || thumbs[i].src;
  lbImg.alt = thumbs[i].alt || '';
}

thumbs.forEach((t,idx)=>t.addEventListener('click',()=>openLB(idx)));
lbClose.addEventListener('click', closeLB);
lbPrev.addEventListener('click', ()=>step(-1));
lbNext.addEventListener('click', ()=>step(1));
lb.addEventListener('click', (e)=>{ if(e.target===lb) closeLB(); });
window.addEventListener('keydown', (e)=>{
  if(e.key==='Escape') closeLB();
  if(!lb.classList.contains('open')) return;
  if(e.key==='ArrowLeft') step(-1);
  if(e.key==='ArrowRight') step(1);
});
