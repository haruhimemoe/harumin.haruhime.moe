# Contributing

Bug reports and fixes are welcome. For anything bigger than a fix, open an [issue](https://github.com/haruhimemoe/harumin.haruhime.moe/issues) first so we can agree on it.

Read [AGENTS.md](./AGENTS.md) before changing code. It has the layout and code style.

## Setup

You need [Bun](https://bun.sh) (the version in `package.json`) and Node 24 or later.

```sh
bun install
```

Copy `.env.example` to `.env.local` and fill it in to run `bun dev`. The dashboard needs the harumin bot running and the haruhime.moe accounts hub's database. The tests need neither.

## Making a change

1. Branch from `main` (`feat/<topic>`, `fix/<topic>`).
2. Write a failing test in `tests/`, make it pass, and keep commits small. Use [Conventional Commits](https://www.conventionalcommits.org/).
3. Run the full check before opening a PR:

   ```sh
   bun run check && bun run typecheck && bun run test:coverage && SKIP_ENV_VALIDATION=true bun run build
   ```

4. Add a line to `CHANGELOG.md` under `## [Unreleased]`.
5. Open a PR. CI must be green before merge.
