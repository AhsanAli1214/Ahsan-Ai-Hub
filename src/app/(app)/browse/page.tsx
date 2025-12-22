import { AppHeader } from '@/components/layout/AppHeader';
import { ToolGrid } from '@/components/tools/ToolGrid';
import { tools } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Browse Tools | AI Hub Express',
};

export default function BrowsePage({
  searchParams,
}: {
  searchParams?: {
    q?: string;
    category?: string;
  };
}) {
  const query = searchParams?.q || '';
  const category = searchParams?.category || '';

  return (
    <div className="flex h-full flex-col">
      <AppHeader title="Browse Tools" />
      <div className="flex-1 overflow-y-auto">
        <ToolGrid allTools={tools} query={query} category={category} />
      </div>
    </div>
  );
}
