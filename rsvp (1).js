module.exports = async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed' });

  let body=request.body;
  if(typeof body==='string'){try{body=JSON.parse(body);}catch{return response.status(400).json({error:'Invalid request'});}}
  const { name, attendance, guests, website } = body || {};
  if (website) return response.status(200).json({ ok: true });
  if (typeof name!=='string' || !name.trim() || name.length>100 || !['Yes', 'No'].includes(attendance)) {
    return response.status(400).json({ error: 'Please provide your name and attendance.' });
  }

  const guestCount=attendance==='No'?0:Number(guests);
  if(!Number.isInteger(guestCount)||guestCount<0||guestCount>8||(attendance==='Yes'&&guestCount<1))return response.status(400).json({error:'Please enter a valid guest count.'});
  // Public responder fields, not account credentials. Keep these in sync if the Google Form changes.
  const endpoint='https://docs.google.com/forms/d/e/1FAIpQLScZNRArecbu6WabiXaduVYREOz8LuyMFezhl4p8zzd0g6rJOQ/formResponse?hl=en';

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal:AbortSignal.timeout(15000),
      body:new URLSearchParams({'entry.1810788290':name.trim(),'entry.214290826':attendance,'entry.1940857439':String(guestCount)})
    });
    const confirmation=await upstream.text();
    if (!upstream.ok || !confirmation.includes('Your response has been recorded.')) throw new Error('Google did not confirm the response');
    return response.status(200).json({ ok: true });
  } catch {
    return response.status(502).json({ error: 'Could not save RSVP.' });
  }
}
