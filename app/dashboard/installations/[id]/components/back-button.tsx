'use client';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function BackButton() {
  let history = useRouter();

  return (
    <Button
      variant="ghost"
      className="inline"
      onClick={() => {
        history.back();
      }}
    >
      <Icons.arrowLeftCircle className="w-6 h-6 inline -mt-1" /> Back
    </Button>
  );
}
