(()=>{'use strict';
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const $=s=>[...document.querySelectorAll(s)];
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const hero=document.querySelector('.s-hero');
const shots=$('.s-shot').map((el,i)=>({el,d:[.5,.9,1.3,.7,1.1,1.5][i]||1}));
const grid=document.querySelector('.s-card-grid');
const cards=$('.s-dance-card').map((el,i)=>({el,k:[34,70,18,90][i%4],s:i%2?1:-1}));
const trail=$('.s-trail path').map(el=>({el,k:+el.dataset.k||1}));
const trailSvg=document.querySelector('.s-trail');
const photo=document.querySelector('.s-studio-photo');
const photoBox=document.querySelector('.s-studio-picture');
const band=document.querySelector('.s-marquee');
const gallery=document.querySelector('.s-gallery-window'),galleryItems=$('.s-gal-wrap');
const wide=document.querySelector('.s-wide'),wideImage=document.querySelector('.s-wide-image');
const bar=document.createElement('div');bar.className='s-progress';document.body.append(bar);
let mx=0,my=0,tx=0,ty=0,lastY=scrollY,skew=0,printing=false;
hero.addEventListener('pointermove',e=>{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
hero.addEventListener('pointerleave',()=>{mx=my=0});
addEventListener('beforeprint',()=>{printing=true;trail.forEach(({el})=>el.style.strokeDashoffset=0);shots.forEach(({el})=>el.style.transform='');cards.forEach(({el})=>{el.style.translate='';el.style.rotate=''});photo.style.transform='';band.style.transform='';galleryItems.forEach(el=>el.style.translate='');if(wideImage)wideImage.style.translate=''});
addEventListener('afterprint',()=>{printing=false});
function frame(){
  requestAnimationFrame(frame);
  if(printing||document.hidden)return;
  const y=scrollY,vh=innerHeight;
  const gridTop=grid.getBoundingClientRect().top;
  const trailTop=trailSvg.getBoundingClientRect().top;
  const photoRect=photoBox.getBoundingClientRect();
  tx+=(mx-tx)*.06;ty+=(my-ty)*.06;
  if(y<vh*1.3)shots.forEach(({el,d})=>{el.style.transform=`translate3d(${(-tx*d*28).toFixed(1)}px,${(-ty*d*22-y*d*.14).toFixed(1)}px,0)`});
  const p=clamp((vh*.92-trailTop)/(vh*.6),0,1);
  trail.forEach(({el,k})=>{el.style.strokeDashoffset=(1-clamp(p*k+(k<1?p-1:0),0,1)).toFixed(4)});
  cards.forEach(({el,k,s})=>{
    const c=gridTop+(el.offsetTop-grid.offsetTop)+el.offsetHeight/2;
    const d=clamp((c-vh/2)/vh,-1.2,1.2);
    el.style.translate=`0 ${(d*k).toFixed(1)}px`;
    el.style.rotate=`${(d*1.6*s).toFixed(2)}deg`;
  });
  const pp=clamp((photoRect.top+photoRect.height/2-vh/2)/vh,-1,1);
  photo.style.transform=`translateY(${(pp*-30).toFixed(1)}px) scale(1.15)`;
  if(gallery){
    const r=gallery.getBoundingClientRect(),mobile=innerWidth<=760;
    if(r.bottom>-200&&r.top<vh+200){
      const progress=clamp((vh/2-r.top-r.height/2)/(vh/2+r.height/2),-1,1),columns=mobile?2:3,range=mobile?40:120;
      galleryItems.forEach((el,i)=>{const direction=Math.floor(i/columns)%2?1:-1;el.style.translate=`${(progress*range*direction).toFixed(1)}px 0`});
    }
  }
  if(wide&&wideImage){
    const r=wide.getBoundingClientRect();
    if(r.bottom>-200&&r.top<vh+200){const progress=clamp((r.top+r.height/2-vh/2)/(vh/2+r.height/2),-1,1);wideImage.style.translate=`0 ${(-progress*r.height*.08).toFixed(1)}px`}
  }
  skew+=(clamp((y-lastY)*.3,-14,14)-skew)*.12;lastY=y;
  band.style.transform=`skewX(${skew.toFixed(2)}deg)`;
  const max=document.documentElement.scrollHeight-vh;
  bar.style.transform=`scaleX(${max>0?clamp(y/max,0,1):0})`;
}
frame();
})();
