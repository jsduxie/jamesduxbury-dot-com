# Contributing

Thanks for taking an interest. This is my personal portfolio site, so the feature set is deliberately mine, but it is a real full-stack application with a test suite and it is public for a reason. Bug reports, accessibility findings and documentation fixes are all welcome, and so is a pull request if you would rather send one than open an issue.

This guide covers how to get set up, what the gate is, and the conventions the repo follows.

## Ways to contribute

- **Bugs and accessibility findings**: open an issue. For a rendering or behaviour bug, the browser and the page you were on save a round trip.
- **Good first issues**: anything labelled [`good first issue`](https://github.com/jsduxie/jamesduxbury-dot-com/labels/good%20first%20issue) is scoped as a sensible entry point.
- **Code and docs**: fork, branch, and open a pull request against `main`. One change per PR gets reviewed faster than several bundled together.

## Local setup

The [README](README.md) has the full walkthrough, including the Neon branch layout, the two GitHub OAuth apps and the Docker alternative. The short version:

```bash
git clone https://github.com/jsduxie/jamesduxbury-dot-com
cd jamesduxbury-dot-com/jamesduxbury
npm install
```

Create `jamesduxbury/.env.local` with `DATABASE_URL`, `GITHUB_ID`, `GITHUB_SECRET`, `AUTH_SECRET` and `BLOB_READ_WRITE_TOKEN`, then:

```bash
npm run db:push   # apply schema.sql to an empty database
npm run db:seed   # load first-boot content
npm run dev
```

All commands run from the `jamesduxbury/` subdirectory, not the repository root. The workflows set that as their working directory too.

You do need a database. Content lives in Postgres rather than in code, so most pages fail to render without one. A free Neon project takes a couple of minutes to create, and `docker compose up` is the alternative if you would rather not sign up for anything.

## The gate

CI runs these five in order, and a pull request will not pass until all five do. Run them locally first:

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

`npm test` enforces coverage thresholds (90% statements, 90% functions, 90% lines, 85% branches), so the suite fails below them rather than warning. New code is expected to come with tests. For a bug fix, a test that fails before the change and passes after it is the clearest way to show the fix works.

`npm run build` runs the migrator before `next build`, so it needs a reachable `DATABASE_URL`. It also prerenders every public page, which is where a server-component mistake surfaces.

## Tests

Vitest with React Testing Library, under `jamesduxbury/tests/`. Three kinds:

- **Unit** tests for pure logic, no environment needed.
- **DOM** tests (`*.dom.test.tsx`) render components in jsdom.
- **Integration** tests run against the real Neon dev branch and clean up after themselves.

Test files run serially, because the integration tests share one database. That is also why CI serialises whole runs on a concurrency group. If you are adding an integration test, make sure it removes its own rows, and do not assume the database is empty when it starts.

## Database changes

Schema changes are numbered migration files applied by `src/db/migrate.ts`, and they run on every build, including the production deploy. Two rules follow from that:

- A migration must be idempotent and safe to re-run, since it will be.
- A migration must be safe against the currently deployed code, because it runs before the new build is live.

`npm run db:push` applies `schema.sql` to an empty database and is for fresh local setups only. It is not the migration path.

## Code style and conventions

- **British English** in code, comments, commits and docs (summarise, behaviour, colour). The one exception is CSS, where `color` is the property name.
- **Formatting and linting** are Prettier and ESLint. `npm run format` writes in place. There is a pre-commit hook config in the repo if you want it to run automatically.
- **Comments explain the non-obvious why**, not the what. Match the density of the surrounding code, which is low.
- **Commits** follow [Conventional Commits](https://www.conventionalcommits.org/), as do PR titles, for example `fix(a11y): add a top-level h1 to the homepage` or `chore(deps): raise the postcss floor`.

## Pull request workflow

1. Branch from `main` as `<issue>-<type>-<description>`, for example `50-fix-homepage-h1` or `62-chore-repo-meta`. The issue number first makes the branch and the discussion easy to line up.
2. Keep the PR focused on one change. If you spot something unrelated, a separate PR is easier to review and merge.
3. Run the full gate locally. The same five commands are listed above.
4. Open the PR against `main` with a short description of what changed and why. Link the issue it closes with `Closes #NN`.

Codecov posts a per-file coverage comment on every pull request. A drop below the project or patch target shows up there rather than in the test output.

I review pull requests as soon as I can and will leave clear feedback if anything needs adjusting before merge.

## Licence

By contributing, you agree that your contributions are licensed under the [MIT Licence](LICENSE) that covers this project.
