---
name: kolaboria-frontend-docs
description: Use when analyzing, planning, implementing, reviewing, or debugging the Kolaboria Nuxt frontend. Read the local frontend documentation first and follow its architecture, API-contract, design-system, and testing boundaries before changing code.
---

# Kolaboria Frontend Documentation Guardrail

Read `references/frontend-docs.md` before changing frontend code. It maps each task to the authoritative document under the shared workspace `docs/` directory.

## Workflow

1. Identify the affected domain and read its feature document plus the referenced frontend guidance.
2. Inspect the matching page, component, composable, service, and type before proposing changes.
3. Keep boundaries intact: pages/components render; composables manage reactive UI state; services call the API; backend owns authorization.
4. Preserve the API field casing and payload shapes defined by the relevant frontend type and service.
5. Use existing `Atomic*`, `Molecule*`, or `Organism*` components and CSS tokens before introducing new UI primitives.
6. Verify with the documented build and manual state checks; do not claim a test runner exists unless it is installed in `apps/client/package.json`.

## Non-negotiable checks

- Do not make direct API calls from pages or components when a domain service/composable exists.
- Do not add arbitrary hex colors or bypass the design-system component hierarchy.
- Do not treat frontend visibility rules as authorization; the Go API remains the enforcement point.
- When a frontend change changes an API/schema contract, update the relevant frontend type, service, and technical guideline in the same change.
