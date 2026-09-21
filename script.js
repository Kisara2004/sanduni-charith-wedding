(() => {
 const entrance=document.getElementById('entrance'),main=document.getElementById('invitation'),enter=document.getElementById('enter'),music=document.getElementById('music'),musicToggle=document.getElementById('musicToggle');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let revealed=false;
 function updateMusic(){musicToggle.textContent=music.paused?'♪':'Ⅱ';musicToggle.setAttribute('aria-label',music.paused?'Play music':'Pause music');}
 function reveal(){if(revealed)return;revealed=true;music.volume=.4;entrance.classList.add('hidden');entrance.inert=true;main.inert=false;document.body.classList.remove('closed');document.body.classList.add('opening-revealed');musicToggle.hidden=false;document.querySelector('h1').setAttribute('tabindex','-1');document.querySelector('h1').focus({preventScroll:true});}
 const intro=document.getElementById('entranceVideo'),skip=document.getElementById('skipIntro');
 let finishing=false;
 function finishIntro(){
  if(finishing||revealed)return;finishing=true;intro.pause();skip.hidden=true;
  if(reduced.matches){reveal();return;}
  if(!main.animate){entrance.classList.add('departing');setTimeout(reveal,900);return;}
  document.body.classList.add('heart-opened');
  main.classList.add('heart-revealing');
  const width=main.clientWidth,height=main.clientHeight;
  const outline=[];
  for(let i=0;i<64;i++){const t=i*Math.PI*2/64;outline.push([16*Math.pow(Math.sin(t),3)/17,-(13*Math.cos(t)-5*Math.cos(2*t)-2*Math.cos(3*t)-Math.cos(4*t))/17]);}
  function heart(radius){
   const points=outline.map(([x,y])=>`${(width/2+x*radius).toFixed(2)}px ${(height/2+y*radius).toFixed(2)}px`);
   return `polygon(${points.join(',')})`;
  }
  function contains(x,y){let inside=false;for(let i=0,j=outline.length-1;i<outline.length;j=i++){const [xi,yi]=outline[i],[xj,yj]=outline[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)inside=!inside;}return inside;}
  // Include the top midpoint: the heart's notch is deeper than its corners.
  const edgePoints=[[-width/2,-height/2],[0,-height/2],[width/2,-height/2],[-width/2,height/2],[width/2,height/2]];
  let low=0,high=Math.hypot(width,height)*4;
  for(let i=0;i<20;i++){const radius=(low+high)/2;if(edgePoints.every(([x,y])=>contains(x/radius,y/radius)))high=radius;else low=radius;}
  const frames=[{clipPath:heart(1)},{clipPath:heart(high*1.015)}];
  let completed=false;
  function complete(){if(completed)return;completed=true;entrance.classList.add('heart-finished');reveal();main.classList.remove('heart-revealing');}
  try {const animation=main.animate(frames,{duration:1250,easing:'cubic-bezier(.22,.55,.38,1)',fill:'both'});animation.finished.then(()=>{complete();animation.cancel();}).catch(complete);setTimeout(()=>{complete();animation.cancel();},1500);}
  catch {complete();}
 }
 intro.addEventListener('ended',finishIntro);
 intro.addEventListener('error',finishIntro);
 skip.addEventListener('click',finishIntro);
 enter.addEventListener('click',()=>{enter.disabled=true;music.volume=.4;music.play().then(updateMusic).catch(updateMusic);
  if(window.weddingIntroVideo){intro.src=window.weddingIntroVideo;intro.hidden=false;intro.muted=true;entrance.classList.add('playing');skip.hidden=false;skip.focus();intro.play().catch(finishIntro);}
  else {entrance.classList.add('departing');setTimeout(reveal,reduced.matches?0:1800);}
 });
 musicToggle.addEventListener('click',()=>{if(music.paused)music.play().then(updateMusic).catch(updateMusic);else{music.pause();updateMusic();}});
 const target=Date.parse('2026-11-19T10:00:00+05:30');function tick(){const diff=Math.max(0,target-Date.now());const values={days:Math.floor(diff/86400000),hours:Math.floor(diff/3600000)%24,minutes:Math.floor(diff/60000)%60,seconds:Math.floor(diff/1000)%60};for(const [id,v]of Object.entries(values))document.getElementById(id).textContent=String(v).padStart(2,'0');}tick();setInterval(tick,1000);
 if('IntersectionObserver'in window&&!reduced.matches){document.body.classList.add('motion-ready');const observer=new IntersectionObserver(items=>items.forEach(item=>{if(item.isIntersecting){item.target.classList.add('visible');observer.unobserve(item.target);}}),{threshold:.06});document.querySelectorAll('.heading,.story-panel,.event-card,.countdown,.venue-panel,footer').forEach(el=>{el.classList.add('reveal');observer.observe(el);});}

})();
