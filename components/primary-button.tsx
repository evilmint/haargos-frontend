import { cn } from '@/lib/utils';
import { Button } from '@/registry/new-york/ui/button';
import { MouseEventHandler } from 'react';

type PrimaryButtonProps = {
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
};

export function PrimaryButton({ ...props }: PrimaryButtonProps) {
  return <Button onClick={props.onClick} disabled={props.disabled} className={cn(props.className, 'bg-sr-600 dark:text-white')}>{props.children}</Button>;
}
