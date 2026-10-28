import data from '@/data/commands.json';

interface Command {
  command: string;
  description: string;
  category: string;
  permission: string | null;
  premium: boolean;
  options: { name: string; description: string; required: boolean }[];
}

const commands = data.commands as Command[];

/**
 * Commands from data/commands.json (exported from the bot, see scripts/export-commands.mts).
 * `category` filters to one category, `prefix` to one command and its subcommands.
 */
export function CommandList({ category, prefix }: { category?: string; prefix?: string }) {
  const shown = commands.filter(
    (c) =>
      (!category || c.category === category) &&
      (!prefix || c.command === prefix || c.command.startsWith(`${prefix} `))
  );

  return (
    <div className="command-list">
      {shown.map((c) => (
        <section key={c.command} className="command">
          <div className="command__head">
            <code className="command__name">{c.command}</code>
            {c.premium ? <span className="pill pill--premium">💎 Premium</span> : null}
            <span className={c.permission ? 'pill' : 'pill pill--open'}>
              {c.permission ?? 'Everyone'}
            </span>
          </div>
          <p className="command__desc">{c.description}</p>
          {c.options.length > 0 ? (
            <ul className="command__options">
              {c.options.map((o) => (
                <li key={o.name}>
                  <code>{o.name}</code>
                  {o.required ? <span className="command__req">required</span> : null}
                  <span>{o.description}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}

/** The right-click menus (Apps menu on mobile). */
export function ContextMenuList() {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Menu</th>
            <th>Right-click on</th>
            <th>Who can use it</th>
          </tr>
        </thead>
        <tbody>
          {data.menus.map((m) => (
            <tr key={`${m.kind}-${m.name}`}>
              <td>
                <strong>{m.name}</strong>
              </td>
              <td>{m.kind === 'user' ? 'A member' : 'A message'}</td>
              <td>{m.permission ?? 'Everyone'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
