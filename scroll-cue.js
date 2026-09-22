(() => {
  const cue = document.getElementById('scrollCue');
  const story = document.getElementById('story');
  if (!cue || !story) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let hasScrolled = window.scrollY > 72;
  let shown = false;
  let hideTimer;

  function hide() {
    cue.classList.remove('is-visible');
    cue.tabIndex = -1;
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => { cue.hidden = true; }, reduced.matches ? 0 : 560);
  }
  function show() {
    if (shown || hasScrolled || window.scrollY > 72) return;
    shown = true;
    cue.hidden = false;
    cue.tabIndex = 0;
    requestAnimationFrame(() => requestAnimationFrame(() => cue.classList.add('is-visible')));
  }
  function onReveal() {
    if (!document.body.classList.contains('opening-revealed')) return;
    observer.disconnect();
    setTimeout(show, reduced.matches ? 0 : 650);
  }
  const observer = new MutationObserver(onReveal);
  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  onReveal();

  window.addEventListener('scroll', () => {
    if (window.scrollY > 72) { hasScrolled = true; if (shown) hide(); }
  }, { passive: true });
  cue.addEventListener('click', () => {
    hasScrolled = true;
    hide();
    story.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' });
  });
})();