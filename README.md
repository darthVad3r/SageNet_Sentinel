# SageNet Sentinel

SageNet Sentinel is a .NET 9 fraud detection platform that exposes multiple integration surfaces over a shared scoring domain. The solution currently includes a REST API, a gRPC scoring service, shared contracts, ML-based fraud detection services, and optional AWS SageMaker integration.

## Current Scope

The application is designed to:
- score financial transactions for fraud risk
- support local ML.NET-based inference
- optionally integrate with AWS SageMaker
- reduce false positives with an ensemble strategy
- expose platform-facing REST endpoints for scoring, metadata, model management, tenant configuration, alerts, and history
- provide a gRPC surface for real-time scoring
- establish a basic multi-tenant foundation via tenant identifiers

## Solution Structure

- `src/SageNetSentinel.Api` - ASP.NET Core REST API host
- `src/SageNetSentinel.Grpc` - gRPC scoring host and protobuf contracts
- `src/SageNetSentinel.Contracts` - shared request, response, and tenant contracts
- `src/SageNetSentinel.ML` - ML.NET services, ensemble logic, risk analysis, and model repository implementation
- `src/SageNetSentinel.SageMaker` - optional AWS SageMaker-backed fraud detection service

## REST API Surface

The REST API currently includes endpoints for:
- `POST /api/FraudDetection/analyze` - analyze a single transaction
- `POST /api/FraudDetection/analyze/batch` - analyze a batch of transactions
- `GET /api/FraudDetection/statistics` - return placeholder fraud statistics
- `GET /api/FraudDetection/health` - basic service health response
- `GET /api/Metadata/model` - model metadata
- `POST /api/ModelManagement/train` - trigger model training
- `GET /api/ModelManagement/status` - model status
- `POST /api/ModelManagement/retrain` - queue placeholder retraining
- `GET /api/Tenant/{tenantId}` - fetch tenant configuration
- `POST /api/Tenant/{tenantId}` - save tenant configuration
- `GET /api/History/{tenantId}` - fetch placeholder tenant history
- `POST /api/History/record` - record placeholder history entries
- `GET /api/Alerts/summary/{tenantId}` - fetch placeholder alert summary

Swagger is enabled in development.

## gRPC Surface

The gRPC project currently exposes a unary scoring method:
- `Scoring.Score(FraudScoringRequest) returns (FraudScoringResponse)`

The request contract includes:
- `transaction`
- `tenantId`
- `includeFeatureImportance`

The gRPC service maps protobuf messages into internal contracts before delegating to the fraud detection service.

## Multi-Tenant Foundation

The solution currently includes basic tenant-aware plumbing:
- REST requests can provide `X-Tenant-Id`
- gRPC requests include `tenantId`
- `TenantContext` defaults to `default` when tenant information is missing

This is currently foundational only. Full tenant-aware model selection and tenant isolation are still future work.

## ML and Scoring Model

The platform currently supports:
- local ML.NET scoring
- optional SageMaker-backed scoring
- ensemble scoring with weighted combination
- rule-based and risk-analysis helpers in the ML layer

Configuration for model path, SageMaker settings, and false-positive reduction behavior is available in `src/SageNetSentinel.Api/appsettings.json`.

## Observability and Platform Readiness

Observability is scaffolded but not complete yet:
- observability registration exists as a placeholder extension
- OpenTelemetry exporters are still TODO
- gRPC mTLS configuration is still TODO
- service registry integration is still TODO
- history, alerts, and tenant persistence are currently placeholder in-memory implementations

## Getting Started

### Run the REST API

`dotnet run --project src/SageNetSentinel.Api`

### Run the gRPC Service

`dotnet run --project src/SageNetSentinel.Grpc`

### Build the Solution

`dotnet build`

## Current Status

This repository is currently a working fraud detection platform scaffold with usable scoring paths and integration surfaces, but some areas are intentionally incomplete for future platform work. The main gaps today are:
- production-grade tenant isolation
- persistent storage for history, alerts, and tenant configuration
- full observability/exporter setup
- production gRPC security configuration
- async ingestion surfaces such as Kinesis

## Roadmap Direction

Planned or proposed expansion areas include:
- solution restructuring for clearer shared-core boundaries
- Kinesis-based ingestion and async scoring
- stronger observability and readiness checks
- hardened platform integration endpoints
- additional developer and deployment documentation

## Platform Integration

SageNet Sentinel now includes REST, gRPC, and Kinesis-ready scaffolding with observability and multi-tenant foundations. See `docs/PLATFORM_INTEGRATION.md` for endpoint and configuration details.
