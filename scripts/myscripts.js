// Tracker
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzznCqPuKcdIxMsAtrF7rCt3aJgfnbENdFEgZ1zI5ehc_oQvfmOAVHv9LvXGOUvp10DtA/exec';
const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

function sendToSheet(ip, country, city, region) {
  fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: JSON.stringify({ ip, country, city, region })
  });
}

fetch('https://ipapi.co/json/')
  .then(response => response.json())
  .then(data => {
    if (data.error) {
      sendToSheet('', '', '', browserTimezone);
    } else {
      sendToSheet(data.ip || '', data.country_name || '', data.city || '', data.region || '');
    }
  })
  .catch(() => sendToSheet('', '', '', browserTimezone));



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

// Lazy-load below-the-fold background images.
document.addEventListener('DOMContentLoaded', () => {
  const lazyBackgrounds = document.querySelectorAll('[data-bg]');
  if (!lazyBackgrounds.length) return;

  const loadBackground = (element) => {
    element.style.backgroundImage = `url("${element.dataset.bg}")`;
    element.removeAttribute('data-bg');
  };

  if (!('IntersectionObserver' in window)) {
    lazyBackgrounds.forEach(loadBackground);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      loadBackground(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '400px 0px' });

  lazyBackgrounds.forEach((element) => observer.observe(element));
});

//  Automatically gets the current year to add at the end of the website
document.getElementById("year").textContent = new Date().getFullYear();

// Contact form — AJAX submission with in-page feedback
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const btn = document.getElementById('contact-submit');
  const feedback = document.getElementById('contact-feedback');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    btn.disabled = true;
    btn.textContent = 'Sending…';
    feedback.style.display = 'none';

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (res) {
        if (res.ok) {
          feedback.textContent = '✓ Message sent! I\'ll get back to you soon.';
          feedback.style.background = '#e6f9f0';
          feedback.style.color = '#1a7a4a';
          feedback.style.border = '1px solid #a3d9be';
          form.reset();
          btn.textContent = 'Send';
          btn.disabled = false;
        } else {
          throw new Error();
        }
      })
      .catch(function () {
        feedback.textContent = '✗ Something went wrong. Please try again or email me directly.';
        feedback.style.background = '#fdecea';
        feedback.style.color = '#a02020';
        feedback.style.border = '1px solid #f5bcbc';
        btn.textContent = 'Send';
        btn.disabled = false;
      })
      .finally(function () {
        feedback.style.display = 'block';
      });
  });
})();

// Earlier projects collapse - archive launcher state
$(function () {
  const $archive = $('#earlier-projects');
  const $toggle = $('#earlier-projects-toggle');
  const $cta = $('#project-archive-cta');

  if (!$archive.length || !$toggle.length) return;

  const closedArchiveHint = 'ML · 3D Graphics · Robotics · Embedded Systems · Security';
  const openArchiveHint = 'ML · 3D Graphics · Robotics · Embedded Systems · Security';
  const $kicker = $toggle.find('.project-archive-kicker');
  const $label = $toggle.find('.project-archive-label');
  const $hint = $toggle.find('.project-archive-hint');

  function setArchiveToggleState(isOpen) {
    $cta.toggleClass('is-open', isOpen);
    $toggle.attr('aria-label', isOpen ? 'Close earlier projects archive' : 'Open earlier projects archive');
    $kicker.text(isOpen ? 'Archive open' : 'Earlier builds');
    $label.text(isOpen ? 'Close the project archive' : 'Open the project archive');
    $hint.text(isOpen ? openArchiveHint : closedArchiveHint);
  }

  $archive.on('show.bs.collapse', function () {
    setArchiveToggleState(true);
  }).on('shown.bs.collapse', function () {
    this.scrollTop = 0;
    this.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }).on('hide.bs.collapse', function () {
    setArchiveToggleState(false);
  });
});

// Copy to clipboard on email/phone click
(function () {
  const toast = document.getElementById('copy-toast');
  let toastTimeout;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove('show'), 2500);
  }

  document.querySelectorAll('a[data-copy]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const text = this.getAttribute('data-copy');
      const label = this.getAttribute('data-copy-label') || 'Text';
      navigator.clipboard.writeText(text).then(function () {
        showToast(label + ' copied to clipboard!');
      }).catch(function () {
        showToast('Could not copy — please copy manually.');
      });
    });
  });
})();
