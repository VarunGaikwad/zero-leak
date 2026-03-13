# Zero Leak Mono-repo

A modern, high-performance mono-repo built with **pnpm Workspaces** and **TypeScript**.

## Architecture

- **`apps/web`**: Frontend built with React, Vite, and Tailwind CSS.
- **`apps/api`**: Backend built with Express and tsx.
- **`packages/types`**: Shared TypeScript definitions used by both frontend and backend.

## Getting Started

### Prerequisites
- [pnpm](https://pnpm.io/installation) installed globally.

### Installation
```bash
pnpm install
```

### Development
Start both the API and Web apps in parallel:
```bash
pnpm dev
```

Or start them individually:
```bash
pnpm dev:api
pnpm dev:web
```

## Shared Types
Types defined in `packages/types` can be imported in any app:
```typescript
import { User } from '@zeroleak/types';
```
