import Link from 'next/link';
import { links } from '@/lib/links';
import { navigation } from '@/lib/nav';
import { getSearchIndex } from '@/lib/search-index';
import { BrandLockup } from './logo';
import { MobileNav } from './mobile-nav';
import { SearchDialog } from './search-dialog';
import { Sidebar } from './sidebar';
import { TableOfContents } from './table-of-contents';
import { ThemeToggle } from './theme-toggle';

export async function DocsShell({ children }: { children: React.ReactNode }) {
  const searchIndex = await getSearchIndex();

  return (
    <div className="docs-shell">
      <a href="#content" className="skip-link">
        Skip to content
      </a>
      <header className="docs-header">
        <div className="docs-header__inner">
          <div className="docs-header__left">
            <MobileNav />
            <Link href="/" className="docs-brand" aria-label="Doubt Docs home">
              <BrandLockup />
            </Link>
          </div>
          <div className="docs-header__right">
            <SearchDialog entries={searchIndex} />
            <a className="docs-header__link" href={links.dashboard}>
              Dashboard
            </a>
            <a className="docs-header__cta" href={links.invite}>
              Add to Discord
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="docs-body">
        <aside className="docs-sidebar">
          <div className="docs-sidebar__inner">
            <Sidebar />
          </div>
        </aside>
        <main id="content" className="docs-main" tabIndex={-1}>
          <article className="docs-article">{children}</article>
        </main>
        <aside className="docs-toc">
          <div className="docs-toc__inner">
            <TableOfContents />
          </div>
        </aside>
      </div>

      <footer className="docs-footer">
        <div className="docs-footer__inner">
          <div className="docs-footer__brand">
            <BrandLockup />
            <p>
              Your server, <span className="grad-text">without a doubt.</span>
            </p>
            <p>
              Contact: <a href={`mailto:${links.email}`}>{links.email}</a>
            </p>
          </div>
          {navigation.map((group) => (
            <nav key={group.title} className="docs-footer__col" aria-label={group.title}>
              <p className="docs-footer__title">{group.title}</p>
              <ul>
                {group.items.slice(0, 5).map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>{item.title}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <nav className="docs-footer__col" aria-label="Doubt">
            <p className="docs-footer__title">Doubt</p>
            <ul>
              <li>
                <a href={links.site}>Website</a>
              </li>
              <li>
                <a href={links.support}>Support server</a>
              </li>
              <li>
                <a href={links.privacy}>Privacy</a>
              </li>
              <li>
                <a href={links.terms}>Terms</a>
              </li>
            </ul>
          </nav>
        </div>
        <p className="docs-footer__legal">
          © {new Date().getFullYear()} Doubt Productions. Not affiliated with Discord.
        </p>
      </footer>
    </div>
  );
}
