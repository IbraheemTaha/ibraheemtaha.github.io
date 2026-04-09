# Ibraheem Taha — Personal Portfolio

**Live site:** [www.ibraheemtaha.com](https://www.ibraheemtaha.com)  
**Mirror:** [ibraheemtaha.github.io](https://ibraheemtaha.github.io)

---

Personal portfolio website for Ibraheem Taha — AI/ML Engineer & PhD Researcher in Machine Learning and Data Engineering. Built to showcase research, publications, projects, experience, and skills.

## Structure

```
├── index.html                  # Single-page portfolio (all sections)
├── sitemap.xml                 # XML sitemap for search engine indexing
├── robots.txt                  # Crawler directives + sitemap pointer
├── CNAME                       # Custom domain: www.ibraheemtaha.com
├── .github/
│   └── workflows/
│       └── deploy-pages.yml    # GitHub Pages deployment workflow
├── pages/
│   └── privacy-policy.html     # Privacy policy
├── css/
│   ├── mycss.css               # Custom styles (navbar, CV modal, sections)
│   ├── main.css                # Theme base styles (now-ui-kit)
│   ├── bootstrap.min.css
│   └── aos.css                 # Scroll animation styles
├── scripts/
│   ├── cv-generator.js         # Client-side PDF CV generator (pdfmake)
│   ├── myscripts.js            # Contact form, clipboard, collapse toggles
│   └── main.js                 # Smooth scroll, nav behaviour
├── js/
│   ├── core/                   # jQuery, Popper, Bootstrap
│   ├── plugins/                # Typed.js and other plugins
│   ├── aos.js                  # Scroll animations
│   └── now-ui-kit.js           # Theme JS
└── images/
    ├── ibraheem.jpg            # High-resolution portrait for social sharing + PDF CV
    ├── ibraheem-profile-320.jpg # Optimized hero portrait
    ├── ibraheem-profile-640.jpg # Retina/high-DPI hero portrait
    ├── icon.jpg                # Favicon
    ├── cc-bg-1-1280.webp       # Mobile/tablet hero background
    ├── cc-bg-1-1920.webp       # Desktop hero background
    ├── cc-bg-1.webp            # Optimized hero background source/backup
    └── staticmap-1200.webp     # Lazy-loaded contact section map
```

## Tech Stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | CSS3, Bootstrap 4, now-ui-kit theme |
| Scripting | Vanilla JS, jQuery |
| Animations | [AOS](https://michalsnik.github.io/aos/), [Typed.js](https://mattboldt.com/demos/typed-js/) |
| PDF generation | [pdfmake](https://pdfmake.github.io/docs/) (lazy-loaded, client-side) |
| Contact backend | [Formspree](https://formspree.io) |
| Hosting | GitHub Pages + custom domain via CNAME |

## Sections

| Section | ID |
|---|---|
| About / Profile | `#about` |
| Professional Skills | `#skill` |
| Professional Experience | `#experience` |
| Projects | `#projects` |
| Education | `#education` |
| Honors & Awards | `#honors` |
| Interests | `#interests` |
| Contact | `#contact` |

## Features

- Fully responsive — desktop, tablet, and mobile
- Smooth-scroll navigation with fixed frosted-glass navbar
- Sidebar navigation at high zoom levels (fully opaque, branded)
- Hero section with animated typed text and stats
- Optimized responsive hero images and lazy-loaded contact map
- Montserrat + Open Sans typography system
- Collapsible "Earlier Projects" section (Bootstrap collapse)
- **CV PDF Generator** — floating button opens a modal where the user selects which sections to include (Profile, Skills, Experience, Publications, Projects, Education, Honors & Awards, Interests), optionally includes a profile photo, and downloads a formatted PDF — all client-side via pdfmake (no server required)
- Copy-to-clipboard for email and phone in the contact section
- AJAX contact form with in-page success/error feedback
- Scroll-triggered AOS animations throughout
- Privacy Policy page

## SEO

- JSON-LD `Person` structured data (Google rich results)
- Full Open Graph + Twitter Card meta tags
- `sitemap.xml` with image sitemap extension (Google Image Search)
- `robots.txt` pointing crawlers to the sitemap
- Canonical URL, `meta robots`, `meta author`, `meta keywords`
- `theme-color` for mobile browser chrome

## Local Development

No build step required. Serve with any static file server (required for the CV photo feature — `fetch()` does not work on `file://`):

```bash
npx serve .
# or
python -m http.server 8000
```

Then open [http://localhost:3000](http://localhost:3000) (npx serve) or [http://localhost:8000](http://localhost:8000).

## Deployment

This site deploys through GitHub Actions in `.github/workflows/deploy-pages.yml`.

The workflow:

- runs automatically after every push to `main`
- can be started manually from the GitHub Actions tab
- deploys the static site to GitHub Pages
- keeps the custom domain from `CNAME`

One-time GitHub setting: in **Settings -> Pages -> Build and deployment**, set **Source** to **GitHub Actions**.

## License

All rights reserved © Ibraheem Taha. The content, design, and structure of this portfolio are not licensed for reuse or redistribution.
