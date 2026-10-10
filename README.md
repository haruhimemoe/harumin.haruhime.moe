# harumin.haruhime.moe

The website for [harumin](https://github.com/haruhimemoe/harumin), the osu! Discord bot: the landing page, the command reference, and the dashboard where server managers choose which links get cards.

## Running it

Needs [Bun](https://bun.sh) 1.4 and Node 24, the harumin bot running (the dashboard asks it which servers you manage), and the haruhime.moe accounts hub's database.

```sh
bun install
cp .env.example .env.local   # fill it in
bun dev
```

The command reference reads `src/data/commands.json`. Regenerate it from the bot with `bun run export-commands` in the harumin repo.

## License

MIT
