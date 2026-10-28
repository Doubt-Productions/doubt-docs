'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { SearchEntry } from '@/lib/search-index';

function SearchIcon({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="m16 16 4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SearchDialog({ entries }: { entries: SearchEntry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  const results = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0) return entries.filter((entry) => entry.kind === 'page');
    return entries
      .filter((entry) => {
        const haystack = `${entry.title} ${entry.description} ${entry.group}`.toLowerCase();
        return words.every((word) => haystack.includes(word));
      })
      .sort((a, b) => (a.kind === b.kind ? 0 : a.kind === 'page' ? -1 : 1))
      .slice(0, 12);
  }, [entries, query]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLElement && event.target.closest('input, textarea');
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      } else if (event.key === '/' && !typing) {
        event.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      setQuery('');
      setIndex(0);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  function go(href: string) {
    setOpen(false);
    router.push(href);
  }

  function onInputKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter' && results[index]) {
      event.preventDefault();
      go(results[index].href);
    }
  }

  return (
    <>
      <button
        type="button"
        className="search-trigger"
        onClick={() => setOpen(true)}
        aria-label="Search docs"
      >
        <SearchIcon size={16} />
        <span className="search-trigger__label">Search docs</span>
        <kbd className="search-trigger__kbd">Ctrl K</kbd>
      </button>

      <dialog
        ref={dialogRef}
        className="search-dialog"
        aria-label="Search docs"
        onClose={() => setOpen(false)}
      >
        <div className="search-dialog__panel">
          <div className="search-dialog__field">
            <SearchIcon size={18} />
            <input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIndex(0);
              }}
              onKeyDown={onInputKey}
              placeholder="Search pages and sections…"
              aria-label="Search pages"
              aria-controls="search-results"
              aria-activedescendant={results[index] ? `search-result-${index}` : undefined}
            />
            <button type="button" className="search-dialog__close" onClick={() => setOpen(false)}>
              Esc
            </button>
          </div>
          <div id="search-results" className="search-dialog__results" role="listbox">
            {results.length === 0 ? (
              <p className="search-dialog__empty">No pages match “{query}”.</p>
            ) : (
              results.map((item, i) => (
                <div
                  key={`${item.kind}-${item.href}`}
                  id={`search-result-${i}`}
                  role="option"
                  tabIndex={-1}
                  aria-selected={i === index}
                  className={i === index ? 'search-result is-active' : 'search-result'}
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => go(item.href)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') go(item.href);
                  }}
                >
                  <span className="search-result__group">
                    {item.kind === 'section' ? `${item.group} › ${item.description}` : item.group}
                  </span>
                  <strong>
                    {item.kind === 'section' ? <span aria-hidden="true"># </span> : null}
                    {item.title}
                  </strong>
                  {item.kind === 'page' ? <span>{item.description}</span> : null}
                </div>
              ))
            )}
          </div>
        </div>
      </dialog>
    </>
  );
}
