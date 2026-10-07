# AGENTS.md

harumin.haruhime.moe: Next 16, React 19, Tailwind 4, `@haruhimemoe/ui` 0.20 in its light scheme, `@haruhimemoe/next-kit` for the hub session.

- `src/app/`: landing, `/commands`, `/dashboard`, `/dashboard/[guildId]` (+ `actions.ts`), legal pages.
- `src/lib/`: `auth.ts` (hub session), `auth-identity.ts`, `bot.ts` (the bot's service routes), `dashboard.ts` (save rules, testable), `settings.ts` (Mongo through harumin-config), `commands.ts`.
- `src/components/`: header and footer, hit circles, the sample chat, the settings form.

## Rules

- The guild list always comes from the bot. Never trust a guild id from the URL without `findManaged`.
- Writes go through `@haruhimemoe/harumin-config` (`guildSettingsPatchSchema`), so the bot can read them.
- The identity database is read-only.
- Pink `#ff66ab` is decoration and fills. Pink text uses `text-h1`.
- `@haruhimemoe/harumin-config` comes from `vendor/` until it's on npm. Repack it there when it changes.

```sh
bun run check && bun run typecheck && bun run test && bun run build
```

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
