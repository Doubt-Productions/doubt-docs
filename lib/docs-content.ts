import fs from 'node:fs/promises';
import path from 'node:path';

const CONTENT_ROOT = path.join(process.cwd(), 'app', '(docs)');

/** The MDX source of the page at `href` (`/` is the introduction). Build time only. */
export async function readDocSource(href: string): Promise<string> {
  const parts = href.split('/').filter(Boolean);
  if (parts.some((p) => !/^[a-z0-9-]+$/.test(p))) throw new Error(`Invalid docs path: ${href}`);
  return fs.readFile(path.join(CONTENT_ROOT, ...parts, 'page.mdx'), 'utf8');
}
