import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';
import { useState } from 'react';

type CopyButtonProps = {
  textToCopy?: string;
  className?: string;
};

export default function CopyButton({
  textToCopy = 'Copy default',
  className,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div
      className={cn(
        'text-center my-5 text-gray-200 mt-1 absolute z-20 right-10',
        className,
      )}
    >
      <button onClick={copyToClipboard} className={'rounded p-2 transition'}>
        {copied ? <Icons.check className="text-green-500" /> : <Icons.copy />}
      </button>
    </div>
  );
}
