import { readDocSource } from './docs-content';
import { navigation } from './nav';
import { slugify } from './slug';

export interface SearchEntry {
  kind: 'page' | 'section';
  title: string;
  href: string;
  description: string;
  group: string;
}

/** Plain heading text, matching what the rendered MDX heading contains. */
function headingText(markdown: string): string {
  return markdown
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[`*]/g, '')
    .trim();
}

/** Every page and its h2/h3 sections, built once at build time and shipped with the page. */
export async function getSearchIndex(): Promise<SearchEntry[]> {
  const entries: SearchEntry[] = [];
  for (const group of navigation) {
    for (const item of group.items) {
      entries.push({ kind: 'page', ...item, group: group.title });
      const source = await readDocSource(item.href);
      for (const match of source.matchAll(/^#{2,3}\s+(.+)$/gm)) {
        const title = headingText(match[1]);
        entries.push({
          kind: 'section',
          title,
          href: `${item.href === '/' ? '' : item.href}#${slugify(title)}`.replace(/^#/, '/#'),
          description: item.title,
          group: group.title,
        });
      }
    }
  }
  return entries;
}
