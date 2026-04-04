# Ibraheem Taha — Personal Portfolio

**Live URLs:**
- [www.ibraheemtaha.com](https://www.ibraheemtaha.com)
- [ibraheemtaha.github.io](https://ibraheemtaha.github.io)

---

Personal portfolio website for Ibraheem Taha — AI/ML Engineer & PhD Candidate in Data Engineering. Built to showcase research, projects, experience, and skills.

## Structure

```
├── index.html          # Main portfolio page
├── pages/
│   └── privacy-policy.html
├── css/
│   ├── mycss.css       # Custom styles
│   ├── main.css        # Theme base styles
│   └── bootstrap.min.css
├── js/                 # Bootstrap, jQuery, plugins
├── scripts/
│   ├── main.js         # Smooth scroll, nav behavior
│   └── myscripts.js    # Typed.js, contact form, clipboard
└── images/             # Profile photo, background, assets
```

## Tech Stack

- HTML5 / CSS3
- Bootstrap 4
- jQuery
- [AOS](https://michalsnik.github.io/aos/) — scroll animations
- [Typed.js](https://mattboldt.com/demos/typed-js/) — hero text animation
- [Formspree](https://formspree.io) — contact form backend
- GitHub Pages + custom domain (CNAME)

## Features

- Responsive design across desktop and mobile
- Smooth-scroll navigation with fixed navbar
- Hero section with animated stats and CTA buttons
- Sections: About, Skills, Experience, Projects, Education, Honors & Awards, Interests, Contact
- Frosted-glass navbar with scroll transition
- AJAX contact form with in-page success/error feedback
- Copy-to-clipboard for email and phone
- Privacy Policy page ([pages/privacy-policy.html](pages/privacy-policy.html))

## Local Development

No build step required. Open `index.html` directly in a browser, or serve it with any static file server:

```bash
npx serve .
# or
python -m http.server 8000
```

## License

All rights reserved © Ibraheem Taha. The content, design, and structure of this portfolio are not licensed for reuse or redistribution.
