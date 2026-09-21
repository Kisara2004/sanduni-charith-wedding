(() => {
 const tiles=[...document.querySelectorAll('.gallery-photo')],viewer=document.getElementById('photoViewer'),large=document.getElementById('largePhoto'),count=document.getElementById('photoCount');
 let current=0,previousOverflow='';
 function show(index){current=(index+tiles.length)%tiles.length;const photo=tiles[current].querySelector('img');large.src=photo.src;large.alt=photo.alt;count.textContent=`${current+1} / ${tiles.length}`;}
 tiles.forEach((tile,index)=>tile.addEventListener('click',()=>{show(index);previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';viewer.showModal();}));
 document.getElementById('closePhoto').onclick=()=>viewer.close();
 document.getElementById('previousPhoto').onclick=()=>show(current-1);
 document.getElementById('nextPhoto').onclick=()=>show(current+1);
 viewer.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;tiles[current].focus({preventScroll:true});});
 viewer.addEventListener('click',event=>{if(event.target===viewer)viewer.close();});
 viewer.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();show(current+1);}if(event.key==='ArrowLeft'){event.preventDefault();show(current-1);}});
 let startX=0,startY=0;
 large.addEventListener('touchstart',event=>{startX=event.changedTouches[0].clientX;startY=event.changedTouches[0].clientY;},{passive:true});
 large.addEventListener('touchend',event=>{const dx=event.changedTouches[0].clientX-startX,dy=event.changedTouches[0].clientY-startY;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy))show(current+(dx<0?1:-1));},{passive:true});
 const passage=document.querySelector('.photo-passage'),slides=[...passage.querySelectorAll('img')],pause=document.getElementById('pausePhotos'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let active=0,visible=false,paused=reduced.matches,timer;
 function sync(){clearInterval(timer);const running=visible&&!paused&&!document.hidden&&!viewer.open;passage.classList.toggle('is-playing',running);pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',paused?'Play photo slideshow':'Pause photo slideshow');pause.setAttribute('aria-pressed',String(paused));if(running)timer=setInterval(()=>{const next=(active+1)%slides.length;if(!slides[next].complete||!slides[next].naturalWidth)return;slides[active].classList.remove('active');slides[next].classList.add('active');active=next;},6500);}
 pause.onclick=()=>{paused=!paused;sync();};
 if('IntersectionObserver'in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;sync();},{threshold:.15}).observe(passage);else{visible=true;sync();}
 document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',()=>{paused=reduced.matches;sync();});
 viewer.addEventListener('close',sync);tiles.forEach(tile=>tile.addEventListener('click',sync));
})();
