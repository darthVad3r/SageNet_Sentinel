# AI Automation Lab

## Project Overview

AI Automation Lab is a private Angular workspace for building and validating automation-focused web experiences, CI/CD workflows, and repository governance patterns in one place.

It solves a common problem for small teams and solo builders: project delivery slows down when frontend code, quality gates, and contribution standards evolve separately. This repository keeps those concerns integrated so features can move quickly without sacrificing maintainability.

This project is for:

- Engineers building Angular-based product surfaces.
- Maintainers who want predictable pull request quality and CI enforcement.
- Contributors who need a clear workflow for shipping changes safely.

Key goals and features:

- Standalone Angular application under `ai-automation-landing/`.
- Shared UI primitives, feature modules, and application state wiring.
- Automated CI pipeline for linting, type checking, testing, and build validation.
- GitHub automation for labeling, project tracking, issue linking, and branch protection.

## Setup Instructions

### Prerequisites

Install the following before starting:

- Git
- Node.js LTS (recommended: 20+)
- npm (comes with Node.js)
- Angular CLI (recommended: 21.x, can also be run via `npx`)

Verify your tooling:

```bash
node -v
npm -v
git --version
npx ng version
```

### Installation

1. Clone the repository.

```bash
git clone https://github.com/darthVad3r/ai-automation-lab.git
cd ai-automation-lab
```

2. Install app dependencies.

```bash
cd ai-automation-landing
npm ci
```

### Environment Configuration

The application currently runs without required environment variables for local development.

This repository does not currently include `ai-automation-landing/src/environments/`.
If you introduce environment-specific settings, create that directory and configure Angular file replacements as needed, then document new variables in this README and the related PR.

For repository automation workflows, these GitHub settings may be required depending on workflow usage:

- Repository secret: `ADD_TO_PROJECT_PAT`
- Repository secret: `REPO_ADMIN_TOKEN`
- Repository variable: `GH_PROJECT_URL`

### Run the Project

From `ai-automation-landing/`:

```bash
npm start
```

Useful development commands:

```bash
npm run lint
npm run lint:fix
npm run typecheck
npm test
npm run build
```

### Styling System

This project uses a SCSS-token-first design system (not TailwindCSS).

- Core theme tokens (color, typography, spacing, radius, elevation, semantic states) live in `ai-automation-landing/src/styles/_tokens.scss`.
- Global reset, base typography, layout primitives, and reusable component surface styles live in `ai-automation-landing/src/styles/global.scss`.
- SCSS aliases and breakpoint utilities live in `ai-automation-landing/src/styles/_variables.scss` and `ai-automation-landing/src/styles/_mixins.scss`.
- App-wide styles are loaded from `ai-automation-landing/src/styles.scss`.

Theme modes are controlled via `data-theme` on `:root` with supported values: `light`, `dark`, and `system`.

### Vercel Deployment (Optional)

If you deploy this app with Vercel, use these project settings to avoid 404 errors on Angular client routes:

1. Set Root Directory to `ai-automation-landing`.
2. Set Install Command to `npm ci`.
3. Set Build Command to `npm run build`.
4. Set Output Directory to `dist/ai-automation-landing/browser`.
5. Keep `ai-automation-landing/vercel.json` committed so direct route requests (for example `/login` or `/dashboard`) rewrite to `index.html`.

## Folder Structure Explanation

```text
ai-automation-lab/
├── .husky/
├── .vscode/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml
│   │   ├── deploy.yml
│   │   ├── labeler.yml
│   │   ├── pr-linked-issue.yml
│   │   ├── project-automation.yml
│   │   ├── release.yml
│   │   └── sync-branch-protection.yml
│   ├── ISSUE_TEMPLATE/
│   ├── agents/
│   ├── skills/
│   ├── CODEOWNERS
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── branch-protection-main.json
│   ├── copilot-instructions.md
│   └── labeler.yml
├── ai-automation-landing/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── guards/
│   │   │   │   │   └── auth.guard.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   └── http.interceptor.ts
│   │   │   │   └── services/
│   │   │   │       ├── landing-content.service.ts
│   │   │   │       ├── landing-content.service.spec.ts
│   │   │   │       └── seo.service.ts
│   │   │   ├── features/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── settings/
│   │   │   │   └── workflows/
│   │   │   ├── layout/
│   │   │   │   ├── navigation/
│   │   │   │   ├── shell/
│   │   │   │   └── sidebar/
│   │   │   ├── modules/
│   │   │   │   ├── book/
│   │   │   │   ├── kit/
│   │   │   │   └── landing/
│   │   │   ├── shared/
│   │   │   │   ├── directives/
│   │   │   │   ├── layout/
│   │   │   │   ├── pipes/
│   │   │   │   └── ui/
│   │   │   ├── state/
│   │   │   │   ├── app.state.ts
│   │   │   │   ├── app.store.ts
│   │   │   │   └── app.store.spec.ts
│   │   │   ├── app.config.ts
│   │   │   ├── app.html
│   │   │   ├── app.routes.ts
│   │   │   ├── app.scss
│   │   │   ├── app.spec.ts
│   │   │   └── app.ts
│   │   ├── styles/
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
│   ├── angular.json
│   ├── package.json
│   ├── package-lock.json
│   ├── tsconfig.json
│   ├── tsconfig.app.json
│   └── tsconfig.spec.json
├── docs/
│   ├── ci-pipeline.md
│   └── github-automation.md
├── .gitattributes
├── .gitignore
└── README.md
```

### What Each Major Area Is For

- `.github/workflows/`: CI/CD and automation workflows for validation, labeling, issue linkage, releases, and branch governance.
- `.husky/`: Local Git hook bootstrap used to enforce quality checks before commits.
- `.vscode/`: Shared editor settings and workspace-level development tooling configuration.
- `.github/PULL_REQUEST_TEMPLATE.md`: Required PR checklist and issue-linking format.
- `.github/CODEOWNERS`: Ownership and review routing configuration.
- `ai-automation-landing/`: Main Angular application workspace.
- `ai-automation-landing/src/app/core/`: Cross-cutting app concerns (guards, interceptors, and foundational services).
- `ai-automation-landing/src/app/features/`: Feature-level containers such as dashboard, settings, and workflows.
- `ai-automation-landing/src/app/layout/`: Application shell and navigation structure.
- `ai-automation-landing/src/app/modules/`: Route-level page modules for product sections.
- `ai-automation-landing/src/app/shared/`: Reusable directives, pipes, layout helpers, and UI components.
- `ai-automation-landing/src/app/state/`: App-level state model, store logic, and associated tests.
- `docs/`: Operational documentation for CI and GitHub automation.

## Contribution Guidelines

### Branching Strategy

- Create all work on a short-lived branch from `main`.
- Open pull requests targeting `main` unless maintainers explicitly request a different base branch.
- Prefer descriptive branch names with an issue prefix, for example: `59-readme-enhancement`.
- Keep branches focused on a single concern to simplify review and rollback.

### Commit Message Style

Use clear, imperative commit messages. Conventional Commit style is recommended:

```text
feat(readme): add setup and contribution sections
fix(ci): align cache path to app lockfile
docs(workflows): update CI trigger documentation
```

Guidelines:

- Subject line <= 72 characters.
- Explain what changed and why.
- Avoid vague messages like "update" or "fix stuff".

### Pull Request Expectations

Every pull request should:

1. Use `.github/PULL_REQUEST_TEMPLATE.md`.
2. Include a linked issue with a closing keyword, such as `Closes #57`.
3. Describe scope, risk, and any environment or deployment impact.
4. Include documentation updates when behavior, tooling, or workflows change.
5. Pass CI checks before requesting final review.

Before opening a PR, run from `ai-automation-landing/`:

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

### Code Review Requirements

- At least one approving review is required before merge.
- Resolve all review conversations.
- Keep history linear and avoid force-pushing rewritten history after active review unless coordinated.
- Address requested changes with follow-up commits and short reviewer notes.

### Project-Specific Rules

- Use standalone Angular components and prefer `ChangeDetectionStrategy.OnPush` for feature/page components.
- Keep styling maintainable and purposeful; use SCSS for essential layout and component presentation.
- For accessibility, correctly associate labels with form controls using `for`/`id` or wrapping.
- Do not add or modify machine-local artifacts (for example `.vs/` workspace files) in feature PRs, and never commit secrets.

---

For deeper operational details, see:

- `docs/ci-pipeline.md`
- `docs/github-automation.md`
