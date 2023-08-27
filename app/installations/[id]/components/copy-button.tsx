import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';

type CopyButtonProps = {
  textToCopy?: string;
  className?: string;
};

export default function CopyButton({
  textToCopy = 'Copy default',
  className,
}: CopyButtonProps) {
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
    <div className={cn('text-center my-5 text-gray-200 mt-1 absolute z-20 right-10', className)}>
      <button onClick={copyToClipboard} className={'rounded p-2 transition'}>
        {copied ? <Icons.check className="text-green-500" /> : <Icons.copy />}
      </button>
    </div>
  );
}
