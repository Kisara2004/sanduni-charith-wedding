(() => {
 const layer=document.createElement('div');layer.className='petal-layer';layer.setAttribute('aria-hidden','true');
 for(let i=0;i<12;i++){
  const petal=document.createElement('span');
  petal.className='falling-petal';
  petal.style.cssText=`--left:${5+(i*37)%90}%;--size:${16+(i*7)%13}px;--duration:${14+(i*3)%9}s;--delay:${-i*1.9}s;--sway:${i%2?'-':' '}${18+(i*11)%32}px;--turn:${i*47}deg`;
  layer.append(petal);
 }
 document.body.append(layer);
 const button=document.createElement('button');button.className='petal-toggle';button.type='button';button.textContent='❀';button.hidden=true;document.body.append(button);
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');let enabled=!reduced.matches;
 function sync(){const opened=document.body.classList.contains('opening-revealed');button.hidden=!opened;button.setAttribute('aria-label',enabled?'Pause falling petals':'Show falling petals');button.setAttribute('aria-pressed',String(enabled));layer.classList.toggle('petals-running',opened&&enabled&&!document.hidden);layer.classList.toggle('petals-hidden',!opened||!enabled);}
 button.addEventListener('click',()=>{enabled=!enabled;sync();});
 reduced.addEventListener('change',()=>{enabled=!reduced.matches;sync();});
 document.addEventListener('visibilitychange',sync);
 new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});sync();
})();
