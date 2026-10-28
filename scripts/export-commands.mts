/**
 * Writes Doubt's public command list to data/commands.json, read from discordx's own metadata so
 * the docs never drift from the bot. Run it from a doubt-bot checkout with its dependencies
 * installed and the Prisma client generated:
 *
 *   cd ../doubt-bot && npx tsx ../doubt-docs/scripts/export-commands.mts ../doubt-docs/data/commands.json
 *
 * It only imports the command files; nothing connects to Discord or the database.
 */
import { readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const botDir = resolve(process.cwd());
const out = process.argv[2];
if (!out) throw new Error('Pass the output path, e.g. ../doubt-docs/data/commands.json');

const load = (path: string) => import(pathToFileURL(join(botDir, 'node_modules', path)).href);
const { MetadataStorage } = (await load('discordx/dist/index.mjs')) as typeof import('discordx');
const { PermissionsBitField } = (await load(
  'discord.js/src/index.js'
)) as typeof import('discord.js');

function sources(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sources(path);
    return entry.name.endsWith('.ts') && !entry.name.endsWith('.test.ts') ? [path] : [];
  });
}

for (const file of sources(join(botDir, 'src/commands'))) await import(pathToFileURL(file).href);
await MetadataStorage.instance.build();
const meta = MetadataStorage.instance;

/** Staff-only tools live in Doubt's own server and aren't part of the public docs. */
const HIDDEN_CATEGORIES = new Set(['Administration']);
/** Subcommands of a Premium group that work without Premium (see /premium in the bot). */
const FREE_SUBCOMMANDS = new Set(['list', 'delete', 'reset']);
const STAFF_GUARDS = new Set(['StaffOnly', 'DeveloperOnly', 'BotAdminOnly']);

/** Discord's own names, as members see them in Server Settings. */
const PERMISSION_LABELS: Record<string, string> = {
  ManageGuild: 'Manage Server',
  ModerateMembers: 'Timeout Members',
  KickMembers: 'Kick Members',
  BanMembers: 'Ban Members',
  ManageMessages: 'Manage Messages',
  Administrator: 'Administrator',
};

function permissionLabel(bits: bigint | number | string | null | undefined): string | null {
  if (bits === null || bits === undefined) return null;
  const names = new PermissionsBitField(BigInt(bits)).toArray();
  return names.map((n) => PERMISSION_LABELS[n] ?? n).join(', ') || null;
}

type Guarded = { guards?: { fn: { name: string } }[]; _guards?: { fn: { name: string } }[] };
const guardNames = (d: Guarded) => (d.guards ?? d._guards ?? []).map((g) => g.fn.name);

const roots = new Map(meta.applicationCommandSlashes.map((s) => [s.name, s]));

const commands = meta.applicationCommandSlashesFlat
  .map((slash) => {
    const root = roots.get(slash.group ?? slash.name);
    const guards = guardNames(slash as unknown as Guarded);
    const category: string = (slash as unknown as { category?: string }).category ?? 'Other';
    const path = ['', slash.group, slash.subgroup, slash.name].filter((p) => p !== undefined);
    let permission = permissionLabel(
      slash.defaultMemberPermissions ?? root?.defaultMemberPermissions
    );
    if (!permission && guards.includes('ManageGuildOnly')) permission = 'Manage Server';
    if (!permission && /\(Manage Server\)/.test(slash.description)) permission = 'Manage Server';
    // A "(Premium)" group marks every subcommand except the ones that tidy up, which stay free.
    const premium =
      /\(Premium\)/.test(slash.description) ||
      (/\(Premium\)/.test(root?.description ?? '') && !FREE_SUBCOMMANDS.has(slash.name));
    return {
      command: path.join(' ').replace(/^ /, '/'),
      description: slash.description.replace(/\s*\((Premium|Manage Server)\)/g, ''),
      category,
      permission,
      premium,
      staffOnly: guards.some((g) => STAFF_GUARDS.has(g)),
      options: slash.options.map((o) => ({
        name: o.name,
        description: o.description,
        required: Boolean(o.required),
      })),
    };
  })
  .filter((c) => !HIDDEN_CATEGORIES.has(c.category) && !c.staffOnly)
  .map(({ staffOnly: _staffOnly, ...c }) => c)
  .sort((a, b) => a.command.localeCompare(b.command));

const menus = [
  ...meta.applicationCommandUsers.map((m) => ({ menu: m, kind: 'user' as const })),
  ...meta.applicationCommandMessages.map((m) => ({ menu: m, kind: 'message' as const })),
]
  .map(({ menu, kind }) => ({
    name: menu.name,
    kind,
    permission: permissionLabel(menu.defaultMemberPermissions),
  }))
  .sort((a, b) => a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name));

writeFileSync(resolve(out), `${JSON.stringify({ commands, menus }, null, 2)}\n`);
console.log(`Wrote ${commands.length} commands and ${menus.length} context menus to ${out}`);
