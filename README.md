# Bytebrief

A small Medium-inspired technical blogging platform built with Node.js and vanilla JavaScript.

## Run locally

```bash
npm start
```

Open http://localhost:3000.

## Run with Docker

```bash
docker compose up --build
```

The app is available at http://localhost:3000. The health endpoint is http://localhost:3000/health.

## Azure DevOps CI/CD

The `azure-pipelines.yml` pipeline builds the Docker image and pushes it to Azure Container Registry whenever changes land on `main`.

Before creating the pipeline in Azure DevOps:

1. Create an Azure Resource Manager service connection with access to the target ACR, then grant that service principal the `AcrPush` role on the registry.
2. Update `dockerRegistryServiceConnection` with the exact Azure DevOps service connection name.
3. The pipeline targets the `bytebrief` registry at `bytebrief.azurecr.io`.
4. Create a pipeline from this repository and select `azure-pipelines.yml`.

Images are published with immutable build and commit tags:

```text
bytebrief.azurecr.io/bytebrief:build-<build-id>
bytebrief.azurecr.io/bytebrief:sha-<commit-sha>
```