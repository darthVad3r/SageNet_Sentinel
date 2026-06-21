# Summarize Skill
Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## Mission
Condense large context into a structured summary suitable for downstream orchestration, without losing critical provenance or constraints.

## Inputs
- repository content, documents, analysis output, PR context, or prompt bundle
- summary target and length constraints
- audience or downstream consumer

## Outputs
- structured summary
- key facts and decisions
- open questions
- provenance references
- input/output hashes

## Rules
- Must not invent content not present in the source material
- Must preserve critical constraints, risks, and decisions
- Must be deterministic for the same inputs
- Must be suitable for chained agent workflows
