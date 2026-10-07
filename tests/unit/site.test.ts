/**
 * @file tests/unit/site.test.ts
 * @desc Dashboard rules (form reading, the save gate), the bot client against a fake fetch,
 *       settings storage against in-memory MongoDB, env parsing, and the command list helpers.
 * @author David @dvhsh (https://dvh.sh)
 * @created Tue Oct 6, 2026
 * @modified Tue Oct 6, 2026
 */

import { MongoClient } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { inviteUrl } from "@/constants/site";
import { parseServerEnv } from "@/env";
import { readDiscordId } from "@/lib/auth-identity";
import { BotUnavailableError, createBotClient } from "@/lib/bot";
import { COMMANDS, groupCommands, usageLine } from "@/lib/commands";
import { readSettingsForm, saveGuildForm } from "@/lib/dashboard";
import { listTracks, loadSettings, saveSettings } from "@/lib/settings";

const GUILD = "123456789012345678";
const USER = "876543210987654321";
const TOKEN = "t".repeat(40);

const form = (entries: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(entries)) data.set(key, value);
  return data;
};

describe("dashboard rules", () => {
  it("reads the form", () => {
    expect(readSettingsForm(form({ map: "on", defaultMode: "mania" }))).toEqual({
      autoEmbeds: { map: true, match: false, pack: false, pool: false, bb: false },
      defaultMode: "mania",
    });
    expect(readSettingsForm(form({ defaultMode: "auto" }))?.defaultMode).toBeNull();
    expect(readSettingsForm(form({ defaultMode: "std" }))).toBeNull();
  });

  it("saves only for a manager the bot confirms", async () => {
    const save = vi.fn(async () => ({}) as never);
    const deps = {
      discordId: async () => USER,
      manageableGuilds: async () => [{ id: GUILD, name: "x", icon: null }],
      save,
      revalidateBot: async () => Promise.reject(new Error("offline")),
    };
    expect(await saveGuildForm("nope", form({}), deps)).toMatchObject({ ok: false });
    expect(
      await saveGuildForm(GUILD, form({}), { ...deps, discordId: async () => null }),
    ).toMatchObject({ ok: false });
    expect(
      await saveGuildForm(GUILD, form({}), {
        ...deps,
        manageableGuilds: async () => Promise.reject(new Error()),
      }),
    ).toMatchObject({ ok: false });
    expect(
      await saveGuildForm(GUILD, form({}), { ...deps, manageableGuilds: async () => [] }),
    ).toMatchObject({ ok: false });
    expect(await saveGuildForm(GUILD, form({ defaultMode: "std" }), deps)).toMatchObject({
      ok: false,
    });
    expect(save).not.toHaveBeenCalled();
    expect(await saveGuildForm(GUILD, form({ map: "on" }), deps)).toMatchObject({ ok: true });
    expect(save).toHaveBeenCalledWith(GUILD, expect.objectContaining({ defaultMode: null }), USER);
  });
});

describe("bot client", () => {
  it("calls with the bearer and parses answers", async () => {
    const fetch = vi.fn(async (url: URL | string, init?: RequestInit) => {
      expect((init?.headers as Record<string, string> | undefined)?.Authorization).toBe(`Bearer ${TOKEN}`);
      const path = new URL(url).pathname;
      if (path === "/guilds/manageable")
        return Response.json({ guilds: [{ id: GUILD, name: "x", icon: null }] });
      if (path.endsWith("/channels"))
        return path.includes(GUILD)
          ? Response.json({ channels: [{ id: GUILD, name: "general" }] })
          : new Response(null, { status: 404 });
      return new Response(null, { status: 204 });
    });
    const bot = createBotClient({
      baseUrl: "http://bot",
      token: TOKEN,
      fetch: fetch as typeof globalThis.fetch,
    });
    expect(await bot.manageableGuilds(USER)).toHaveLength(1);
    expect(await bot.guildChannels(GUILD)).toEqual([{ id: GUILD, name: "general" }]);
    expect(await bot.guildChannels(USER)).toEqual([]);
    await bot.revalidate(GUILD);
    expect(fetch).toHaveBeenCalledTimes(4);
  });

  it("reports an unreachable or broken bot", async () => {
    const down = createBotClient({
      baseUrl: "http://bot",
      token: TOKEN,
      fetch: (async () => Promise.reject(new Error("x"))) as typeof fetch,
    });
    await expect(down.manageableGuilds(USER)).rejects.toBeInstanceOf(BotUnavailableError);
    const bad = createBotClient({
      baseUrl: "http://bot",
      token: TOKEN,
      fetch: (async () => new Response(null, { status: 401 })) as typeof fetch,
    });
    await expect(bad.manageableGuilds(USER)).rejects.toBeInstanceOf(BotUnavailableError);
    const junk = createBotClient({
      baseUrl: "http://bot",
      token: TOKEN,
      fetch: (async () => Response.json({ nope: 1 })) as typeof fetch,
    });
    await expect(junk.manageableGuilds(USER)).rejects.toBeInstanceOf(BotUnavailableError);
  });
});

describe("storage", () => {
  let server: MongoMemoryServer;
  let client: MongoClient;
  beforeAll(async () => {
    server = await MongoMemoryServer.create();
    client = await MongoClient.connect(server.getUri());
  });
  afterAll(async () => {
    await client?.close();
    await server?.stop();
  });

  it("loads defaults, saves patches, lists tracks", async () => {
    const db = client.db("harumin");
    expect((await loadSettings(db, GUILD)).autoEmbeds.map).toBe(true);
    await saveSettings(db, GUILD, { autoEmbeds: { map: false } }, USER);
    expect(await loadSettings(db, GUILD)).toMatchObject({
      autoEmbeds: { map: false, pack: true },
      updatedBy: USER,
    });
    await db.collection("tracks").insertMany([
      {
        guildId: GUILD,
        channelId: GUILD,
        osuId: 2,
        username: "peppy",
        mode: "osu",
        addedBy: USER,
        addedAt: new Date(),
      },
      { guildId: GUILD, junk: true },
    ]);
    expect(await listTracks(db, GUILD)).toHaveLength(1);
  });

  it("reads the linked Discord id", async () => {
    const identity = client.db("identity");
    const { insertedId } = await identity.collection("user").insertOne({ discordId: USER });
    await identity.collection("user").insertOne({ _id: "plain" as never, discordId: "bad" });
    expect(await readDiscordId(identity, insertedId.toHexString())).toBe(USER);
    expect(await readDiscordId(identity, "plain")).toBeNull();
  });
});

describe("env, invite, commands", () => {
  it("parses env without printing values", () => {
    expect(() => parseServerEnv({})).toThrow("MONGODB_URI");
    expect(
      parseServerEnv({
        MONGODB_URI: "mongodb://x",
        BETTER_AUTH_SECRET: "s".repeat(32),
        HARUMIN_SERVICE_URL: "http://bot",
        HARUMIN_SERVICE_TOKEN: TOKEN,
      }).HUB_URL,
    ).toBe("https://haruhime.moe");
  });

  it("builds invites and groups commands", () => {
    expect(new URL(inviteUrl(GUILD)).searchParams.get("disable_guild_select")).toBe("true");
    expect(groupCommands(COMMANDS).map((g) => g.category)).toEqual(["osu", "haruhime", "bot"]);
    expect(usageLine("x", [{ name: "a", description: "", type: "text", required: true }])).toBe(
      "/x <a>",
    );
  });
});
