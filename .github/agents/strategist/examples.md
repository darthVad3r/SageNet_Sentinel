# Strategist Agent — Examples
Version: 1.0.0

## Example: Roadmap Generation

### Input
```json
{
  "command_type": "generate_roadmap",
  "context": {
    "business_objectives": ["reduce time-to-market by 30%", "achieve SOC2 certification"],
    "current_initiatives": ["payments modernization", "API gateway migration"],
    "horizon": "2026-Q3 to 2027-Q2"
  }
}
```

### Output
```json
{
  "output_type": "strategic_roadmap",
  "horizon": "2026-Q3 to 2027-Q2",
  "phases": [
    {"phase": 1, "initiatives": ["API gateway migration"], "rationale": "Unblocks downstream work"},
    {"phase": 2, "initiatives": ["payments modernization"], "rationale": "Depends on gateway"},
    {"phase": 3, "initiatives": ["SOC2 audit preparation"], "rationale": "Requires stable platform"}
  ],
  "output_hash": "sha256:abc...",
  "schema_version": "1.0.0"
}
```
