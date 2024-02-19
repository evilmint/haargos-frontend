'use client';
import { Icons } from '@/components/icons';

export function FullWidthConditionalLoading({
  children,
  isLoaded,
}: {
  children: React.ReactNode;
  isLoaded: boolean;
}) {
  if (!isLoaded) {
    return (
      <div className="w-[100%] flex items-center justify-center">
        <Icons.refreshCw className="w-24 h-24 opacity-[50%] text-slate-300 m-auto animate-spin" />
      </div>
    );
  }

  return children;
}
