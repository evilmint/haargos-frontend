'use client';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function BackButton({ href }: { href?: string }) {
  let router = useRouter();

  return (
    <Button
      variant="ghost"
      className="inline"
      onClick={e => {
        e.preventDefault();
        if (href) {
          router.push(href);
        } else {
          router.back();
        }
      }}
    >
      <Icons.arrowLeftCircle className="w-6 h-6 inline -mt-1" /> Back
    </Button>
  );
}
