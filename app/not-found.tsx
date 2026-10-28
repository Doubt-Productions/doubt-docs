import Link from 'next/link';
import { DocsShell } from '@/components/docs-shell';

export default function NotFound() {
  return (
    <DocsShell>
      <p className="eyebrow">404</p>
      <h1>This page doesn’t exist</h1>
      <p>
        It may have moved when the docs were rebuilt. Try the search at the top, or start from the{' '}
        <Link href="/">introduction</Link>.
      </p>
    </DocsShell>
  );
}
