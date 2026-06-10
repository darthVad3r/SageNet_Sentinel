# Architect Agent — Skills
Version: 1.0.0
Parent: agents/architect/charter.md

## Permitted Skills

### analysis
- Purpose: Analyze existing architecture, dependencies, and codebase structure
- Inputs: repository context, architecture documents, dependency maps
- Usage: Called first in most architecture pipelines to establish context

### generate
- Purpose: Generate architecture proposals, ADRs, dependency diagrams
- Inputs: requirements, constraints, analysis output
- Usage: Called after analysis to produce architectural artifacts

### plan
- Purpose: Produce phased implementation plans for architectural changes
- Inputs: architecture proposal, risk assessment, timeline constraints
- Usage: Called to create migration or evolution plans

### summarize
- Purpose: Summarize large codebases, architecture documents, or technical reports
- Inputs: raw documents, repository contents
- Usage: Called when context exceeds working window; produces structured summary

## Forbidden Skills
All skills not listed above are forbidden. Attempting to call a forbidden skill triggers a SecurityError (P2).
