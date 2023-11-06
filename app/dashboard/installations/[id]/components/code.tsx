import CopyButton from './copy-button';

type CodeProps = {
  children: string;
  allowCopy?: boolean;
};

export default function Code({ children, allowCopy = true }: CodeProps) {
  return (
    <div className="relative mx-auto mt-4">
      {allowCopy && (
        <CopyButton className="mt-2.5 absolute z-20 right-2" textToCopy={children} />
      )}
      <div className="bg-slate-700 text-white p-4 rounded-md">
        <div className="flex justify-between items-center mb-2"></div>
        <div className="overflow-x-auto">
          <pre id="code" className="text-gray-300 text-xs right-0 leading-4 ">
            <code className="break-all whitespace-normal">{children}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
