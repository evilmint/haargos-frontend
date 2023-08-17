import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

export default function CopyButton({ textToCopy = 'Copy default' }, { className }: React.HTMLAttributes<HTMLElement>) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      },
      err => {
        console.log('failed to copy', err.mesage);
      },
    );
  };

  return (
    <div className="text-center my-5 text-gray-200 mt-1 absolute z-20 right-10">
      <button onClick={copyToClipboard} className={'rounded p-2 transition'}>
        {copied ? <Icons.check className={cn("text-green-500", className)} /> : <Icons.copy />}
      </button>
    </div>
  );
}
