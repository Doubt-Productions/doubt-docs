import type { ReactNode } from 'react';

/** Numbered steps; each direct child (usually a list item from Markdown) is one step. */
export function Steps({ children }: { children: ReactNode }) {
  return <div className="steps">{children}</div>;
}
