(()=>{'use strict';
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const cover=$('.f-cover'),h1=$('.f-hero h1'),coverImg=$('.f-cover-image');

/* hero: подготовка рисуемых линий и разбивка заголовка на буквы */
$$('.f-oval path,.f-flame path,.walk-line path').forEach(p=>p.setAttribute('pathLength','1'));
if(cover&&h1){
  cover.classList.add('armed');
  let i=0;
  const split=node=>[...node.childNodes].forEach(c=>{
    if(c.nodeType===3){
      const f=document.createDocumentFragment();
      [...c.textContent].forEach(ch=>{
        if(!ch.trim()){f.append(ch);return}
        const s=document.createElement('span');
        s.className='ch';s.setAttribute('aria-hidden','true');s.style.setProperty('--i',i++);s.textContent=ch;f.append(s);
      });
      c.replaceWith(f);
    }else if(c.nodeType===1&&c.tagName!=='BR'&&c.tagName!=='svg')split(c);
  });
  split(h1);h1.classList.add('split');
  requestAnimationFrame(()=>requestAnimationFrame(()=>cover.classList.add('go')));
}

/* линия за моделью рисуется, когда блок виден */
const walk=$('.f-walk');
if(walk&&'IntersectionObserver'in window){
  walk.classList.add('armed');
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){walk.classList.add('draw');io.disconnect()}}),{threshold:.25});
  io.observe(walk);
}

/* индикатор прокрутки */
const bar=document.createElement('div');bar.className='f-progress';bar.setAttribute('aria-hidden','true');document.body.append(bar);

/* параллакс (через свойство translate, чтобы не конфликтовать с transform) + скорость лент от скорости скролла */
const pItems=$$('[data-speed]'),tracks=$$('.f-marquee-track');
let lastY=scrollY,speed=0,queued=false;
const frame=()=>{
  queued=false;
  const y=scrollY,vh=innerHeight,doc=document.documentElement;
  bar.style.setProperty('--p',(y/Math.max(1,doc.scrollHeight-vh)).toFixed(4));
  if(coverImg&&y<cover.offsetHeight+100)coverImg.style.translate='0 '+Math.min(y*.14,70).toFixed(1)+'px';
  pItems.forEach(el=>{
    const r=el.parentElement.getBoundingClientRect();
    if(r.bottom<-250||r.top>vh+250)return;
    const d=r.top+r.height/2-vh/2;
    el.style.translate='0 '+(-d*parseFloat(el.dataset.speed)).toFixed(1)+'px';
  });
  const dy=Math.abs(y-lastY);lastY=y;
  speed=speed*.85+dy*.15;
  const rate=1+Math.min(speed*.3,6);
  tracks.forEach(t=>{const a=t.getAnimations()[0];if(a)a.playbackRate=rate});
  if(speed>.05)queue();
};
const queue=()=>{if(!queued){queued=true;requestAnimationFrame(frame)}};
addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);frame();

/* «сумка»: подпрыгивает при добавлении вещи */
const cart=$('.f-cart');
$('dialog .dialog-action')?.addEventListener('click',()=>{
  if(!cart)return;cart.classList.remove('bump');void cart.offsetWidth;cart.classList.add('bump');
});

if(fine){
  /* курсор «смотреть» над карточками + наклон фото */
  const cur=document.createElement('div');cur.className='f-cursor';cur.setAttribute('aria-hidden','true');cur.textContent='смотреть';document.body.append(cur);
  document.addEventListener('pointermove',e=>{
    cur.style.transform='translate3d('+(e.clientX+18)+'px,'+(e.clientY+18)+'px,0)';
    cur.classList.toggle('on',!!(e.target.closest&&e.target.closest('.f-product')&&!document.querySelector('dialog[open]')));
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>cur.classList.remove('on'));
  $$('.f-product').forEach(b=>{
    const p=$('.f-product-photo',b);
    b.addEventListener('pointermove',e=>{
      const r=p.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      p.style.setProperty('--ry',(x*14).toFixed(1)+'deg');p.style.setProperty('--rx',(-y*14).toFixed(1)+'deg');
    });
    b.addEventListener('pointerleave',()=>{p.style.removeProperty('--rx');p.style.removeProperty('--ry')});
  });
  /* магнитные кнопки */
  $$('.line-arrow:not(.dialog-action)').forEach(a=>{
    a.addEventListener('pointermove',e=>{
      const r=a.getBoundingClientRect();
      a.style.translate=((e.clientX-r.left-r.width/2)*.18).toFixed(1)+'px '+((e.clientY-r.top-r.height/2)*.3).toFixed(1)+'px';
    });
    a.addEventListener('pointerleave',()=>{a.style.translate=''});
  });
}
})();
