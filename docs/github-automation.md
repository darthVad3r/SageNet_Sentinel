# GitHub Automation Guide

This document explains contribution and governance automation configured for this repository.

## Pull Request Template Usage

File: `.github/PULL_REQUEST_TEMPLATE.md`

Every new PR includes:

- Summary
- Linked Issue (use closing keyword syntax such as `Closes #57`)
- Contributor checklist for linting, tests, docs, and environment impact
- Deployment considerations and rollback notes

Why this matters:

- Standardizes review quality and release readiness
- Ensures issue-to-PR traceability

## Issue Template Usage

Files:

- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/ISSUE_TEMPLATE/config.yml`

Bug reports capture:

- Reproduction steps
- Expected vs actual behavior
- Environment metadata
- Supporting logs/screenshots

Feature requests capture:

- Problem statement
- Proposed solution
- Acceptance criteria

`config.yml` disables blank issues and routes users to docs/security links.

## Labeler Rules

Files:

- `.github/labeler.yml`
- `.github/workflows/labeler.yml`

Automation behavior:

- Path-based labels:
  - `frontend` for app source changes (`ai-automation-landing/src/...`)
  - `workflows` for CI/CD and GitHub automation files
  - `documentation` for docs and README changes
- Branch-based labels:
  - `feature` for `feature/*`
  - `fix` for `fix/*`
  - `chore` for `chore/*`
- Global PR triage:
  - `needs-review` applied to all PRs

The workflow also ensures these labels exist before applying them.

## Branch Protection Rules

Files:

- `.github/branch-protection-main.json`
- `.github/workflows/sync-branch-protection.yml`

Configured policy for `main`:

- Pull request required (direct pushes blocked)
- Minimum 1 approving review
- Required status checks: `Lint`, `Type Check`, `Unit Tests`, `Build`
- Required conversation resolution
- Required linear history
- Force pushes and branch deletion disabled

How to apply:

1. Add `REPO_ADMIN_TOKEN` repository secret (admin-scoped PAT).
2. Run workflow `Sync Branch Protection` manually.

## Project Board Automation

Files:

- `.github/workflows/project-automation.yml`
- `.github/workflows/pr-linked-issue.yml`

Project linkage behavior:

- New/reopened issues and PRs are automatically added to GitHub Project via `actions/add-to-project`.
- PR body is validated to include closing keyword issue links (`Closes #...`, `Fixes #...`, `Resolves #...`) to keep issue/PR relationships explicit.
- Project auto-add for PRs runs on `pull_request_target` so repository secrets are available for trusted automation without checking out PR code.

Required repository configuration:

- Set repository variable `GH_PROJECT_URL` to the target GitHub Project URL.
- Set repository secret `ADD_TO_PROJECT_PAT` with project write access.
- If `GH_PROJECT_URL` is missing or empty, the project auto-add job is skipped.
- If `GH_PROJECT_URL` is set but `ADD_TO_PROJECT_PAT` is missing, the workflow fails fast with a clear error.

## CODEOWNERS

File: `.github/CODEOWNERS`

Ownership rule:

- `* @darthVad3r`

This requires reviews from the configured owner when code owner review is enabled.
