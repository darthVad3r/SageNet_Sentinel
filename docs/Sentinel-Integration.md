# SageNet Sentinel — Integration Notes

This document describes how the SageNet Sentinel microservice family integrates with AI-Automation-Lab.

Overview
- REST API: src/SageNetSentinel.Api (existing) — management, metadata, tenant config, history, alerts, and non-real-time endpoints.
- ML and model logic: src/SageNetSentinel.ML (existing) — ML.NET implementations, ensemble, and rules.
- SageMaker integration: src/SageNetSentinel.SageMaker (existing) — optional SageMaker training/inference.
- gRPC: src/SageNetSentinel.Grpc (new) — low-latency real-time scoring via gRPC using protobuf contracts.
- Kinesis: src/SageNetSentinel.Kinesis (new) — high-volume ingestion consumer and async scoring background worker.

Communication Patterns

1) gRPC (Real-time scoring)
- Location: src/SageNetSentinel.Grpc
- Proto: Protos/scoring.proto
- Service: Scoring.Score(FraudScoringRequest) -> FraudScoringResponse
- Tenant: include tenantId in FraudScoringRequest (X-Tenant-Id header pattern used elsewhere)
- Security: mTLS is out-of-scope for now. TODO placeholders exist where platform should configure certificates.

2) Kinesis (High-volume ingestion / async scoring)
- Location: src/SageNetSentinel.Kinesis
- The KinesisConsumerService is a background worker scaffold that must be configured with stream name, AWS region, and checkpointing.
- For each event, the consumer should map to TransactionData and call IFraudDetectionService.PredictAsync, then publish or log results.
- AWS credentials, IAM, and stream provisioning are the platform team's responsibility. Placeholders and TODO notes are present.

3) REST (Management + Metadata + External integrations)
- Location: src/SageNetSentinel.Api
- Existing endpoints remain: /api/FraudDetection/analyze, /api/FraudDetection/batch, /api/ModelManagement/*
- New endpoints: Tenant config (/api/Tenant), Model metadata (/api/Metadata/model), Fraud score history (/api/History), Alert summaries (/api/Alerts/summary/{tenantId})
- Authentication: platform auth (JWT/API keys) is not implemented here. TODO markers left for platform integration.

Multi-tenant
- TenantContext lives in src/SageNetSentinel.Contracts/TenantContext.cs and is populated in the API from the header value X-Tenant-Id.
- All APIs accept tenantId where relevant. Ensure data isolation and model selection (per-tenant models) are implemented by the platform or as a follow-up.

Observability
- A placeholder extension AddObservability is provided in the API project. Integrate OpenTelemetry and exporters as a next step. TODO markers included.

Out of scope (explicit)
- AWS credentials, IAM roles, stream provisioning
- mTLS implementation and certificate management
- Model registry and lifecycle automation
- Production-grade checkpointing and idempotency logic for Kinesis consumer

Next steps for platform team
- Provide mTLS certs and registry details for gRPC if needed.
- Provide Kinesis stream names, AWS IAM details, and region configuration.
- Provide OpenTelemetry collector/OTLP/Jaeger endpoints for exporter configuration.

Contact
- Platform engineering and SageNet Sentinel owners should coordinate to finalize security and infra details.
