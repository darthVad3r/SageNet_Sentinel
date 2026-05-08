# AI Automation Landing (Angular)

Single-page Angular landing site for:

- AI Automation & Agent Workflow service
- AI Agent Starter Kit product

## Implemented scope

- Clean modern landing layout
- Hero section with CTA
- Problem, solution, pricing, starter kit sections
- Testimonials placeholder
- Book call CTA
- Mobile responsive SCSS
- Reusable UI components
- SEO metadata (title + meta description + OG tags)
- Fast-load route-level lazy loading
- No backend required

## Routes

- `/` → Landing page
- `/book` → Calendar link page
- `/kit` → Product checkout link page

## Project structure (high level)

```text
src/app/
  core/services/
    landing-content.service.ts
    seo.service.ts
  features/
    landing/landing-page.component.ts
    book/book-page.component.ts
    kit/kit-page.component.ts
  shared/ui/
    cta-button.component.ts
    section-block.component.ts
    pricing-card.component.ts
    testimonial-card.component.ts
  app.routes.ts
  app.ts
```

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:4200`.

## Build

```bash
npm run build
```

Production artifacts are generated in `dist/ai-automation-landing`.

## Test

```bash
npm test -- --watch=false
```

## Deployment instructions

### Static hosting (recommended)

This project is optimized for static deployment.

1. Build:

```bash
npm run build
```

2. Deploy assets from:

```text
dist/ai-automation-landing/browser
```

3. Configure SPA fallback (if host requires it) to `index.html`.

Examples: Azure Static Web Apps, Netlify, Vercel, Cloudflare Pages, GitHub Pages.

## Content placeholders to update

- `bookingUrl` in `landing-content.service.ts`
- `kitCheckoutUrl` in `landing-content.service.ts`
- Pricing text and feature bullets
- Testimonials with real client proof
