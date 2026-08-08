# Contributing Guide

## Prerequisites

- Node.js 20+
- pnpm 9+

## Setup

```bash
git clone https://github.com/your-username/headless-media-sdk
cd headless-media-sdk
pnpm install
cp .env.example apps/web/.env.local
# Add your Pexels API key to apps/web/.env.local
```

## Development

```bash
# Run the web app
pnpm dev

# Run tests (all packages)
pnpm test

# Run tests for a specific package
pnpm --filter @headless-media/core test

# Typecheck
pnpm typecheck

# Lint
pnpm lint

# Storybook
pnpm --filter @headless-media/ui-react storybook
```

## Project Conventions

### Commit Messages

Use conventional commits:

```
feat(media-core): add request timeout configuration
fix(media-react): correct useSearch page reset on setQuery
docs: update useGrid Storybook story
test(media-core): add EventEmitter once() test
```

### Adding a new hook to media-react

1. Create `packages/media-react/src/hooks/useYourHook.ts`
2. Export from `packages/media-react/src/index.ts`
3. Add tests
4. Document in `skills/media-react-data-skill.md`

### Adding a new headless component to media-ui-react

1. Create `packages/media-ui-react/src/hooks/useYourComponent.ts`
2. **NEVER import from `@headless-media/core` or `@headless-media/react`**
3. Export from `packages/media-ui-react/src/index.ts`
4. Add a Storybook story
5. Add tests
6. Document in `skills/media-ui-react-components-skill.md`

### Boundary rules

Run the boundary audit before opening a PR:

```bash
# Verify media-core has no React imports
grep -r "from ['\"]react" packages/media-core/src/ --include="*.ts"

# Verify media-ui-react has no SDK imports
grep -r "from.*@headless-media" packages/media-ui-react/src/ --include="*.ts"
```

These checks also run in CI.

## Changesets

We use [Changesets](https://github.com/changesets/changesets) for version management.

```bash
# Add a changeset after making changes
pnpm changeset

# Preview the next version
pnpm changeset status
```

## Pull Request Process

1. Fork the repo and create a feature branch
2. Run `pnpm test && pnpm typecheck && pnpm lint`
3. Add a changeset if you changed a package
4. Open a PR — CI will run automatically
