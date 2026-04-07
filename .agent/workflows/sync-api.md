---
description: Generate TypeScript types from backend OpenAPI schema
---

This workflow synchronizes the frontend types with the backend API definition.

1. Ensure the backend is running (at `http://localhost:4000`).
// turbo
2. Run the OpenAPI generation script in the frontend directory:
   ```bash
   cd frontend && npm run openapi
   ```
3. Verify that `frontend/app/lib/types.ts` has been updated with the latest schema.
