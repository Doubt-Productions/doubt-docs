# doubt-docs

Documentation for [Doubt](https://doubtbot.eu), served at **https://docs.doubtbot.eu**. Next.js 16 with MDX, exported as a static site and hosted on Vercel. Same colours and fonts as [doubt-site](https://github.com/Doubt-Productions/doubt-site).

## Run it

```bash
yarn install
yarn dev            # http://localhost:3000
yarn build          # static export to out/
yarn biome:fix      # lint and format
yarn typecheck
```

## Content

Every page is `app/(docs)/<path>/page.mdx`. A new page also needs an entry in `lib/nav.ts`: the sidebar, search, sitemap and footer all read that list.

| URL                      | Page                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------ |
| `/`                      | Introduction                                                                         |
| `/getting-started`       | Add Doubt to your server                                                             |
| `/dashboard`             | Dashboard                                                                            |
| `/features/*`            | moderation, automod, tickets, welcome, levelling, economy, utility, reports, premium |
| `/reference/commands`    | Command list (generated, see below)                                                  |
| `/reference/permissions` | Permissions                                                                          |
| `/security`              | Security and data                                                                    |
| `/faq`                   | FAQ                                                                                  |

MDX pages can use `<Callout type="note|tip|warning|premium">`, `<Steps>` around a numbered list, `<CommandList category="…" prefix="/…" />` and `<ContextMenuList />`. `##` and `###` headings get anchors and show up in the table of contents and search.

Privacy and terms live on doubtbot.eu (`/privacy`, `/terms`); the docs link there instead of keeping a copy.

## Command list

`data/commands.json` is generated from the bot's own discordx metadata, so the docs match what Discord shows. After a command changes in doubt-bot, regenerate it from a doubt-bot checkout next to this one:

```bash
cd ../doubt-bot
yarn install --frozen-lockfile && yarn prisma:generate
npx tsx ../doubt-docs/scripts/export-commands.mts ../doubt-docs/data/commands.json
```

It only imports the command files (nothing connects to Discord or the database). Staff-only commands are left out.

## Redirects

`vercel.json` sends the old Mintlify paths (`/introduction`, `/guides/commands`, `/legal/privacy`, …) to their new pages. Old `doubtbot.eu/docs/*` links are redirected to this site by doubt-site.

## Pull requests

PR titles are Conventional Commits (`docs:`, `feat:`, `fix:`, …), checked by `pr-title.yml`. CI runs Biome, the type check and the build; a separate workflow scans for secrets.
