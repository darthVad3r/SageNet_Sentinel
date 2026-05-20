# CI Pipeline

This repository uses GitHub Actions workflow `.github/workflows/ci.yml` to enforce continuous integration checks for code changes.

## Workflow Triggers

The CI workflow runs on:

- `push` to any branch
- `pull_request` targeting `main`

This ensures both direct branch updates and pull request updates to the default branch are validated.

## Jobs and Steps

All jobs run on `ubuntu-latest` and use Node.js LTS (`actions/setup-node@v4` with `node-version: lts/*`).

The workflow defines five jobs:

- `Install & Cache Dependencies`
- `Lint`
- `Type Check`
- `Unit Tests`
- `Build`

Execution order:

1. `Install & Cache Dependencies`
2. `Lint`, `Type Check`, and `Unit Tests` (in parallel, each needs `Install & Cache Dependencies`)
3. `Build` (needs `Lint`, `Type Check`, and `Unit Tests`)

### Install & Cache Dependencies Job

The `Install & Cache Dependencies` job performs:

1. Checkout repository source.
2. Setup Node.js LTS with npm cache enabled (`cache: npm`).
3. Restore/save `node_modules` cache with `actions/cache@v4`.
4. Run `npm ci` only on cache miss.

### Lint Job

The `Lint` job performs:

1. Checkout repository source.
2. Setup Node.js LTS.
3. Restore/save `node_modules` cache.
4. Run `npm ci` only on cache miss.
5. Run lint checks with `npm run lint`.

### Type Check Job

The `Type Check` job performs:

1. Checkout repository source.
2. Setup Node.js LTS.
3. Restore/save `node_modules` cache.
4. Run `npm ci` only on cache miss.
5. Run type checking with `npm run typecheck`.

### Unit Tests Job

The `Unit Tests` job performs:

1. Checkout repository source.
2. Setup Node.js LTS.
3. Restore/save `node_modules` cache.
4. Run `npm ci` only on cache miss.
5. Run unit tests with coverage via `npm test -- --coverage`.
6. Upload coverage artifacts using `actions/upload-artifact@v4`.

### Build Job

The `Build` job performs:

1. Checkout repository source.
2. Setup Node.js LTS.
3. Restore/save `node_modules` cache.
4. Run `npm ci` only on cache miss.
5. Run application build with `npm run build`.
6. Upload build output artifacts using `actions/upload-artifact@v4`.

If any command fails, the associated job fails and the workflow fails.

## Caching Strategy

The workflow uses two cache mechanisms:

- npm package cache via `actions/setup-node` (`cache: npm`) in the install job.
- workspace dependency cache via `actions/cache@v4` for `node_modules` in all jobs.

`node_modules` cache configuration:

- Cache path: `node_modules`
- Cache key: `${{ runner.os }}-node-modules-${{ hashFiles('package-lock.json') }}`
- Restore key prefix: `${{ runner.os }}-node-modules-`

This keeps cache invalidation tied to lockfile changes while reducing repeated dependency installs.

## Artifacts

The workflow publishes:

- `coverage` artifact from the `Unit Tests` job
- `dist` artifact from the `Build` job

## Branch Protection Integration

Branch protection can require workflow job check names as needed (for example: `Lint`, `Type Check`, `Unit Tests`, `Build`) to enforce quality gates before merge.

## Permissions

No explicit `permissions` block is declared in the workflow currently.
If your repository enforces stricter defaults, add an explicit permissions section in `.github/workflows/ci.yml`.
