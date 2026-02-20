// Tracker
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzznCqPuKcdIxMsAtrF7rCt3aJgfnbENdFEgZ1zI5ehc_oQvfmOAVHv9LvXGOUvp10DtA/exec';
fetch('https://ipapi.co/json/')
  .then(response => response.json())
  .then(data => {
	fetch(APPS_SCRIPT_URL, {
	  method: 'POST',
	  mode: 'no-cors',
	  headers: {
		'Content-Type': 'application/json',
	  },
	  body: JSON.stringify({
		ip: data.ip,
		country: data.country_name,
		city: data.city,
		region: data.region
	  })
	});
  })
.catch(error => console.log('Tracking error:', error));
 


// Typed text:
document.addEventListener('DOMContentLoaded', () => {
  const typedEl = document.querySelector('.typed');
  if (!typedEl) return;
  let typedStrings = typedEl.getAttribute('data-typed-items') || '';
  typedStrings = typedStrings.split(',').map(s => s.trim().replace(/&/g, '&amp;')).filter(Boolean);
  if (typeof Typed === 'undefined') {
    console.error('Typed.js is not loaded. Include typed.js before myscripts.js');
    return;
  }
  new Typed('.typed', {
    strings: typedStrings,
    loop: true,
    typeSpeed: 30,
    backSpeed: 5,
    backDelay: 1500
  });
});