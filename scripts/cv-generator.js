(function () {
  'use strict';

  // ── Lazy-load pdfmake (only when user opens the modal) ──────────────────────

  var pdfmakeReady = false;

  function loadScript(src, onload) {
    var s = document.createElement('script');
    s.src = src;
    s.onload = onload;
    document.head.appendChild(s);
  }

  function ensurePdfMake(callback) {
    if (pdfmakeReady) { callback(); return; }
    loadScript(
      'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/pdfmake.min.js',
      function () {
        loadScript(
          'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.7/vfs_fonts.js',
          function () { pdfmakeReady = true; callback(); }
        );
      }
    );
  }

  // ── DOM helpers ──────────────────────────────────────────────────────────────

  // FIX #3: collapse all whitespace (HTML indentation → \n chars in textContent)
  function txt(el) {
    return el ? el.textContent.trim().replace(/\s+/g, ' ') : '';
  }

  // Direct <li> children only, whitespace-normalised
  function topLiTexts(ul) {
    if (!ul) return [];
    return Array.from(ul.children)
      .filter(function (el) { return el.tagName === 'LI' && !el.querySelector('ul, ol'); })
      .map(function (li) {
        var c = li.cloneNode(true);
        c.querySelectorAll('ul, ol').forEach(function (s) { s.remove(); });
        return c.textContent.trim().replace(/\s+/g, ' ');
      })
      .filter(Boolean);
  }

  // ── Design constants ─────────────────────────────────────────────────────────

  var BLUE  = '#0077b5';
  var DARK  = '#0a1628';
  var INK   = '#1a1a1a';
  var MUTED = '#555555';
  var DIM   = '#777777';

  // FIX #2: fixed date-column width → all entry titles wrap at the SAME point
  var DATE_COL_W = 148;  // wide enough for "October 2018 - September 2020"

  // ── Building blocks ──────────────────────────────────────────────────────────

  function thinRule(topMargin) {
    return {
      canvas: [{
        type: 'line', x1: 0, y1: 0, x2: 515, y2: 0,
        lineWidth: 0.5, lineColor: '#bfd8ef'
      }],
      margin: [0, topMargin || 0, 0, 6]
    };
  }

  function sectionHeader(title) {
    return [
      {
        text: title.toUpperCase(),
        fontSize: 11, bold: true, color: BLUE, characterSpacing: 1.2,
        margin: [0, 8, 0, 2]
      },
      thinRule()
    ];
  }

  // FIX #2: date column always DATE_COL_W wide → consistent wrapping for title
  function makeEntry(titleText, periodText, orgs, bullets, tags) {
    var stack = [];

    // Title + date on one row
    if (periodText) {
      stack.push({
        columns: [
          { text: titleText || '', bold: true, fontSize: 10.5, color: INK, width: '*' },
          { text: periodText, fontSize: 9, color: DIM, width: DATE_COL_W,
            alignment: 'right', margin: [0, 1, 0, 0] }
        ],
        margin: [0, 0, 0, 1]
      });
    } else {
      stack.push({
        text: titleText || '', bold: true, fontSize: 10.5, color: INK,
        margin: [0, 0, 0, 1]
      });
    }

    (orgs || []).forEach(function (org) {
      if (org && org.trim()) {
        stack.push({ text: org.trim(), fontSize: 9.5, color: MUTED, margin: [0, 0, 0, 1] });
      }
    });

    if (tags && tags.length) {
      stack.push({ text: tags.join(' · '), fontSize: 9, color: BLUE, margin: [0, 1, 0, 2] });
    }

    if (bullets && bullets.length) {
      stack.push({
        ul: bullets.map(function (b) { return { text: b, fontSize: 10, color: INK }; }),
        margin: [0, 2, 0, 0]
      });
    }

    return { stack: stack, unbreakable: true, margin: [0, 0, 0, 5] };
  }

  // ── Section builders ─────────────────────────────────────────────────────────

  var builders = {

    profile: function () {
      var paras   = document.querySelectorAll('#about .card-body p.justify');
      var content = sectionHeader('Profile');
      paras.forEach(function (p) {
        content.push({
          text: p.textContent.trim().replace(/\s+/g, ' '),
          fontSize: 10, margin: [0, 0, 0, 3], alignment: 'justify'
        });
      });
      return content;
    },

    contact: function () {
      var rows    = document.querySelectorAll('#about .row.mt-3');
      var body    = [];
      rows.forEach(function (row) {
        var label = row.querySelector('strong');
        var value = row.querySelector('.col-sm-8');
        if (label && value) {
          body.push([
            { text: txt(label), bold: true, fontSize: 10 },
            { text: txt(value), fontSize: 10 }
          ]);
        }
      });
      var content = sectionHeader('Personal Information');
      if (body.length) {
        content.push({
          table: { widths: [100, '*'], body: body },
          layout: 'noBorders'
        });
      }
      return content;
    },

    skills: function () {
      var groups  = document.querySelectorAll('#skill .skill-group');
      var content = sectionHeader('Professional Skills');
      groups.forEach(function (group) {
        var title = group.querySelector('.skill-group-title');
        var tags  = group.querySelectorAll('.skill-tag');
        if (!title) return;
        var tagLine = Array.from(tags).map(function (t) {
          return t.textContent.trim();
        }).join('  ·  ');
        content.push({
          text: [
            { text: txt(title) + '  ', bold: true, fontSize: 10 },
            { text: tagLine, fontSize: 9.5, color: '#333' }
          ],
          margin: [0, 0, 0, 4]
        });
      });
      return content;
    },

    experience: function () {
      var cards   = document.querySelectorAll('#experience .card');
      var content = sectionHeader('Professional Experience');
      cards.forEach(function (card) {
        var period  = txt(card.querySelector('.cc-experience-header p'));
        var org     = txt(card.querySelector('.cc-experience-header .h5'));
        var role    = txt(card.querySelector('.col-md-9 .h5 strong'));
        var body    = card.querySelector('.col-md-9 .card-body');
        if (!role) return;
        var bullets = topLiTexts(body ? body.querySelector('ul') : null);
        content.push(makeEntry(role, period, [org], bullets));
      });
      return content;
    },

    publications: function () {
      var firstCard = document.querySelector('#experience .card');
      if (!firstCard) return [];
      var nestedUl  = firstCard.querySelector('ul ul');
      if (!nestedUl) return [];
      var items = Array.from(nestedUl.querySelectorAll('li'))
        .map(function (li) { return li.textContent.trim().replace(/\s+/g, ' '); })
        .filter(Boolean);
      if (!items.length) return [];
      var content = sectionHeader('Publications');
      content.push({
        ul: items.map(function (t) { return { text: t, fontSize: 10, color: INK }; })
      });
      return content;
    },

    projects: function () {
      var cards   = document.querySelectorAll('#projects .project-card');
      var content = sectionHeader('Selected Projects');
      cards.forEach(function (card) {
        var collapse = card.closest('#earlier-projects');
        if (collapse && !collapse.classList.contains('show')) return;
        var period     = txt(card.querySelector('.cc-experience-header p'));
        var org        = txt(card.querySelector('.cc-experience-header .h5'));
        var title      = txt(card.querySelector('.col-md-9 .h5 strong'));
        var highlights = Array.from(card.querySelectorAll('.project-highlights li'))
                           .map(function (li) {
                             return li.textContent.trim().replace(/\s+/g, ' ');
                           });
        var tags = Array.from(card.querySelectorAll('.project-tags .skill-tag'))
                     .map(function (t) { return t.textContent.trim(); });
        if (!title) return;
        content.push(makeEntry(title, period, [org], highlights, tags));
      });
      return content;
    },

    education: function () {
      var cards   = document.querySelectorAll('#education .card');
      var content = sectionHeader('Education');
      cards.forEach(function (card) {
        var period      = txt(card.querySelector('.cc-education-header p, .cc-experience-header p'));
        var degree      = txt(card.querySelector('.cc-education-header .h5, .cc-experience-header .h5'));
        var field       = txt(card.querySelector('.col-md-9 .h5 strong'));
        var institution = txt(card.querySelector('.col-md-9 .category'));
        if (!field) return;
        content.push(makeEntry(field, period, [degree, institution]));
      });
      return content;
    },

    interests: function () {
      var card = document.querySelector('#interests .card-body');
      if (!card) return [];
      var items = card.querySelectorAll('.interest-label');
      if (!items.length) return [];
      var content = sectionHeader('Interests');
      var labels = Array.from(items).map(function (el) { return el.textContent.trim(); });
      content.push({ text: labels.join('  \xB7  '), fontSize: 10, color: INK });
      return content;
    },

    honors: function () {
      var card  = document.querySelector('#honors .card-body');
      if (!card) return [];
      var items = Array.from(card.querySelectorAll('li'))
                    .map(function (li) {
                      return li.textContent.trim().replace(/\s+/g, ' ');
                    })
                    .filter(Boolean);
      if (!items.length) return [];
      var content = sectionHeader('Honors & Awards');
      content.push({
        ul: items.map(function (t) { return { text: t, fontSize: 10, color: INK }; })
      });
      return content;
    }
  };

  // ── Image helper ─────────────────────────────────────────────────────────────

  function squareBase64(imgEl) {
    var sw   = imgEl.naturalWidth;
    var sh   = imgEl.naturalHeight;
    var side = Math.min(sw, sh);
    var sx   = Math.round((sw - side) / 2); // center-crop X
    var sy   = Math.round((sh - side) / 2); // center-crop Y
    var outputSide = Math.min(640, side);
    // The PDF photo is small; 640px keeps it crisp without embedding a huge PNG.
    var canvas = document.createElement('canvas');
    canvas.width  = outputSide;
    canvas.height = outputSide;
    canvas.getContext('2d').drawImage(imgEl, sx, sy, side, side, 0, 0, outputSide, outputSide);
    return canvas.toDataURL('image/jpeg', 0.9);
  }

  function imgToBase64(src, callback) {
    // Method 1: use the DOM image only if it is the same file requested for the CV.
    var domImg = document.querySelector('.cc-profile-image img');
    var domSrc = domImg ? new URL(domImg.currentSrc || domImg.src, window.location.href).pathname : '';
    var requestedSrc = new URL(src, window.location.href).pathname;
    if (domImg && domImg.complete && domImg.naturalWidth > 0 && domSrc === requestedSrc) {
      try {
        callback(squareBase64(domImg));
        return;
      } catch (e) { /* tainted canvas — fall through */ }
    }
    // Method 2: load a fresh copy with crossOrigin then draw to canvas
    var img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      try {
        callback(squareBase64(img));
      } catch (e) { callback(null); }
    };
    img.onerror = function () { callback(null); };
    img.src = src + '?nocache=' + Date.now();
  }

  // ── Assemble document definition ─────────────────────────────────────────────

  function buildDocDef(selected, photoBase64) {
    var PHOTO_W    = 58;   // pt — photo column width
    var titleSize  = photoBase64 ? 9.5  : 10.5;
    var contactSize= photoBase64 ? 7.5  : 8.5;

    var textStack = [
      { text: 'Ibraheem Taha', fontSize: 22, bold: true, color: DARK, margin: [0, 0, 0, 2] },
      { text: 'AI/ML Engineer  |  Machine Learning & Data Engineering PhD Researcher  |  Building Scalable AI Systems',
        fontSize: titleSize, color: BLUE, lineHeight: 1, margin: [0, 0, 0, 3] },
      { text: 'ibraheemtaha@yahoo.com  |  +45 52701019  |  linkedin.com/in/ibraheemtaha  |  github.com/IbraheemTaha  |  www.ibraheemtaha.com',
        fontSize: contactSize, color: '#555', lineHeight: 1, margin: [0, 0, 0, 0] }
    ];

    var headerBlock;
    if (photoBase64) {
      headerBlock = {
        columns: [
          { stack: textStack, width: '*' },
          {
            width: PHOTO_W,
            image: photoBase64,
            fit: [PHOTO_W, PHOTO_W],
            alignment: 'right'
          }
        ],
        columnGap: 10,
        margin: [0, 0, 0, 5]
      };
    } else {
      headerBlock = { stack: textStack, margin: [0, 0, 0, 5] };
    }

    var content = [
      headerBlock,
      // Header divider
      {
        canvas: [{
          type: 'line', x1: 0, y1: 0, x2: 515, y2: 0,
          lineWidth: 1.5, lineColor: BLUE
        }],
        margin: [0, 0, 0, 3]
      }
    ];

    selected.forEach(function (key) {
      if (builders[key]) {
        builders[key]().forEach(function (item) { content.push(item); });
      }
    });

    return {
      pageSize:    'A4',
      pageMargins: [40, 40, 40, 35],
      content:     content,
      defaultStyle: { font: 'Roboto', fontSize: 10, lineHeight: 1.2, color: INK },
      footer: function (currentPage, pageCount) {
        return {
          text: 'Generated from www.ibraheemtaha.com  |  Page ' + currentPage + ' of ' + pageCount,
          fontSize: 7.5, color: '#bbb', alignment: 'center', margin: [40, 6, 40, 0]
        };
      }
    };
  }

  // ── Generate & auto-download ──────────────────────────────────────────────────

  window.generateCV = function () {
    var checked  = document.querySelectorAll('#cv-modal input[type=checkbox]:checked');
    var selected = Array.from(checked)
      .map(function (cb) { return cb.value; })
      .filter(function (v) { return v !== 'photo'; });

    if (!selected.length) {
      alert('Please select at least one section.');
      return;
    }

    var includePhoto = document.getElementById('cv-include-photo').checked;

    var btn = document.getElementById('cv-generate-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa fa-spinner fa-spin mr-1"></i> Generating&hellip;';

    function doGenerate(photoBase64) {
      ensurePdfMake(function () {
        try {
          pdfMake.createPdf(buildDocDef(selected, photoBase64)).download('Ibraheem_Taha_CV.pdf');
        } catch (err) {
          console.error('CV generation failed:', err);
          alert('PDF generation failed. Please try again.');
        } finally {
          btn.disabled = false;
          btn.innerHTML = '<i class="fa fa-download mr-1"></i> Download PDF';
        }
      });
    }

    if (includePhoto) {
      imgToBase64('images/ibraheem.jpg', function (b64) {
        doGenerate(b64); // b64 may be null if image fails — buildDocDef handles null gracefully
      });
    } else {
      doGenerate(null);
    }
  };

  window.openCVModal = function () {
    ensurePdfMake(function () {}); // pre-load silently while modal opens
    $('#cv-modal').modal('show');
  };

})();
