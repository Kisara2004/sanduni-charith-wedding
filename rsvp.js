(() => {
  const form = document.getElementById('rsvpForm');
  if (!form) return;

  const status = document.getElementById('rsvpStatus');
  const submit = document.getElementById('rsvpSubmit');
  const guests = document.getElementById('guests');
  const minus=document.getElementById('guestMinus'), plus=document.getElementById('guestPlus');
  const count=document.getElementById('rsvpCount'), decline=document.getElementById('rsvpDecline');
  function updateButtons(){minus.disabled=Number(guests.value)<=1;plus.disabled=Number(guests.value)>=20;}
  function step(amount){guests.value=String(Math.max(1,Math.min(20,(Number(guests.value)||1)+amount)));updateButtons();}
  minus.addEventListener('click',()=>step(-1));plus.addEventListener('click',()=>step(1));guests.addEventListener('input',updateButtons);updateButtons();
  form.querySelectorAll('[name="attendance"]').forEach(radio=>radio.addEventListener('change',()=>{
    const no=radio.value==='No';guests.disabled=no;count.hidden=no;decline.hidden=!no;
  }));
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){form.classList.add('rsvp-visible');observer.disconnect();}},{threshold:.12});observer.observe(form);}

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity() || form.elements.website.value) return;

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.guests=payload.attendance==='No'?0:Number(payload.guests);
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
      guests.disabled = false;
      guests.value = '1';
      count.hidden=false;decline.hidden=true;updateButtons();
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
