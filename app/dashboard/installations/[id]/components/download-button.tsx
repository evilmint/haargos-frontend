import { Icons } from '@/components/icons';

export default function DownloadButton({
  fileName = 'download.txt',
  textToCopy = 'Copy default',
  mimeType = 'application/text',
}) {
  const download = () => {
    var a = document.createElement('a');
    var blob = new Blob([textToCopy], { type: mimeType });
    a.href = window.URL.createObjectURL(blob);
    a.download = fileName;
    a.click();
  };

  return (
    <div className="text-center my-5 text-gray-200 mt-1 absolute z-20 right-2">
      <button onClick={download} className={'rounded p-2 transition'}>
        <Icons.download />
      </button>
    </div>
  );
}
