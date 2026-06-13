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
- Serverless `/api/leads` intake endpoint for persisted lead capture
- Authentication gate for protected routes (`/dashboard`, `/workflows`, `/settings`)
- Session-aware header with user identity and logout
- Auth token injection for same-origin `/api/*` requests
- Supabase authentication provider initialized at app startup

## Routes

- `/` → Landing page
- `/book` → Calendar link page
- `/kit` → Product checkout link page
- `/login` → Authentication page
- `/auth-test` → Protected provider verification page
- `/dashboard`, `/workflows`, `/settings` → Protected routes (require sign-in)

## Authentication Gate

The app now enforces authentication on all internal routes.

- Unauthenticated users are redirected to `/login`.
- The original destination is preserved with `redirectTo` and restored after successful sign-in.
- Session data is stored in local storage and restored on reload.
- Logout clears both app state and persisted session token.

### Auth Provider Setup

The app uses `@supabase/supabase-js` as the authentication provider SDK.

1. Copy `.env.local.example` to `.env.local`.
2. Set these values from your Supabase project:
   - `LAB_AUTH_ENABLED=true`
   - `LAB_SUPABASE_URL`
   - `LAB_SUPABASE_ANON_KEY`
3. Create at least one email/password user in Supabase Authentication.

Before `start`, `build`, `test`, and `typecheck`, the project runs `npm run auth:config`.

That script reads `.env.local` and generates `src/assets/runtime/auth-config.js`, which is loaded by `src/index.html` before Angular bootstraps. The resulting runtime config is exposed on `window.__LAB_AUTH_CONFIG__`.

If `.env.local` is missing or `LAB_AUTH_ENABLED` is not `true`, login stays disabled for that environment.

### Session Handling

- Supabase persists the browser session automatically.
- Token refresh is managed by the Supabase client.
- User metadata (email, display name, avatar, role) is synchronized into the global app store.
- `/auth-test` confirms the current session is available after sign-in.

### API Token Validation Contract

Client behavior:

- For same-origin API requests (`/api/*`), the HTTP interceptor sends `Authorization: Bearer <token>`.

Server expectation:

- API endpoints must reject missing/invalid bearer tokens with `401 Unauthorized`.
- API endpoints should parse and validate token claims before returning protected data.

### Lead Intake API Contract

The booking flow now submits to same-origin `POST /api/leads` and the settings export view reads from `GET /api/leads`.

Required backend environment variables:

- `LAB_SUPABASE_URL`
- `LAB_SUPABASE_SERVICE_ROLE_KEY`

Optional notification variable:

- `LAB_LEAD_NOTIFICATION_WEBHOOK_URL`

The `/api/leads` function expects a Supabase table named `lead_submissions` with columns matching the server mapping in `api/leads.ts`.

## Architecture Overview

This project follows a **feature-first, scalable Angular architecture** designed for maintainability and growth.

### Folder Structure

```text
src/
├── app/
│   ├── core/                          # Singleton services & app-wide utilities
│   │   ├── services/                  # HTTP services, SEO, config, etc.
│   │   ├── interceptors/              # HTTP interceptors (auth, errors, logging)
│   │   └── guards/                    # Route guards (auth, permissions)
│   │
│   ├── shared/                        # Reusable, import-safe components
│   │   ├── ui/                        # Dumb UI components (buttons, cards, etc.)
│   │   ├── pipes/                     # Custom pipes (safe, date, etc.)
│   │   ├── directives/                # Custom directives (highlight, etc.)
│   │   └── layout/                    # Layout shell & layout components
│   │
│   ├── features/                      # Feature modules (lazy-loaded)
│   │   ├── landing/                   # Landing page feature
│   │   ├── book/                      # Booking page feature
│   │   └── kit/                       # Starter kit feature
│   │
│   ├── layout/                        # Application layout structure
│   │   ├── shell/                     # Shell component (router outlet host)
│   │   ├── navigation/                # Header/nav components
│   │   └── sidebar/                   # Sidebar components (if needed)
│   │
│   ├── state/                         # Global signal-based app state
│   │   ├── app.state.ts               # Global state interfaces + initial state
│   │   └── app.store.ts               # Writable signals, selectors, and updaters
│   │
│   └── app.ts                         # Root component
│
├── styles/                            # Global SCSS
│   ├── _variables.scss                # Colors, spacing, typography
│   ├── _mixins.scss                   # Reusable SCSS utilities
│   └── global.scss                    # Global reset & base styles
│
├── assets/                            # Static files (images, icons, fonts)
└── styles.scss                        # Global stylesheet entry point
```

### Architecture Principles

#### 1. **Core Module** (Singleton Services)

- Imported **once in the root only**
- Contains app-wide services, interceptors, guards
- Examples: `SeoService`, `AuthGuard`, `HttpInterceptor`
- **Rule**: Do not import Core in features or shared

#### 2. **Shared Module** (Reusable Components)

- Import-safe across the entire app
- Contains dumb UI components, pipes, directives
- **No providers** (except standalone component defaults)
- Examples: `CtaButton`, `SafePipe`, `HighlightDirective`
- **Rule**: Shared is safe to use everywhere

#### 3. **Features** (Lazy-Loaded Modules)

- Independent feature sets, lazy-loaded via routing
- Each feature can have its own:
  - Components
  - Services (feature-scoped)
  - State (NgRx slices, if using state management)
  - Pipes & directives (feature-only)
- Examples: `landing/`, `book/`, `kit/`
- **Rule**: Features are independent; prefer shallow imports

#### 4. **Layout** (Application Shell)

- Contains the main shell component with router outlet
- Manages header, footer, navigation structure
- Currently in `/shared/layout/site-shell.component.ts`
- Components: Shell, Navigation, Sidebar
- **Rule**: Layout is part of the core shell; loaded once

#### 5. **Global Styles**

- SCSS variables: colors, spacing, typography, breakpoints
- SCSS mixins: flexbox utilities, responsive breakpoints, utilities
- Global reset & base styles: typography, links, forms
- All imported into root `styles.scss`

#### 6. **Global State** (Angular Signals)

- Uses Angular Signals for lightweight app-wide state
- Root store lives under `src/app/state/`
- State slices: `ui`, `auth`, `app`
- Exposes computed selectors and imperative updaters
- **Rule**: Keep business state transitions inside the store, not scattered across components

### Import Path Aliases

TypeScript path aliases are configured in `tsconfig.json`:

```json
{
  "baseUrl": "src",
  "paths": {
    "@app/*": ["app/*"],
    "@core/*": ["app/core/*"],
    "@shared/*": ["app/shared/*"],
    "@features/*": ["app/features/*"],
    "@layout/*": ["app/layout/*"],
    "@assets/*": ["assets/*"]
  }
}
```

**Usage Examples:**

```typescript
// Instead of: import { SeoService } from '../../../core/services/seo.service';
import { SeoService } from '@core/services/seo.service';

// Instead of: import { CtaButton } from '../../../shared/ui/cta-button.component';
import { CtaButton } from '@shared/ui/cta-button.component';

// Instead of: import { LandingPageComponent } from '../../../features/landing/landing-page.component';
import { LandingPageComponent } from '@features/landing/landing-page.component';
```

### Import Rules

1. **Core** can import from: Core itself
2. **Shared** can import from: Shared itself, Core
3. **Features** can import from: Features itself, Shared, Core
4. **Layout** can import from: Layout itself, Shared, Core

**Anti-patterns to avoid:**

- ❌ Core importing from Features or Shared (breaks singleton principle)
- ❌ Shared importing from Features (breaks reusability)
- ❌ Features importing from other Features (use Router for cross-feature communication)
- ❌ Deep relative paths like `../../../../core/services/` (use path aliases instead)

### Project structure (detailed)

```text
src/app/
  state/
    app.state.ts
    app.store.ts

  core/
    services/
      landing-content.service.ts
      seo.service.ts
    interceptors/
      http.interceptor.ts                 (placeholder)
    guards/
      auth.guard.ts                       (placeholder)

  shared/
    ui/
      cta-button.component.ts
      feature-card.component.ts
      pricing-card.component.ts
      pricing-tier.component.ts
      section-block.component.ts
      testimonial-card.component.ts
    pipes/
      safe.pipe.ts                        (placeholder)
    directives/
      highlight.directive.ts              (placeholder)
    layout/
      site-shell.component.ts

  features/
    landing/
      landing-page.component.ts
    book/
      book-page.component.ts
    kit/
      kit-page.component.ts

  layout/
    shell/
      shell.component.ts                  (placeholder for extension)
    navigation/
      navigation.component.ts             (placeholder)
    sidebar/
      sidebar.component.ts                (placeholder)

  app.routes.ts
  app.ts
```

## Global State Management (Signals)

This project uses **Angular Signals** for the initial global state layer. Signals fit the current standalone, feature-first Angular architecture well and avoid introducing unnecessary framework overhead for the MVP.

### Chosen Pattern

- `app.state.ts` defines the global state contracts and initial state
- `app.store.ts` owns the writable signal, computed selectors, and updaters
- The store is provided at the root in `app.config.ts`
- Features inject the store directly with `inject(AppStore)`

### State Folder Structure

```text
src/app/state/
  app.state.ts
  app.store.ts
```

### State Shape

The base store includes three application-wide slices:

- `ui`: sidebar open/closed state, theme
- `auth`: authentication status and placeholder user metadata
- `app`: global loading flag and notifications list

### How To Read State

Inject the store into a standalone component and read computed signals directly.

```typescript
import { Component, inject } from '@angular/core';
import { AppStore } from '@app/state/app.store';

@Component({
  standalone: true,
  template: `<p>Theme: {{ store.theme() }}</p>`,
})
export class ExampleComponent {
  readonly store = inject(AppStore);
}
```

### How To Update State

Call store updaters from event handlers or feature orchestration code.

```typescript
toggleTheme(): void {
  this.store.setTheme('dark');
}

seedDemo(): void {
  this.store.seedDashboardDemo();
}
```

Available updaters in the initial store include:

- `toggleSidebar()`
- `setTheme(theme)`
- `setAuthenticated(user)`
- `logout()`
- `setLoading(isLoading)`
- `addNotification(message, level)`
- `markNotificationRead(id)`
- `clearNotifications()`

### How To Inject The Store

Use Angular's `inject()` API inside standalone components, directives, or services.

```typescript
readonly store = inject(AppStore);
```

The root provider is configured in `app.config.ts`, so no module-based setup is required.

### Best Practices

- Keep the writable signal private and expose computed selectors publicly
- Prefer focused updaters over mutating state directly in components
- Treat components as consumers of state, not owners of global state transitions
- Add derived values as `computed()` selectors when multiple consumers need them
- Keep feature-local transient UI state in the feature when it does not need app-wide visibility

### Anti-Patterns To Avoid

- Do not add React state libraries such as Zustand, Jotai, or Redux Toolkit
- Do not mutate the store state object directly outside the store
- Do not move one-off local form fields into global state without a real cross-feature need
- Do not reintroduce module-based NgRx setup unless the project explicitly scales into that need
- Do not duplicate derived values in components when a computed selector can own them centrally

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

## Bundle profiling

```bash
npm run build:stats
npm run analyze:stats
```

1. Run `npm run build:stats` to generate `dist/ai-automation-landing/stats.json`.
2. Run `npm run analyze:stats` to print top contributors in initial chunks.
3. Optimize the largest contributors first, then rerun both commands to compare impact.

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
