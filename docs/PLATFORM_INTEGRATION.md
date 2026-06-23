# SageNet Sentinel Platform Integration Guide

## Surfaces

### REST
- `POST /api/FraudDetection/analyze`
- `POST /api/FraudDetection/analyze/batch`
- `GET /api/FraudDetection/statistics`
- `GET /api/Metadata/models`
- `GET /api/Metadata/tenants`
- `GET /api/Metadata/version`
- `GET /api/FraudHistory/{tenantId}`
- `GET /api/Alerts/{tenantId}`
- `POST /api/Tenants/register`
- `GET /api/Tenants/{tenantId}/configuration`

### gRPC
- Proto contracts:
  - `/src/SageNetSentinel.Grpc/Protos/transaction.proto`
  - `/src/SageNetSentinel.Grpc/Protos/fraud_scoring.proto`
- Service: `FraudScoringService.Score`

### Kinesis Async Ingestion
- Event contract: `TransactionEvent`
- Worker: `KinesisScoringWorker`
- Mapping: `TransactionEvent.FromTransaction()` / `ToTransactionData()`

## Multi-Tenant Foundation
- `TransactionData`, `FraudPrediction`, and request contracts include `TenantId`
- Tenant context contract: `ITenantContext` / `TenantContext`
- Tenant-aware logging scope helper in Observability project

## Observability
- OpenTelemetry tracing/metrics scaffolding in `AddSageNetObservability`
- Correlation middleware: `X-Correlation-ID`
- Health endpoints:
  - `/health` (liveness)
  - `/ready` (model + kinesis + db placeholder)

## Configuration Boundaries
- API host settings: `src/SageNetSentinel.Api/appsettings.json`
- gRPC placeholder settings: `src/SageNetSentinel.Grpc/grpcsettings.json`
- Kinesis placeholder settings: `src/SageNetSentinel.Kinesis/kinesissettings.json`
- Observability placeholder settings: `src/SageNetSentinel.Observability/observabilitysettings.json`

## Out of Scope / TODO Platform Team
- mTLS cert provisioning and secure channel policies
- Service registry integration
- AWS IAM roles, credentials, and policy wiring
- Deployment manifests and infra provisioning
- Model registry + training pipeline integration
- Feature store integration
