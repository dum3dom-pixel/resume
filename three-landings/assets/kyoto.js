(()=>{'use strict';
/* Колесо прокручивает коллекцию; на краях прокрутка страницы продолжается. */
const collectionTrack=document.querySelector('.k-more-track');
if(collectionTrack)collectionTrack.addEventListener('wheel',e=>{
  if(e.ctrlKey||!matchMedia('(hover:hover) and (pointer:fine)').matches||Math.abs(e.deltaX)>=Math.abs(e.deltaY))return;
  const unit=e.deltaMode===1?16:e.deltaMode===2?collectionTrack.clientWidth:1,delta=e.deltaY*unit;
  const max=collectionTrack.scrollWidth-collectionTrack.clientWidth,left=collectionTrack.scrollLeft;
  if((delta>0&&left<max-1)||(delta<0&&left>1)){e.preventDefault();collectionTrack.scrollLeft=Math.max(0,Math.min(max,left+delta))}
},{passive:false});
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fine=matchMedia('(hover:hover) and (pointer:fine)').matches;
const hero=$('.k-hero'),h1=$('.k-hero h1'),photo=$('.k-hero-photo');

/* заголовок: буквы падают по одной */
if(h1){
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
    }else if(c.nodeType===1&&c.tagName!=='BR')split(c);
  });
  split(h1);h1.classList.add('split');
  requestAnimationFrame(()=>requestAnimationFrame(()=>hero.classList.add('go')));
  setTimeout(()=>hero.classList.add('settled'),i*75+1500);
}

/* лепестки сакуры в hero */
if(hero){
  const edge=$('.k-edge',hero),frag=document.createDocumentFragment(),n=fine?18:9,rnd=(a,b)=>a+Math.random()*(b-a);
  for(let k=0;k<n;k++){
    const p=document.createElement('i');p.className='petal';p.setAttribute('aria-hidden','true');
    p.style.setProperty('--x',rnd(0,100).toFixed(1)+'%');
    p.style.setProperty('--s',rnd(8,17).toFixed(1)+'px');
    const d=rnd(9,18);
    p.style.setProperty('--d',d.toFixed(1)+'s');
    p.style.setProperty('--dl',(-rnd(0,d)).toFixed(1)+'s');
    p.style.setProperty('--dx',rnd(-140,200).toFixed(0)+'px');
    p.style.setProperty('--r',rnd(-720,720).toFixed(0)+'deg');
    frag.append(p);
  }
  hero.insertBefore(frag,edge);
  const setH=()=>hero.style.setProperty('--H',hero.offsetHeight+40+'px');
  setH();addEventListener('resize',setH);
}

/* индикатор прокрутки */
const bar=document.createElement('div');bar.className='k-progress';bar.setAttribute('aria-hidden','true');document.body.append(bar);

/* параллакс + скорость лент от скорости прокрутки */
const pItems=$$('[data-speed]'),tracks=$$('.k-marquee-track');
let lastY=scrollY,speed=0,queued=false;
const frame=()=>{
  queued=false;
  const y=scrollY,vh=innerHeight,doc=document.documentElement;
  bar.style.setProperty('--p',(y/Math.max(1,doc.scrollHeight-vh)).toFixed(4));
  if(hero&&y<hero.offsetHeight+100){
    if(photo)photo.style.transform='translate3d(0,'+Math.min(y*.12,40).toFixed(1)+'px,0)';
    if(h1)h1.style.translate='0 '+(y*.16).toFixed(1)+'px';
  }
  pItems.forEach(el=>{
    const parent=el.parentElement,r=parent.getBoundingClientRect();
    if(r.bottom<-250||r.top>vh+250)return;
    const d=r.top+r.height/2-vh/2;
    let t=-d*parseFloat(el.dataset.speed);
    if(el.hasAttribute('data-fit')){const m=r.height*.13;t=Math.max(-m,Math.min(m,t))}
    el.style.translate='0 '+t.toFixed(1)+'px';
  });
  const dy=Math.abs(y-lastY);lastY=y;
  speed=speed*.85+dy*.15;
  const rate=1+Math.min(speed*.3,6);
  tracks.forEach(t=>{const a=t.getAnimations()[0];if(a)a.playbackRate=rate});
  if(speed>.05)queue();
};
const queue=()=>{if(!queued){queued=true;requestAnimationFrame(frame)}};
addEventListener('scroll',queue,{passive:true});addEventListener('resize',queue);frame();

/* активный пункт бокового меню */
const links=new Map($$('.k-side-nav a[href^="#"]').map(a=>[a.getAttribute('href').slice(1),[]]));
$$('.k-side-nav a[href^="#"]').forEach(a=>links.get(a.getAttribute('href').slice(1)).push(a));
if('IntersectionObserver'in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;
    $$('.k-side-nav a.on').forEach(a=>a.classList.remove('on'));
    (links.get(e.target.id)||[]).forEach(a=>a.classList.add('on'));
  }),{rootMargin:'-40% 0px -50% 0px'});
  links.forEach((_,id)=>{const s=document.getElementById(id);if(s&&id!=='items')io.observe(s)});
}

/* десктоп: наклон товаров и курсор «смотреть» */
if(fine){
  const cur=document.createElement('div');cur.className='k-cursor';cur.setAttribute('aria-hidden','true');cur.textContent='смотреть';document.body.append(cur);
  document.addEventListener('pointermove',e=>{
    cur.style.transform='translate3d('+(e.clientX+18)+'px,'+(e.clientY+18)+'px,0)';
    cur.classList.toggle('on',!!(e.target.closest&&e.target.closest('.k-item')));
  },{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>cur.classList.remove('on'));
  $$('.k-item').forEach(b=>{
    const p=$('.k-item-photo',b);
    b.addEventListener('pointermove',e=>{
      const r=p.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      p.style.setProperty('--ry',(x*16).toFixed(1)+'deg');p.style.setProperty('--rx',(-y*16).toFixed(1)+'deg');
    });
    b.addEventListener('pointerleave',()=>{p.style.removeProperty('--rx');p.style.removeProperty('--ry')});
  });
}
})();
