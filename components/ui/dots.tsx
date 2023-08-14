type DotProps = React.HTMLAttributes<Element>;

export const Dot = {
  green: (props: DotProps) => <div className="w-2 h-2 bg-green-600 rounded-full inline-block mr-2" {...props}></div>,
  red: (props: DotProps) => <div className="w-2 h-2 bg-red-600 rounded-full inline-block mr-2" {...props}></div>,
  yellow: (props: DotProps) => <div className="w-2 h-2 bg-yellow-600 rounded-full inline-block mr-2" {...props}></div>,
};
