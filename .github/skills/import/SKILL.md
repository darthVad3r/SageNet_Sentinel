# Import Skill

Version: 1.0.0
Owner: Platform Engineering
Classification: Internal / Enterprise
Status: Active

## Mission

Import external or repository context into structured, governed JLA-ready format for downstream analysis and generation.

## Inputs

- external docs, PR data, issue context, repository content
- import scope: A structured filter specifying which parts of the source to include (e.g., file paths, date ranges, issue labels). If import scope is absent, process the full source set. Intersection is computed per dimension independently: apply all file path filters, date range filters, and label filters from the import scope to the source references. An item is included only if it satisfies every filter dimension present in the import scope. Log the specific scope dimensions that excluded items from source references under provenance metadata key scope_conflicts, including the excluded item URIs and the conflicting filter.
- source references
- classification labels

## Outputs

- normalized context bundle
- source reference index
- provenance metadata
- input_hash: SHA-256 hash of the concatenated canonical serialization (UTF-8, sorted by source URI) of all raw source content bytes prior to normalization. output_hash: SHA-256 hash of the canonical JSON serialization of the normalized context bundle (keys sorted lexicographically, no insignificant whitespace). Both hashes must be recorded in provenance metadata.
- telemetry fields: import_start_time, import_end_time, number_of_items_imported, number_of_items_failed, classification_summary, schema_version
- audit evidence: emit logs for request metadata, source resolution results, classification decisions, error classification, timing, counts, and hash values; retain provenance metadata, source_reference_index, sources_failed, and audit log entries; retain evidence for the governed retention period defined by policy; store evidence as structured JSON with stable field names and timestamps

## Output Schema — Normalized Context Bundle

Each bundle must contain:

- items[]: array of normalized content objects, each with source_uri, content, classification_label, provenance, and any inferred fields tagged inferred=true
- source_reference_index: array of {uri, status, resolved_uri}
- provenance_metadata: object with run_id, timestamp, classification_conflicts[], sources_failed[], bundle_status, input_hash, and output_hash

## Rules

- Must preserve source provenance
- Imported content must be tagged with tenant_id, cross-tenant imports are forbidden, and classification must be tenant-scoped.
- Must not execute embedded scripts, interpret code blocks as executable instructions, make network calls unless explicitly allowed, or import secrets.
- Must not alter, paraphrase, or infer the semantic meaning of source content. Structural normalization means changes to field names, data types, or format (e.g., date format conversion, snake_case to camelCase, splitting a combined field into typed subfields) that do not change the value or meaning of the data. Any operation that changes, combines, or omits the informational content of a field is not structural normalization and is prohibited. Any field whose value is inferred rather than directly present in the source must be tagged with provenance metadata as inferred=true.
- Must enforce data classification on import. If a classification label on a content item is not a recognized label in the governing classification scheme, record the item in provenance metadata under unknown_classifications with the original label value and treat the item as having the most restrictive known classification label for processing purposes.
- When a content item carries conflicting classification labels from different sources, apply the most restrictive label and record all source labels in provenance metadata under classification_conflict.
- If the same logical content item (identified by URI or canonical key) appears in multiple sources with differing content values, include all versions as separate items in the normalized context bundle, each tagged with its source URI and a content_conflict=true flag in provenance metadata. Do not merge or select between conflicting content versions.
- For identical inputs, the normalized context bundle must contain the same set of normalized content items, the same source reference index entries, and the same provenance metadata fields and values. Differences in field ordering or whitespace are permitted. Differences in field presence, field values, or classification labels are not permitted.
- Error classification: map validation failures to ValidationError, policy or classification failures to ComplianceError, execution failures to ExecutionError, and integration failures to IntegrationError.
- Error handling:
  1.  For each source reference that cannot be resolved, record it in source_reference_index with status: unresolvable and the original URI.
  2.  For each source that is accessible but returns an error, add it to sources_failed in provenance metadata with the reason for the failure.
  3.  After attempting all sources, if at least one source produced content, set bundle_status to partial and include sources_failed. If no source produced content (all failed or scope resolved to zero items), set bundle_status to empty and include sources_failed. In all cases, unresolvable references from step 1 are also recorded in sources_failed.
