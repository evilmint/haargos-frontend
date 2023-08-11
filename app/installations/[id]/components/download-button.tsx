import { Icons } from '@/components/icons';
import React, { useState } from 'react';

export default function DownloadButton({ fileName = 'download.txt', textToCopy = 'Copy default' }) {
  const [copied, setCopied] = useState(false);

  const download = () => {
    var a = document.createElement('a');
    var blob = new Blob([textToCopy], { type: 'application/text' });
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
  };

  const btnStyle = copied ? 'bg-gray-500 text-white' : '';

  return (
    <div className="text-center my-5 text-gray-200 mt-1 absolute z-20 right-2">
      <button onClick={download} className={btnStyle + 'rounded p-2 transition'}>
        {copied ? 'Downloaded' : <Icons.download />}
      </button>
    </div>
  );
}
