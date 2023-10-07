# itsjavi's JS/TypeScript tools

Various tools for JS/TS development.

This is a monorepo containing various packages.
Each public package is published to npm under the `@itsjavi` scope.

## Packages

- `cn`: A simple classnames utility, similar to clsx, but with the ability to use arrays instead of objects 
for the conditionals.
- `semver-release`: A CLI tool to release a new version of every package in a monorepo.

## Tech stack

- PNPM: Package manager
- Turbo: Monorepo manager
- Biome: JS/TS linter and formatter
- tsup and Vite: Bundler and dev server
- Bun: Test and script/task runner
- React: Frontend framework
