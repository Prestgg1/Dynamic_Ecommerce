---
name: frontend-migration
description: Guidelines for migrating UI components from old project designs to the new React Router structure.
---

# Frontend Migration Skill

This skill provides guidelines for migrating UI components and pages from `frontend/oldprojectdesigns` to the main `frontend/app` directory.

## Core Principles

1.  **React Router v7**: Ensure usage of React Router v7 conventions (loaders, actions, and `@react-router` imports).
2.  **Tailwind CSS**: Use consistent Tailwind classes and custom theme tokens.
3.  **Component Modularity**: Break down large legacy pages into smaller, reusable components in `frontend/app/components`.
4.  **Data Fetching**: Replace legacy `axios` or `fetch` calls with `openapi-react-query` (exposed as `trpc` in `src/lib/trpc.ts`).

## Migration Steps

1.  Identify the component or page in `frontend/oldprojectdesigns`.
2.  Create a new file in `frontend/app/components` or `frontend/app/routes` as appropriate.
3.  Rewrite the logic to use modern React patterns (hooks) and TypeScript.
4.  Implement responsive design and multi-language support (AZ/RU/EN) as per the project requirements.
