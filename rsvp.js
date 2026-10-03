(() => {
  const form = document.getElementById('rsvpForm');
  if (!form) return;

  const status = document.getElementById('rsvpStatus');
  const submit = document.getElementById('rsvpSubmit');
  const decline=document.getElementById('rsvpDecline');
  form.querySelectorAll('[name="attendance"]').forEach(radio=>radio.addEventListener('change',()=>{
    decline.hidden=radio.value!=='No';
  }));
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){form.classList.add('rsvp-visible');observer.disconnect();}},{threshold:.12});observer.observe(form);}

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity() || form.elements.website.value) return;

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.guests=payload.attendance==='Yes'?1:0;
    submit.disabled = true;
    status.textContent = 'Sending your response…';
    status.dataset.state = '';

    try {
      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result=await response.json();
      if (!response.ok || result.ok !== true) throw new Error('RSVP could not be sent');
      form.reset();
      decline.hidden=true;
      status.textContent = 'Thank you. Your RSVP has been received with love.';
      status.dataset.state = 'success';
    } catch {
      status.textContent = 'We could not send your RSVP. Please try again shortly.';
      status.dataset.state = 'error';
    } finally {
      submit.disabled = false;
    }
  });
})();
