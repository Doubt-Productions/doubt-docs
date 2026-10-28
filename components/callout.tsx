import type { ReactNode } from 'react';

const LABELS = { note: 'Note', tip: 'Tip', warning: 'Heads up', premium: '💎 Premium' } as const;

/** A highlighted box in the page: `<Callout type="tip">…</Callout>`. */
export function Callout({
  type = 'note',
  title,
  children,
}: {
  type?: keyof typeof LABELS;
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className={`callout callout--${type}`}>
      <p className="callout__title">{title ?? LABELS[type]}</p>
      <div className="callout__body">{children}</div>
    </aside>
  );
}
