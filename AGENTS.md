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
