import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/links';
import { navigation } from '@/lib/nav';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return navigation.flatMap((group) =>
    group.items.map((item) => ({ url: `${SITE_URL}${item.href === '/' ? '' : item.href}` }))
  );
}
