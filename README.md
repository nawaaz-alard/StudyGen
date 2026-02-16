# StudyGen - Consolidated Learning Platform

This repository contains the source code for the consolidated StudyGen platform, unifying Afrikaans, Life Science, and Math modules into a single Azure Static Web App.

## Architecture

- **Frontend**: React + TypeScript (Vite). Located in `frontend/`.
- **API**: Azure Functions (TypeScript, v4). Located in `api/`.
- **Infrastructure**: Bicep templates for Azure Resources. Located in `infra/`.
- **CI/CD**: GitHub Actions workflow in `.github/workflows/deploy.yml`.

## Prerequisites

- Node.js 18+
- Azure CLI (if deploying manually)
- Azure Functions Core Tools (for local API debugging)

## Getting Started

1.  **Install Frontend Dependencies**:
    ```bash
    cd frontend
    npm install
    ```

2.  **Install API Dependencies**:
    ```bash
    cd ../api
    npm install
    ```

3.  **Run Locally (Frontend + Mock Data)**:
    ```bash
    cd frontend
    npm run dev
    ```

4.  **Run Locally (Full Stack with API)**:
    Install the Azure Static Web Apps CLI:
    ```bash
    npm install -g @azure/static-web-apps-cli
    ```
    Run from the root of the repo:
    ```bash
    swa start frontend --api-location api
    ```

## Deployment

The GitHub Action automatically validates infrastructure and deploys the app on push to `main`.
Ensure the following repository secrets are set:
- `AZURE_STATIC_WEB_APPS_API_TOKEN` (for the Static Web App)
- `AZURE_SUBSCRIPTION_ID`, `AZURE_TENANT_ID`, `AZURE_CLIENT_ID` (for Infrastructure deployment via Azure Login)
- `AZURE_RG` (Resource Group Name)
