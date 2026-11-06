(()=>{'use strict';const reduce=matchMedia('(prefers-reduced-motion: reduce)');if(!reduce.matches&&'IntersectionObserver'in window){document.documentElement.classList.add('motion');const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}const toast=document.createElement('div');toast.className='toast';toast.setAttribute('role','status');document.body.append(toast);let timer;function notify(text){toast.textContent=text;toast.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>toast.classList.remove('show'),4500)}window.demoNotify=notify;document.querySelectorAll('[data-toast]').forEach(el=>el.addEventListener('click',()=>notify(el.dataset.toast)));document.querySelectorAll('.menu-button').forEach(button=>button.addEventListener('click',()=>{const nav=document.getElementById(button.getAttribute('aria-controls'));const open=nav.classList.toggle('open');button.setAttribute('aria-expanded',String(open));button.textContent=open?'Закрыть ×':'Меню +'}));document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{a.closest('.mobile-nav').classList.remove('open');document.querySelector('.menu-button').setAttribute('aria-expanded','false');document.querySelector('.menu-button').textContent='Меню +'}));document.querySelectorAll('form[data-demo]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;const status=form.querySelector('.form-status');const message=form.dataset.message||'Готово! Это демонстрационная форма — данные никуда не отправлялись.';if(status)status.textContent=message;else notify(message);form.reset()}));const dialog=document.querySelector('dialog');if(dialog){
/* контент в обёртку (анимации листания не трогают сам <dialog>), стрелки и счётчик — отдельно */
const wrap=document.createElement('div');wrap.className='dlg-body';while(dialog.firstChild)wrap.append(dialog.firstChild);dialog.append(wrap);
const all=[...document.querySelectorAll('[data-dialog]')];let list=all,cur=0;
const arrow=(cls,label,sym)=>{const b=document.createElement('button');b.type='button';b.className='dlg-nav '+cls;b.setAttribute('aria-label',label);b.textContent=sym;return b};
const prev=arrow('prev','Предыдущая карточка','‹'),next=arrow('next','Следующая карточка','›');
const counter=document.createElement('span');counter.className='dlg-count';counter.setAttribute('aria-hidden','true');
dialog.append(counter,prev,next);
const pos={q1:'left top',q2:'right top',q3:'left bottom',q4:'right bottom'};
const fill=dir=>{
const button=list[cur],q=button.dataset.q||'q1';
dialog.querySelector('h2').textContent=button.dataset.title||button.querySelector('h3')?.textContent||'Коллекция';
dialog.querySelector('.dialog-copy').textContent=button.dataset.copy||'Вещь из новой коллекции. Выберите размер, чтобы посмотреть демонстрацию оформления.';
const price=dialog.querySelector('.dialog-price');if(price)price.textContent=button.dataset.price||'';
const tag=dialog.querySelector('.dialog-tag');if(tag)tag.textContent=button.dataset.tag||'';
const photo=dialog.querySelector('.dialog-photo,.modal-product');
if(photo){photo.className=(photo.classList.contains('modal-product')?'modal-product ':'dialog-photo ')+q;if(button.dataset.image)photo.style.backgroundImage='url('+button.dataset.image+')';photo.style.backgroundPosition=pos[q];photo.style.filter=button.dataset.tone||'';}
dialog.querySelectorAll('.size-list button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===1)));
counter.textContent=String(cur+1).padStart(2,'0')+' / '+String(list.length).padStart(2,'0');
prev.hidden=next.hidden=list.length<2;
wrap.classList.remove('swap-next','swap-prev');
if(dir){void wrap.offsetWidth;wrap.classList.add(dir>0?'swap-next':'swap-prev')}
};
const step=d=>{cur=(cur+d+list.length)%list.length;fill(d)};
prev.addEventListener('click',()=>step(-1));next.addEventListener('click',()=>step(1));
dialog.addEventListener('keydown',e=>{if(list.length<2)return;if(e.key==='ArrowRight'){e.preventDefault();step(1)}else if(e.key==='ArrowLeft'){e.preventDefault();step(-1)}});
let sx=null;dialog.addEventListener('touchstart',e=>{sx=e.touches[0].clientX},{passive:true});
dialog.addEventListener('touchend',e=>{if(sx===null||list.length<2)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>60)step(dx<0?1:-1)},{passive:true});
dialog.querySelector('.close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
all.forEach(button=>button.addEventListener('click',()=>{list=all.filter(t=>!t.closest('[hidden]'));cur=Math.max(0,list.indexOf(button));fill(0);dialog.showModal()}));
dialog.querySelectorAll('.size-list button').forEach(b=>b.addEventListener('click',()=>{dialog.querySelectorAll('.size-list button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)))}));
dialog.querySelector('.dialog-action')?.addEventListener('click',()=>{dialog.close();notify(document.body.classList.contains('sense')?'Это макет записи. Заявка никуда не отправлена.':'Выбор сохранён в демонстрации. Оплата не требуется.');const count=document.querySelector('[data-cart-count]');if(count)count.textContent=String(Number(count.textContent)+1)});}document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{const group=button.closest('[data-filters]');group?.querySelectorAll('button').forEach(b=>{b.setAttribute('aria-pressed',String(b===button));b.classList.toggle('active',b===button)});const type=button.dataset.filter;document.querySelectorAll('[data-category]').forEach(card=>{card.hidden=type!=='all'&&card.dataset.category!==type});}));window.addEventListener('beforeprint',()=>document.querySelectorAll('.reveal').forEach(x=>x.classList.add('visible')));})();